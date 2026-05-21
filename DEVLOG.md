# Hit Init — 개발 일지 (DEVLOG)

> 작업할 때마다 한두 줄씩 기록. 형식 자유. 최신이 위로 오게 적음.

---

## 2026-05-21 — **ver 1.3** (`versions/index_v1.3.html`)

**메인 패치: HR/도루/타격 SFX + Initia 지갑 + 4번 타자 변신 + GitHub Pages 라이브**

### HR 셀러브레이션
- `assets/hr_celebration_{1,2,3}.png` — ChatGPT가 그린 3장 HR 일러스트 (3등분 크롭)
- HR 확정 시 1장 랜덤으로 1.7초 풀스크린 오버레이 (scale-in + 골든 글로우 박스섀도우)
- 기존 "HOME RUN!!" 텍스트 배너 제거 — 이미지가 대체
- `playFirework()` 추가: 휘파람↗ + 저음 boom + 밴드패스 노이즈 크래클 × 2회 layered
- HR 확률: perfect+perfect [10,30,20,20,**20**] (HR 10% → 20%, SINGLE 30%로 감소)

### 도루 SFX
- intro 1초간 심장박동 BGM (저음 더블 펄스, 150 BPM)
- 발바닥 정답 → `playStealHit()` (square pitch-bend 두 번, 뿅뿅)
- 발바닥 오답 → `playStealMiss()` (220Hz square buzz, 삐)
- 타임아웃 자동 fail은 무음 (12개 동시 소리 방지)
- 발바닥 개수 12 → **11개**

### 새 타석 팡파레
- `playAtBatFanfare()`: 야구장 "Charge!" (G3 C4 E4 G4 - E4 - G4)
- 톱니파 + 옥타브 위 square = 브래스 톤
- `nextAtBat()` 끝에서 호출

### 타격 게이지 — 점수 구간별 3단계 (10 values × 3 pools, 0.80~1.90)
```js
HBOX_MULT_EASY (score 0–4)  = [0.80…1.30], mean 1.05
HBOX_MULT_MID  (score 5–9)  = [1.00…1.60], mean 1.30
HBOX_MULT_HARD (score 10+)  = [1.20…1.90], mean 1.55
```
가로 / 세로 각자 독립 추첨. 베이스는 atBat마다 점진 증가는 그대로.

### Hot Pitch 불꽃 트레일 (>1.2)
- PITCH 상태 첫 프레임에서 H 배수 pre-roll → `game.pendingHboxMult`에 저장
- 1.2 초과면 `drawHotPitchTrail()`:
  - 공 둘레 큰 황금 halo (반경 2.8배 방사형)
  - 코멧 트레일 (길이 4.6배, 흰→노란→주황→빨강 그라데이션)
  - 공 둘레 화염 7개 (깜빡이며 도는 flame tongue)
  - 트레일 핫스팟 6개

### 모바일 UI
- 도루 시퀀스에 D-pad 추가 (`.steal-dpad` 4개 큰 발바닥 버튼)
- ←노랑/↑빨강/↓초록/→파랑 매핑 + 일러스트와 동일한 회전
- 키보드 ← ↑ ↓ → 도 그대로 작동
- 임팩트 텍스트 폰트: Arial Black first + 계단식 4스텝 그림자 + font smoothing
- 타이틀 버튼 hover/focus 박스 제거 (일러스트 모양과 정렬 안 맞아서)
- viewport meta + touch-action 검증
- START / RESTART 버튼에 `unlockAudio()` 추가 (iOS Safari 안전망)

### Web3 — Initia L1 지갑 연결 (바닐라 + Keplr / Initia Wallet)
- 가짜 wallet 모달 → 진짜 `window.keplr` 호출로 교체
- `experimentalSuggestChain()`로 Initia 체인 자동 등록 (`interwoven-1`, INIT 6 decimals, bech32 `init`)
- 잔액 조회: `${REST}/cosmos/bank/v1beta1/balances/${addr}` → uinit / 1e6
- wallet pill에 `✓ init1ab…xyz · 1.2345 INIT` 표시
- 페이지 재방문 시 자동 재연결 (이전에 승인한 origin 한정)
- 모달 UI: 가짜 5개 (MetaMask/Coinbase/Phantom 등) → "Initia Wallet / Keplr" 1줄 + 설명 텍스트
- 클릭 즉시 +5 게임 코인 (`hitInitBonusClaimed` 키로 1회 제한, Keplr 없어도 적용)
- **메인넷용 통합. 테스트넷 연결 + 실제 INIT 트랜잭션은 보류**

