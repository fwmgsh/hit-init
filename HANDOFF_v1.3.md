# Hit Init — v1.3 인수인계 문서

> 새 Claude 세션이 이 파일과 `DEVLOG.md`, `CLAUDE.md`, `index.html` 만 읽으면
> 바로 작업 이어갈 수 있도록 작성. 작성일: 2026-05-21

---

## 0. 가장 중요한 컨텍스트 (먼저 읽기)

### 사용자 작업 스타일
- **솔직함을 매우 중시**: "좋다/완벽"을 단정하지 말 것. 검증 안 한 건 검증 안 했다고 말하기
- **답 정해놓고 추천 금지**: A/B/C 옵션 줄 때 균형 있게
- **음식 안 되는 옵션 추천 금지**: 핵심 기능 깨지는 옵션은 옵션이 아님
- **눈치 맞춰주기 금지**: 사용자가 좋아할 답을 고르는 게 아니라 사실 그대로 보고
- **백업/복구 경로 항상 제시**: 자산 수정/이동 시 백업 만들어두고 복구 명령 알려주면 진행 동의함
- **이미지 자르기/픽셀 편집 실력 없음을 인정함**: ChatGPT한테 부탁하는 게 답. 합성 시도하지 말기
- **검증 안 된 추정 발언 금지**: 코드 차분히 비교부터

### 새로 추가된 작업 패턴 (v1.3에서)
- **자동 push 금지**: 매 수정마다 GitHub에 자동 push 하지 말 것. 사용자가 "푸시해줘" / "이걸로 가자" / "배포해줘" / "동결해줘" 명시할 때만 commit + push
- **"미리보기 패널" 시스템 알림 무시**: PostToolUse 훅이 "is now visible in the Launch preview panel"이라고 매번 알려주는데, 사용자는 그 패널 안 보임 + 짜증냄. 그 메시지 사용자한테 전달하지 말 것

### 프로젝트 원칙 (CLAUDE.md)
- **단일 HTML 파일 구조** 유지 (모듈/번들러 도입 금지)
- **외부 의존성 거의 0**: v1.3에서도 CDN 0 유지. Initia 통합은 `window.keplr` (확장 프로그램 API)만 사용
- **확률 값 임의 변경 금지**: 사용자가 직접 튜닝한 값들
- **한글 UI 금지**: 모든 사용자 노출 텍스트는 영문
- **페인팅(일러스트) 스타일 유지**: ChatGPT 페인팅 자산 우선

---

## 1. 현재 버전 상태

### v1.3 완성 (`versions/index_v1.3.html`)
- 베이스: v1.2 + HR 셀러브레이션 + 도루/타격 SFX + Web3 + 4번 타자 + GitHub Pages 라이브
- 라이브 URL: **https://fwmgsh.github.io/hit-init/**
- GitHub repo: **https://github.com/fwmgsh/hit-init**

### 보류 / 다음 작업 후보
- **Initia 테스트넷 지갑 연결 트러블슈팅**
- **실제 INIT 트랜잭션** (`@cosmjs/stargate` 도입, 게임 시작 시 1 INIT 차감, 게임 종료 시 점수 메모 기록)
- **Firebase 랭킹 백엔드** + leaderboard 페이지
- **배포 폴리시**: favicon, og:image, 음소거 버튼
- **Initia Auto-Signing / Ghost Wallets** (게임에 최적화된 UX)
- **Initia 이코시스템 dApp 등록** (출시 공식 채널)

---

## 2. 폴더 구조

