// Vercel Function: signs a score payload with the server's secp256k1 key.
//
// Contract:
//   POST /api/sign-score
//   body: { score, atbats, hrs, wallet, nonce, t }
//   200: { signature, canonical }
//   4xx: { error }
//
// The signature is over sha256(canonical) where canonical is:
//   HIT_INIT_v1|w=<wallet>|s=<score>|a=<atbats>|h=<hrs>|t=<t>|n=<nonce>
//
// The client submits a Cosmos tx with memo:
//   HIT_INIT:s=<score>:a=<atbats>:h=<hrs>:t=<t>:n=<nonce>:sig=<hex>
// The leaderboard reconstructs the canonical string from the memo + the tx
// sender address, then verifies the signature against the public key that
// is baked into the frontend.

import * as secp from '@noble/secp256k1';
import { sha256 } from '@noble/hashes/sha256';

const PRIVKEY_HEX = process.env.SCORE_SIGN_PRIVKEY || '';

function bad(res, msg, code = 400) {
  return res.status(code).json({ error: msg });
}

export default async function handler(req, res) {
  // CORS — game is hosted on a different origin than the API.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return bad(res, 'POST only', 405);
  if (!PRIVKEY_HEX) return bad(res, 'server misconfigured (no key)', 500);

  const body = req.body || {};
  const { score, atbats, hrs, wallet, nonce, t } = body;

  // Basic bounds / shape checks. Tight caps make brute-forcing fake scores
  // useless — a real playthrough won't approach these numbers.
  if (typeof score  !== 'number' || score  < 0 || score  > 30)  return bad(res, 'invalid score');
  if (typeof atbats !== 'number' || atbats < 1 || atbats > 30)  return bad(res, 'invalid atbats');
  if (typeof hrs    !== 'number' || hrs    < 0 || hrs    > 15)  return bad(res, 'invalid hrs');
  if (hrs > score) return bad(res, 'hrs cannot exceed score');
  if (typeof wallet !== 'string' || !/^init1[a-z0-9]{38}$/.test(wallet))
    return bad(res, 'invalid wallet');
  if (typeof nonce !== 'string' || nonce.length < 4 || nonce.length > 12 || !/^[a-z0-9]+$/i.test(nonce))
    return bad(res, 'invalid nonce');
  if (typeof t !== 'number' || !Number.isFinite(t))
    return bad(res, 'invalid t');

  // Reject payloads that are too far from the current wall clock to keep
  // signatures fresh. Loose window because Keplr signing / tx broadcast
  // still comes between signing here and the tx landing on chain.
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - t) > 300) return bad(res, 'stale timestamp');

  const canonical = `HIT_INIT_v1|w=${wallet}|s=${score}|a=${atbats}|h=${hrs}|t=${t}|n=${nonce}`;
  const msgHash   = sha256(new TextEncoder().encode(canonical));
  const priv      = secp.etc.hexToBytes(PRIVKEY_HEX);
  const sig       = await secp.signAsync(msgHash, priv);      // compact 64-byte signature
  const sigHex    = secp.etc.bytesToHex(sig.toCompactRawBytes());

  return res.status(200).json({ signature: sigHex, canonical });
}