### 4번 타자 — Super Saiyan 변신
- `assets/batter_4.png` — ChatGPT 생성 (검은 고양이 + 빨강/금 망토 + Initia 본 + 황금 오로라)
- `.batter4-overlay` (1024×1024 RGBA 투명배경) → `game.atBat === 4`일 때만 표시
- 위/아래 1.2% 떠다니는 float 애니메이션
- 위치: `left -4%, top 8%, width 48%` (제니 위 덮음)
- **CSS 트랩**: `.play-stack > img` 셀렉터를 `.play-stack > img.bg`로 좁혀야 함 (안 그러면 100% 강제됨)
- **OUT 확률 절반 + 균등 재분배**:
  - 기본 → `[13.125, 38.125, 12.5, 23.125, 13.125]`
  - perfect+perfect → `[12.5, 32.5, 10, 22.5, 22.5]`

### 배포
- GitHub repo: `fwmgsh/hit-init` 생성, main 브랜치 push
- GitHub Pages API로 자동 활성화 → 라이브 URL: `https://fwmgsh.github.io/hit-init/`
- `.gitignore` — 백업/dev 자산 64MB 제외 (`_archive`, `_bak`, 원본 PNG, 프로모 mp4 등)
- `README.md` 추가

### 보류 작업
- 테스트넷에서 Initia 지갑 연결 트러블슈팅
- 테스트넷 gameboy 도메인 등록 / 대체 주소 결정
- 점수 기록용 별도 주소 결정
- `@cosmjs/stargate` CDN 도입 + 실제 INIT 송금 (게임 시작 차감 + 점수 메모 기록)
- Firebase 랭킹 백엔드 + leaderboard 페이지
- favicon / og:image / 음소거 버튼
- Initia Auto-Signing / Ghost Wallets
- Initia 이코시스템 dApp 등록

---

## 2026-05-13 — **ver 1.2** (`versions/index_v1.2.html`)

**메인 패치: 도루(STEAL) 모드 + 자산 최적화**

### 도루 모드

- **트리거**: PITCH/HBOX_H 상태 (가로 게이지 결과 확정 전) + 1B 또는 2B 주자 + 목적지 비어있음
- **UI**: 좌하단 강아지 발바닥 버튼 (`.paw-btn`) — 도루 가능 시 황금 글로우로 깜빡임
- **입력**: `R` 키 또는 발바닥 클릭으로 발동
- **3단계 흐름**:
  1. **인트로** (1000ms): 10프레임 달리기 애니메이션 (`steal_run_01.png` ~ `steal_run_10.png`, 100ms/프레임 = 10fps, 모든 이미지 페이지 로드 시 프리로드)
  2. **시퀀스** (3500ms): 12개 강아지 발바닥 + 방향키 입력 (오디션 스타일)
     - 색상/회전으로 방향 표시: ←노랑, ↑빨강, ↓초록, →파랑
     - 총 3.5초 안에 12개 정확히 입력 (1개당 평균 0.29초)
     - 순서대로 매칭, 정답 → 초록 ✓, 오답 → 빨강 ✕
  3. **결과** (1500ms): `steal_safe.png` 또는 `steal_out.png` + 컬러 텍스트
- **성공 확률**: `0.80 - misses × 0.10`
  - 12/12 정답: 80% / 11/12: 70% / 10/12: 60% / ... / 4/12 이하: 0%
- **결과 처리**:
  - SAFE: 주자 전진 (1B→2B, 2B→3B). 1B+2B 동시 도루 시 둘 다
  - OUT: 잡힌 주자 제거 + 아웃 +N
  - 어느 경우든 at-bat 계속 (새 피치 재시작)
- **3B 도루 (홈 도루) 미지원** (의도)

### 새 상태 머신
- `STATE.STEAL` 추가
- 도루 중 normal update 일시정지 (`updateSteal()`만 실행)
- 메인 loop에 try/catch 추가 → 에러 발생해도 freeze 안 됨

### 자산 추가 + 최적화
- 도루 자산: `steal_run_01-10.png`, `steal_safe.png`, `steal_out.png`
- **HUD 패널 압축**: 10.36 MB → 1.51 MB (85% 감소, PIL 256-color palette + optimize)
- **도루 이미지 압축**: 3.65 MB → 1.25 MB (66% 감소)
- **미사용 자산 정리**: 56개 파일 `assets/_archive/`로 이동 (삭제 X, 복원 가능)
- 백업: `assets/_hud_originals_bak/`, `assets/_steal_originals_bak/`
- **최종 활성 자산 8.3 MB** (이전 57MB에서 정리)

### 튜닝 상수 (`index.html` 상단)
```js
STEAL_INTRO_MS        = 1000   // 달리기 1초
STEAL_NOTE_COUNT      = 12     // 발바닥 개수
STEAL_TOTAL_TIME_MS   = 3500   // 시퀀스 제한시간
STEAL_RESULT_MS       = 1500   // SAFE/OUT 결과 표시
STEAL_BASE_RATE       = 0.80   // 12/12 시 성공률
STEAL_MISS_PENALTY    = 0.10   // 실패당 감소율
```