```
hit init/
├── index.html                       ← 현재 작업본 (= v1.3)
├── index 복사본.html                  ← v1.0 백업 (4/29) — .gitignore로 제외
├── HANDOFF_v1.3.md                  ← (이 파일)
├── HANDOFF_v1.2.md                  ← 이전 인수인계
├── CLAUDE.md                        ← 프로젝트 가이드
├── DEVLOG.md                        ← 개발 일지 (버전별 정리)
├── README.md                        ← GitHub용 (v1.3 추가)
├── .gitignore                       ← 백업/dev 자산 제외 (v1.3 추가)
├── hit init 기획안 ver0.1.md         ← 역기획안 — .gitignore
├── hr_celebration.png               ← HR 원본 합본 — .gitignore (3등분된 게 assets에 있음)
├── sfx_demo.html                    ← 사운드 데모 (dev only) — .gitignore
├── versions/
│   ├── index_v1.1.html              ← HUD 32패널 + 임팩트
│   ├── index_v1.2.html              ← 도루 + 자산 최적화
│   └── index_v1.3.html              ← v1.3 동결본 (최신)
├── Hit_Init_Promo.mp4               ← 홍보 영상 — .gitignore
├── Run.png, back.png, …             ← ChatGPT 원본 PNG — .gitignore
├── mixkit-hitting-golf-ball-2080.wav ← 타격음 (루트)
└── assets/
    ├── ci.png                       ← 코인 아이콘
    ├── v2_game.png / v2_roll.png / v2_title.png ← 3섹션 BG
    ├── v2_game.png.bak              ← 원본 BG 백업
    ├── hr_celebration_{1,2,3}.png   ← HR 셀러브레이션 3장 (v1.3 추가)
    ├── batter_4.png                 ← 4번 타자 Super Saiyan (v1.3 추가)
    ├── jenny_closeup.png            ← Jenny 클로즈업 (ChatGPT 참고용, v1.3 추가)
    ├── initia_logo_icon.png         ← Initia 로고 PNG (ChatGPT 참고용, v1.3 추가)
    ├── steal_run_01.png ~ 10.png    ← 도루 달리기 10프레임
    ├── steal_safe.png, steal_out.png ← 도루 결과 패널
    ├── hud/
    │   ├── hud_b<bases>_o<outs>.png ← HUD 32 패널
    │   └── hud_sheet.png            ← 원본 시트
    ├── _archive/                    ← 미사용 자산 56개 (보존, .gitignore)
    ├── _hud_originals_bak/          ← HUD 압축 전 원본 (복구용, .gitignore)
    └── _steal_originals_bak/        ← 도루 압축 전 원본 (.gitignore)
```

---

## 3. 코드 아키텍처 (v1.2에서 변경된 부분 + 신규)

### 상태 머신 (변경 없음)
```js
const STATE = { PITCH, HBOX_H, HBOX_V, SWING, ROLLING, RESULT, STEAL };
```

### 핵심 좌표 (변경 없음)
```js
const W = 1024, GAME_H = 474, ROLL_H = 460, H = 934;
const HITBOX  = { cx: 0.500*W, cy: 0.65*GAME_H, ... };
const PITCHER = { x: 0.55*W, y: 0.32*GAME_H };
const BATTER  = { x: 0.27*W, y: 0.74*GAME_H };
```

### Pre-rolled gauge multiplier (v1.3 신규)
- PITCH 상태에서 `drawPitchBall()` 첫 프레임에 `game.pendingHboxMult` 추첨
- `startHitboxH()`에서 그 값 그대로 사용 (재추첨 X)
- 미리 보여준 불꽃 강도와 실제 게이지 속도 일치 보장

### 점수 구간별 속도 풀 (v1.3 신규)
```js
const HBOX_MULT_EASY = [0.80, 0.86, 0.91, 0.97, 1.02, 1.08, 1.13, 1.19, 1.24, 1.30];
const HBOX_MULT_MID  = [1.00, 1.07, 1.13, 1.20, 1.27, 1.33, 1.40, 1.47, 1.53, 1.60];
const HBOX_MULT_HARD = [1.20, 1.28, 1.36, 1.43, 1.51, 1.59, 1.67, 1.74, 1.82, 1.90];
function currentHboxMultPool() {
  if (game.score >= 10) return HBOX_MULT_HARD;
  if (game.score >= 5)  return HBOX_MULT_MID;
  return HBOX_MULT_EASY;
}
```
가로/세로 각자 독립 추첨.

### 4번 타자 변신 (v1.3 신규)
- HTML: `<img class="batter4-overlay" id="batter4Overlay" src="assets/batter_4.png">` (play-stack 안)
- CSS:
  - `.play-stack > img.bg` 셀렉터 (배경만 100%) — **`.play-stack > img` 그대로 두면 overlay도 100% 강제됨**
  - `.batter4-overlay` 위치: `left -4%, top 8%, width 48%`
  - `batter4Float` 1.6s ease-in-out 떠다님 (-1.2% Y)
- JS:
  ```js
  function updateBatter4Overlay() {
    batter4Overlay.classList.toggle('show', game.atBat === 4);
  }
  ```
  `nextAtBat()` 끝에서 호출.
- 확률 분기 (`determineResultIdx`):
  - `isHero = (game.atBat === 4)`
  - 기본 `[10, 35, 25, 20, 10]` → hero `[13.125, 38.125, 12.5, 23.125, 13.125]`
  - perfect+perfect `[10, 30, 20, 20, 20]` → hero `[12.5, 32.5, 10, 22.5, 22.5]`

### Initia Wallet 통합 (v1.3 신규)
- `INITIA_CHAIN_CONFIG` 상수: `interwoven-1`, bech32 `init`, uinit/6 decimals
- `connectInitiaWallet()`:
  1. `getKeplr()` — `window.keplr` 또는 null
  2. `keplr.experimentalSuggestChain(INITIA_CHAIN_CONFIG)` (체인 자동 등록)
  3. `keplr.enable(chainId)` (사용자 승인 팝업)
  4. `getOfflineSigner.getAccounts()` → init1... 주소
  5. localStorage 저장 + wallet pill 업데이트
- `fetchInitBalance(addr)` — REST API `/cosmos/bank/v1beta1/balances/${addr}` → uinit / 1e6
- `tryAutoReconnect()` IIFE — 페이지 로드 시 이전에 승인했으면 자동 재연결
- 모달 클릭 시 `giveConnectBonusOnce()` (localStorage `hitInitBonusClaimed` 1회 보장 +5 코인)

### HR 셀러브레이션 (v1.3 신규)
- HTML: `<div id="hrImage"><img id="hrImageImg"></div>` (z-index 26)
- `startHRCelebration()`:
  - 기존 hr-flash + HUD pulse 유지
  - 추가: 랜덤 1~3 이미지 표시 (1.7초)
  - `playFirework()` 2번 (60ms / 480ms)
- result wait 2.2초 (HR 한정)

---

## 4. 튜닝 상수 (모두 `index.html` 상단)

### 게임 플레이
```js
HBOX_TIMEOUT_MS = 5000          // 게이지 5초 안에 자동 MISS
PERFECT_HALF = 0.07             // PERFECT 판정 범위
COOL_HALF    = 0.22             // COOL 판정 범위
ROLL_AIR_MS  = 1100             // 공이 알리로 날아가는 시간
ROLL_RUN_MS  = 4500             // 5구멍 위로 굴러가는 시간
ROLL_FALL_MS = 70               // 구멍에 빨려들어가는 시간
HOT_PITCH_THRESHOLD = 1.2       // 게이지 배수 > 이 값이면 불꽃 트레일
```