### 기타
- 한글 전부 영문으로 (toasts, 스틸 UI, etc.)
- main loop에 try/catch 안전장치
- 도루 종료 시 stale 타이머 리셋 (PITCH 재시작)

---

## 2026-05-12 — **ver 1.1** (`versions/index_v1.1.html`)

**큰 변경**

1. **HUD 전면 교체 (32패널 이미지 swap 시스템)**
   - 기존: CSS 렌더링 다이아몬드/도트
   - 신규: ChatGPT가 그린 페인팅 패널 32장 (`assets/hud/hud_b<bases>_o<outs>.png`)
   - 8 베이스 상태 × 4 아웃 = 32 조합 모두 커버
   - `updateHUD()`에서 `(bases, outs)` → 파일명 매핑으로 단순 src swap
   - INNING 숫자만 동적 텍스트 오버레이 (`#inning-num`, `top:16%`)
   - 베이크인 HUD 영역과 정확히 같은 사이즈(21.5% × 49%, aspect 220/458)로 덮어서 비집고 나옴 없음

2. **타격 임팩트 효과 추가** (`triggerImpact(big)` 확장)
   - **Hit Stop**: 임팩트 순간 65ms(일반) / 110ms(perfect+perfect) 캔버스 freeze → 묵직한 무게감
   - **Zoom Punch**: shake 키프레임에 scale 합성 (1.055x / 1.085x)
   - **의성어 텍스트** (`.impact-text`): 만화체 영문 팝업
     - 일반: 노랑 `BANG!`/`CRACK!`/`WHACK!`/`SMACK!`
     - big (perfect+perfect): 빨강 `POW!`/`BOOM!`/`SMASH!`/`KAPOW!`
   - **별 버스트** (`impactBurst`): 임팩트 지점에서 7~12개 별 방사형 흩어짐 + 중력 + 페이드
   - 메인 루프에 hit-stop 게이트 추가, `swingT` 오프셋 보정으로 애니메이션 연속성 유지

3. **시도했다 되돌린 것**
   - **제니(타자) 15프레임 스윙 애니메이션** — 캐릭터 방향이 거꾸로 등 품질 미달로 revert. 자산만 `assets/swing_frames/`에 잔류
   - **이미지 합성 기반 HUD** 여러 시도 — 누더기 자국 / 베이크인 비침 문제로 ChatGPT 32패널 방식으로 최종 전환

**자산 추가**
- `assets/hud/hud_b{000,100,010,001,110,101,011,111}_o{0,1,2,3}.png` — 32장
- `assets/hud/hud_sheet.png` — 원본 32패널 시트 (참고용)
- `assets/swing_frames/*` — 스윙 애니메이션 시도 잔재 (사용 안 함)
- `assets/v2_game.png.bak` — 원본 BG 백업

**알려진 한계**
- `v2_game.png` 우상단 영역에 원래 베이크인 HUD가 그대로 존재 (새 HUD가 위에서 정확히 덮음)
- 컨테이너 `aspect-ratio: 220/458` 유지 필수 (변경 시 베이크인 비침 가능)

**다음 후보**
- [ ] 새 HUD 패널 디자인에 INNING 텍스트 색감/폰트 더 매칭
- [ ] 스윙 모션 재시도 (캐릭터 정확한 방향으로)
- [ ] HUD 패널을 더 큰 베이크 영역 확보 후 1배율로 표시

---

## 2026-05-06

**한 일**
- 프로젝트 폴더 전체 구조 파악 (1989 / hit init / 루트 문서들)
- 현재 결과물(`index.html`, `game.png`, `HANDOVER.md`) 기반으로 **역기획안 작성** → `hit init 기획안 ver0.1.md`로 저장
- 브라우저에서 게임 실행 확인
- 개발 일지(DEVLOG.md) 시작 결정

**메모**
- 역기획안은 "원래 기획자가 뭘 만들고 싶었을까?"를 결과물에서 거꾸로 추론한 가상 PRD. 추정한 부분은 *(추정)* 으로 표시해뒀음
- 빌드 시스템 없는 단일 HTML 구조 = "단순함" 원칙 유지 중

**다음 할 일 후보**
- [ ] 모바일 사파리에서 사운드 정상 동작 확인 (HANDOVER.md 11번 미검증 항목)
- [ ] 게임오버 화면 한국어 옵션 추가 검토
- [ ] 5초 자동 MISS 시 청각 피드백 보강
- [ ] 역기획안 ver0.2 — 누락/오추론 보완

---

<!-- 새 엔트리는 이 위에 추가 -->