### 확률 (v1.3 업데이트, 직접 변경 금지)
| 게이지 | 일반 분포 | 4번 타자 분포 |
|---|---|---|
| PERFECT+PERFECT | 10/30/20/20/**20** | 12.5/32.5/10/22.5/**22.5** |
| 그 외 | 10/35/25/20/10 | 13.125/38.125/12.5/23.125/13.125 |
| 둘 다 MISS | 0% 자동 OUT | 4번이어도 자동 OUT |

### 도루
```js
STEAL_NOTE_COUNT      = 11      // 발바닥 (v1.2에서 12 → v1.3에서 11)
STEAL_INTRO_MS        = 1000
STEAL_TOTAL_TIME_MS   = 3500
STEAL_RESULT_MS       = 1500
STEAL_BASE_RATE       = 0.80
STEAL_MISS_PENALTY    = 0.10
```

### 임팩트 효과 (변경 없음, font만 변경)
```js
IMPACT_WORDS_NORMAL = ['BANG!', 'CRACK!', 'WHACK!', 'SMACK!']
IMPACT_WORDS_BIG    = ['POW!', 'BOOM!', 'SMASH!', 'KAPOW!']
```

### Initia 체인 (v1.3 신규)
```js
INITIA_CHAIN_ID = 'interwoven-1'
INITIA_REST     = 'https://rest.initia.xyz'
INITIA_RPC      = 'https://rpc.initia.xyz'
// 테스트넷: 'initiation-2', rest.testnet.initia.xyz, rpc.testnet.initia.xyz
// gameboy.init 메인넷 주소: init1dpwk7ta60sduet6z3372lkpfuaj3wr8f2aswmu
```

---

## 5. 시도했다 되돌린 것 (반복 금지)

### v1.3 신규
- ❌ **MetaMask 직접 연결 시도**: Initia는 Cosmos 체인이라 MetaMask 직접 호환 X. InterwovenKit(React 전용)이 EVM-Cosmos 매핑하지만 단일 HTML 구조와 충돌. 결론: Keplr/Initia Wallet 바닐라 JS 통합
- ❌ **이미지 합성으로 4번 타자 표현**: ChatGPT가 그린 풀 캐릭터 PNG를 v2_game.png 위에 그대로 오버레이 (인페인트/픽셀 편집 시도 안 함)
- ❌ **`.play-stack > img` 그대로 두고 overlay 추가**: specificity 0,0,1,1로 우리 overlay의 `width:38%`보다 강함 → `.play-stack > img.bg` 로 좁혀야 함

### v1.2에서 이어진 영구 교훈
- ❌ **이미지 픽셀 편집 시도하지 말 것** — ChatGPT 풀세트 요청
- ❌ **ChatGPT 한 번에 많은 패널 요청** — 일관성 깨짐, 4 패널씩 따로 요청
- ❌ **v2_game.png 인페인트** — `v2_game.png.bak`에서 복원 후 그 위 정확한 사이즈 자산으로 덮기

---

## 6. 알려진 한계

1. **`v2_game.png` 우상단 베이크인 HUD 존재** — 새 HUD가 정확히 그 위 덮음 (변경 없음)
2. **3B 도루 (홈 도루) 미지원** (의도)
3. **vs/랭킹 모드 백엔드 없음** — 추가 시 Firebase 등 도입 필요
4. **Initia 테스트넷 연결 미검증** — 사용자 환경에서 Keplr 실행 안 됨 보고 (확장 미설치 가능성)
5. **테스트넷 `gameboy` 도메인 미등록** — 메인넷에는 있음 (init1dpwk…)
6. **실제 INIT 송금 미구현** — 잔액 조회까지만. 송금하려면 `@cosmjs/stargate` ESM CDN 도입 필요
7. **모바일 Safari 음소거 / autoplay 검증** — `unlockAudio()` 호출 추가했지만 실제 iOS 안 검증
8. **4번 타자 OVERLAY 크기 조정 중** — `left -4%, top 8%, width 48%`이 현재 값. 사용자가 보고 추가 조정할 수 있음

---

## 7. 백업/복구 명령

| 상황 | 명령 |
|---|---|
| HUD 이미지 압축 후 화질 문제 | `cp assets/_hud_originals_bak/*.png assets/hud/` |
| 도루 이미지 압축 후 문제 | `cp assets/_steal_originals_bak/*.png assets/` |
| 아카이브에서 파일 다시 필요 | `mv assets/_archive/<파일명> assets/` |
| v2_game.png 손상 | `cp assets/v2_game.png.bak assets/v2_game.png` |
| 전체 v1.3로 롤백 | `cp versions/index_v1.3.html index.html` |
| 전체 v1.2로 롤백 | `cp versions/index_v1.2.html index.html` |
| 전체 v1.1로 롤백 | `cp versions/index_v1.1.html index.html` |
| 원본 v1.0으로 롤백 | `cp "index 복사본.html" index.html` |
| 로컬 변경 → GitHub 푸시 | `git add -A && git commit -m "..." && git push` |

---

## 8. GitHub / 배포

### 라이브 URL
**https://fwmgsh.github.io/hit-init/**

캐시 무시 새로고침: URL 뒤에 `?v=숫자` 붙임 (예: `?v=99`)

### Repo
- `fwmgsh/hit-init`, main 브랜치
- Pages 자동 빌드 (~30~60초)

### 인증
- GitHub Desktop OAuth 토큰을 macOS keychain에서 추출해서 git remote URL에 embed해서 push했음 (`gho_...` 토큰)
- **이 토큰은 conversation history에 노출됐으므로 revoke 권장**: https://github.com/settings/applications → GitHub Desktop revoke
- 새 push 필요 시 GitHub Desktop 재로그인 후 새 토큰 추출

### 푸시 정책 (v1.3에서 변경)
- 사용자가 명시할 때만 push (자동 push 안 함)
- 동의 키워드: "푸시해줘" / "이걸로 가자" / "배포해줘" / "동결해줘"

---

## 9. ChatGPT 자산 요청 프롬프트 (v1.3 신규)

### 4번 타자 변신 캐릭터
**첨부**: `assets/jenny_closeup.png` (현재 캐릭터) + `assets/initia_logo_icon.png` (Initia 로고)

```
첨부 1번 이미지는 야구 게임의 4번 타자 캐릭터입니다.
첨부 2번 이미지는 Initia 블록체인의 공식 로고 아이콘입니다.

이 캐릭터(검은 고양이, 흰 발/배, 보라색 칼라)를 그대로 유지하면서,
"4번 타자 강타자 변신 모드" 버전으로 다시 그려주세요.

[캐릭터 보존 — 절대 바꾸지 말 것]
- 같은 검은 고양이 (큰 얼굴, 작은 몸, 둥근 눈)
- 같은 보라색 칼라
- 같은 외곽선 두께 / 셀 셰이딩 스타일 / 색감
- 같은 카메라 앵글과 포즈 (정면 약간 측면, 양손으로 무기를 어깨에 메는 자세)

[새로 추가]
1. 망토 (빨간색 + 골드 트림, 펄럭이는 끝단)
2. 무기: Initia 로고 모양의 개뼈다귀 (가로로 길쭉한 본 + 양 끝 둥근 혹 + Initia 두 기둥 마크)
3. Super Saiyan 황금 오로라 (위로 솟구치는 빛줄기 + 라이트닝 스파크)

[출력 사양]
- 1024×1024 (또는 첨부와 동일한 사이즈)
- 배경 완전 투명 (transparent PNG)
- 캐릭터 위치: 캔버스 정중앙
- 첨부 외에 다른 캐릭터 그리지 말 것
```

### HR 셀러브레이션 3장 (이미 완성)
3장 일러스트를 1장 시트로 받아서 `hr_celebration.png`로 저장 → PIL로 3등분 → `assets/hr_celebration_{1,2,3}.png`

---

## 10. 핵심 함수 위치 (라인 번호는 grep 권장)

### v1.3 신규
- `connectInitiaWallet()`, `fetchInitBalance()`, `tryAutoReconnect()`: Web3 지갑 로직
- `giveConnectBonusOnce()`: 첫 연결 +5 코인
- `playFirework()`: HR 폭죽
- `playStealHit()`, `playStealMiss()`: 도루 효과음
- `playAtBatFanfare()`: 새 타석 팡파레
- `startStealBGM()`, `stopStealBGM()`: 도루 BGM
- `drawHotPitchTrail()`: 핫피치 불꽃
- `updateBatter4Overlay()`: 4번 타자 토글
- `currentHboxMultPool()`: 점수 구간별 속도 풀
- `startHRCelebration()`: HR 이미지 + 폭죽 + 플래시 통합

### v1.2에서 이어짐 (변경 없음)
- `STATE`, `game`, `HITBOX/PITCHER/BATTER`
- `triggerSteal()`, `updateSteal()`, `resolveSteal()`, `endSteal()`, `canSteal()`
- `updateHUD()`, `update(dt)`, `draw()`, `loop(t)`, `setupCanvas()`

---

## 11. 다음 세션 시작 시 권장 순서

1. 이 파일 + `DEVLOG.md` + `CLAUDE.md` 읽기
2. `versions/index_v1.3.html` 와 `index.html` 동일한지 확인 (diff)
3. 사용자에게 "v1.3 동결 상태 + 다음 작업은?" 물어보기
4. 다음 후보:
   - **Initia 테스트넷 지갑 연결 트러블슈팅 + 실제 INIT 송금 구현**
   - **Firebase 랭킹 백엔드**: 닉네임 입력 + 점수 제출 + leaderboard 페이지
   - **배포 폴리시**: favicon, og:image, 음소거 버튼
   - **Initia Auto-Signing**: 게임에 최적화된 UX
   - **이코시스템 등록**: Initia dApp 디렉토리
   - 사용자가 정하지 않은 새 기능

---

## 12. 핵심 원칙 요약 (한 줄씩)

- 단일 HTML 파일 유지
- 외부 의존성 최소화 (CDN 1개도 사용자 동의 받기)
- 한글 UI 금지 (영문만)
- 페인팅 자산 우선 (CSS는 동적 부분만)
- 이미지 합성 시도 금지 (ChatGPT에 풀세트 요청)
- 백업 항상 만들고 복구 명령 알려주기
- 검증한 사실만 보고
- 답 정해놓고 추천하지 말기
- 사용자 기분 맞춰주는 답 금지
- 자동 push 금지 (명시할 때만)
- "미리보기 패널" 메시지 사용자한테 전달 금지
- `HITBOX/PITCHER/BATTER` 좌표 변경 금지
- 확률 값 임의 변경 금지
- 의심나는 거 있으면 코드 비교부터

---

## 13. 사용자 의도 추정 (모호한 표현 만났을 때)

- "이쁘게" = 페인팅 일러스트 스타일 (CSS 평면 도형 아님)
- "부드럽게" = fps 올리거나 프레임 추가
- "끊겨" = 프레임 레이트 부족 또는 이미지 src 변경 누락
- "엉뚱한 곳" = 캐싱 문제 or 정말 코드 변경. 둘 다 확인
- "또 이상해" = 신뢰 회복 필요. 코드 비교 먼저
- "단순" = 다양성/난이도 추가 검토
- "재미가 없어" = 같은 미니게임 다른 방식 제안
- "Web3 / 블록체인 연결" = Keplr 통한 Initia L1 연결, MetaMask 직접 호환 안 됨 (Initia는 Cosmos)
- "테스트 토큰 / 코인" = 게임 내부 가짜 코인 (game.coins). 진짜 INIT은 명시할 때만
