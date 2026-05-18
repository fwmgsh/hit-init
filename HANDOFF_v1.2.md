# Hit Init — v1.2 인수인계 문서

> 새 Claude 세션이 이 파일과 `DEVLOG.md`, `CLAUDE.md`, `index.html` 만 읽으면
> 바로 작업 이어갈 수 있도록 작성. 작성일: 2026-05-13

---

## 0. 가장 중요한 컨텍스트 (먼저 읽기)

### 사용자 작업 스타일
- **솔직함을 매우 중시**: "좋다/완벽"을 단정하지 말 것. 검증 안 한 건 검증 안 했다고 말하기. 사용자가 평가하게 둠
- **답 정해놓고 추천 금지**: A/B/C 옵션 줄 때 균형 있게. 특히 "B는 별로다" 식으로 한 선택지를 깎아내리며 다른 걸 미는 짓 하지 말 것 (실제로 그러다가 혼남)
- **음식 안 되는 옵션 추천 금지**: 게임에 게임 상태 반영 안 되는 HUD 같은 거 추천하면 "또라이"라고 함. 핵심 기능 깨지는 옵션은 옵션이 아님
- **눈치 맞춰주기 금지**: 사용자가 좋아할 답을 고르는 게 아니라, 사실 그대로 보고. 틀린 결과를 "좋다"고 하는 건 거짓말
- **백업/복구 경로 항상 제시**: 자산 수정/이동 시 사용자가 신뢰 못함. 백업 만들어두고 복구 명령 알려주면 진행 동의함
- **이미지 자르기/픽셀 편집 실력 없음을 인정함**: ChatGPT한테 부탁하는 게 답. 합성 시도하지 말기 (누더기 나옴)
- **검증 안 된 추정 발언 금지**: "캐시 문제겠지", "내 컴퓨터 문제겠지" 같은 추측 말고 코드 차분히 비교부터

### 프로젝트 원칙 (CLAUDE.md)
- **단일 HTML 파일 구조**: 빌드 시스템 없음. 모든 게 `index.html`에 인라인. 절대 깨지 말 것
- **외부 의존성 0**: CDN 라이브러리 X
- **확률 값 임의 변경 금지**: 사용자가 직접 튜닝한 값들
- **`HANDOVER.md` (상위 폴더) "변경 시 주의" 항목** 무시 금지

### UI 원칙
- **한글 UI 금지**: 모든 사용자 노출 텍스트는 영문. 코드 주석은 영문 또는 한글 OK
- **페인팅(일러스트) 스타일 유지**: CSS로 평면 도형 그리기보다 ChatGPT 페인팅 자산 선호. 단 CSS 렌더링의 일관성이 필요할 때만 예외
- **베이크인 vs 동적 렌더링 균형**: `v2_game.png`에 베이크된 HUD/Jenny는 그대로 두고, 그 위에 정확히 같은 사이즈의 새 자산을 덮는 패턴

---

## 1. 현재 버전 상태

### v1.2 완성 (`versions/index_v1.2.html`)
- 베이스: v1.1 + 도루(STEAL) 모드 + 자산 최적화
- 모든 한글 UI 영문화 완료
- 자산 정리 끝남 (활성 8.3MB)
- 웹 배포 준비됨

### 다음 작업 후보 (사용자 의도)
- **vs 모드 (실시간 PvP)** — 백엔드 필요 (Firebase 추천, 비용 거의 0)
- **랭킹판 (2주 단위 집계)** — vs 모드와 동일 백엔드
- **도루 달리기 더 부드럽게** — ChatGPT 추가 프레임 요청 (15-20개)
- **웹 배포** — itch.io 또는 GitHub Pages

---

## 2. 폴더 구조

```
hit init/
├── index.html                       ← 현재 작업본 (= v1.2)
├── index 복사본.html                  ← Apr 29 백업 (v1.0 기준)
├── HANDOFF_v1.2.md                  ← (이 파일)
├── CLAUDE.md                        ← 프로젝트 가이드
├── DEVLOG.md                        ← 개발 일지 (버전별 정리)
├── hit init 기획안 ver0.1.md         ← 역기획안
├── versions/
│   ├── index_v1.1.html              ← HUD 32패널 + 임팩트 효과
│   └── index_v1.2.html              ← 도루 + 자산 최적화 (최신 동결본)
├── Run.png                          ← ChatGPT 5컷 도루 만화 (참고)
├── ball sign.png                    ← ChatGPT 12 HUD 패널 시트 (참고)
├── good2.png, 마지막.png             ← ChatGPT HUD 시트 변형들
├── Hit_Init_Promo.mp4               ← 홍보 영상
├── mixkit-hitting-golf-ball-2080.wav ← 타격음 (루트, index.html에서 참조)
└── assets/
    ├── ci.png                       ← 코인 아이콘
    ├── v2_game.png                  ← 게임 BG (1024×474, 베이크 HUD 포함)
    ├── v2_game.png.bak              ← 원본 백업
    ├── v2_roll.png                  ← 롤링 알리 BG (1024×460)
    ├── v2_title.png                 ← 타이틀 BG (1024×602)
    ├── steal_run_01.png ~ 10.png    ← 도루 달리기 10프레임
    ├── steal_safe.png, steal_out.png ← 도루 결과 패널
    ├── hud/
    │   ├── hud_b<bases>_o<outs>.png ← HUD 32 패널 (8 베이스 × 4 아웃)
    │   ├── hud_bg.png               ← 빈 HUD BG (사용 안 함, 백업용)
    │   └── hud_sheet.png            ← ChatGPT 시트 원본 (참고)
    ├── _archive/                    ← 미사용 자산 56개 (보존)
    ├── _hud_originals_bak/          ← HUD 압축 전 원본 (복구용)
    └── _steal_originals_bak/        ← 도루 이미지 압축 전 원본
```

**활성 자산 8.3MB. 웹 배포 시 `_archive/`, `_*_bak/` 폴더는 제외 OK.**

---

## 3. 코드 아키텍처

### 상태 머신 (STATE)
```js
const STATE = {
  PITCH:   'pitch',     // 투수가 공 던지는 동안
  HBOX_H:  'hbox_h',    // 가로 게이지 입력 받기
  HBOX_V:  'hbox_v',    // 세로 게이지 입력 받기
  SWING:   'swing',     // 스윙 모션 + 임팩트 효과
  ROLLING: 'rolling',   // 공이 5구멍 위로 굴러감
  RESULT:  'result',    // SAFE/OUT 결과 표시
  STEAL:   'steal',     // 도루 미니게임 진행 중
};
```

### 핵심 좌표 (`index.html` 라인 ~1391)
```js
const HITBOX  = { cx: 0.500*W, cy: 0.65*GAME_H, barLen: 0.46*GAME_H, barThick: 0.090*W };
const PITCHER = { x: 0.55*W, y: 0.32*GAME_H };
const BATTER  = { x: 0.27*W, y: 0.74*GAME_H };
```
W=1024, GAME_H=474. **절대 변경 금지** — v2_game.png 베이크인 위치와 맞춰져 있음.

### HUD 시스템 (v1.1)
- `<img id="hudPanel">` 단일 이미지 swap
- 게임 상태 → 파일명: `hud_b<bases>_o<outs>.png`
  - bases: 3자리 binary (1B, 2B, 3B 비트), 예: `100` = 1B만 점등
  - outs: 0/1/2/3
- INNING 숫자만 동적 텍스트 (`#inning-num`)
- 컨테이너 aspect-ratio `220/458` 로 베이크 영역에 정확히 맞춤

### 도루 시스템 (v1.2)
- 트리거 조건: `canSteal()` — PITCH/HBOX_H + horizontal null + 1B/2B 주자 + 목적지 비어있음
- 3단계: intro → sequence → result
- 종료 시 stale 타이머 리셋 + 새 PITCH 시작

### 임팩트 효과 (v1.1)
- `triggerImpact(big)`: hit stop + zoom punch + 의성어 + 별 burst
- main loop hit stop 게이트: `if (performance.now() >= game.hitStopUntil) { update + draw }`

### 에러 안전망
- main loop에 try/catch — 어떤 함수에서 throw 해도 freeze 방지
- 콘솔에 `[loop] update/draw threw — state=... steal.phase=... <err>` 출력

---

## 4. 튜닝 상수 (모두 `index.html` 상단)

### 게임 플레이
```js
HBOX_TIMEOUT_MS = 5000          // 게이지 5초 안에 입력 안 하면 자동 MISS
PERFECT_HALF = 0.07             // PERFECT 판정 범위 (±7%)
COOL_HALF    = 0.22             // COOL 판정 범위 (±22%)
HBOX_RAND_MULTIPLIERS = [0.80, 0.90, 1.00, 1.10, 1.20]  // 매크로 방어용
ROLL_AIR_MS  = 1100             // 공이 알리로 날아가는 시간
ROLL_RUN_MS  = 4500             // 공이 5구멍 위로 굴러가는 시간
ROLL_FALL_MS = 70               // 구멍에 빨려들어가는 시간
```

### 확률 (절대 임의 변경 금지)
| 게이지 (가로+세로) | 롤 진입률 | 결과 분포 (TRIPLE/SINGLE/OUT/DOUBLE/HR) |
|---|---|---|
| PERFECT+PERFECT | 95% | **10/40/20/20/10** (보너스) |
| PERFECT+COOL    | 85% | 10/35/25/20/10 (기본) |
| COOL+COOL       | 75% | 10/35/25/20/10 |
| 1×MISS          | 30% | 10/35/25/20/10 |
| MISS+MISS       | 0%  | 자동 OUT |

### 도루
```js
STEAL_INTRO_MS        = 1000    // 달리기 인트로 (10 frames × 100ms)
STEAL_NOTE_COUNT      = 12      // 발바닥 개수
STEAL_TOTAL_TIME_MS   = 3500    // 시퀀스 전체 제한 시간
STEAL_RESULT_MS       = 1500    // SAFE/OUT 결과 표시 시간
STEAL_BASE_RATE       = 0.80    // 12/12 정답 시 성공 확률
STEAL_MISS_PENALTY    = 0.10    // 매 실패당 -10%
STEAL_ARROW_KEYS      = ['ArrowLeft', 'ArrowUp', 'ArrowDown', 'ArrowRight']
```
- 색상/회전 매핑: ←노랑, ↑빨강, ↓초록, →파랑
- 도루 종류: 1B→2B, 2B→3B만 (홈 도루 미지원)
- 1B+2B 동시 도루 가능 (한 판으로 결과 공유)

### 임팩트 효과
```js
// triggerImpact(big) 내부
stopMs = big ? 110 : 65         // hit stop 시간
IMPACT_WORDS_NORMAL = ['BANG!', 'CRACK!', 'WHACK!', 'SMACK!']
IMPACT_WORDS_BIG    = ['POW!',  'BOOM!',  'SMASH!', 'KAPOW!']
// spawnImpactBurst
particleCount = big ? 12 : 7
baseSpeed = big ? 340 : 230
baseSize  = big ? 14 : 10
```

---

## 5. 시도했다 되돌린 것 (반복 금지)

### v1.1
- ❌ **제니 15프레임 스윙 애니메이션**: ChatGPT가 캐릭터 방향 거꾸로 그려서 revert. 자산은 `_archive/swing_frames/`에 보존
- ❌ **이미지 합성 HUD** (BG + diamond + outs overlay): 누더기 자국 너무 심함. 32 풀세트로 전환

### v1.2
- ❌ **마쉬 게이지 도루**: 너무 단순해서 재미없음. 오디션 스타일로 변경
- ❌ **빈 슬롯 도루**: 자동 패스 옵션 만들었으나 사용자 의도와 달랐음. 그냥 12개로 변경

### 영구 교훈
- ❌ **이미지 픽셀 편집 시도하지 말 것** (페더, 마스킹, 합성 등) — 누더기 결과 보장됨
- ❌ **ChatGPT 한 번에 많은 패널 요청** — 일관성 깨짐. **한 시트당 4 패널, 7번 따로 요청** 권장
- ❌ **사용자가 "완벽?" 물으면 검증 없이 "완벽"이라 답하기** — 검증한 사실만 보고
- ❌ **v2_game.png 인페인트** — 베이크인 HUD 지우려고 시도했으나 흐릿한 자국 남음. `v2_game.png.bak`에서 복원 후 그 위를 정확한 사이즈의 새 자산으로 덮는 방식이 정답

---

## 6. 알려진 한계

1. **`v2_game.png` 우상단에 원래 베이크인 HUD 존재** — 새 HUD가 정확히 그 위를 덮어야 함. 컨테이너 aspect-ratio `220/458` 유지 필수
2. **3B 도루 (홈 도루) 미지원** (의도)
3. **vs/랭킹 모드 백엔드 없음** — 추가 시 Firebase 등 도입 필요
4. **모바일 사파리 사운드 미검증** (HANDOVER.md 11번 항목)

---

## 7. 백업/복구 명령

| 상황 | 명령 |
|---|---|
| HUD 이미지 압축 후 화질 문제 | `cp assets/_hud_originals_bak/*.png assets/hud/` |
| 도루 이미지 압축 후 문제 | `cp assets/_steal_originals_bak/*.png assets/` |
| 아카이브에서 파일 다시 필요 | `mv assets/_archive/<파일명> assets/` |
| v2_game.png 손상 | `cp assets/v2_game.png.bak assets/v2_game.png` |
| 전체 v1.2로 롤백 | `cp versions/index_v1.2.html index.html` |
| 전체 v1.1로 롤백 | `cp versions/index_v1.1.html index.html` |
| 원본 v1.0으로 롤백 | `cp "index 복사본.html" index.html` |

---

## 8. ChatGPT 자산 요청 프롬프트 (검증된 템플릿)

### HUD 패널 (b<bases> 1세트 = 시트 1장, 4패널)
**첨부**: `마지막.png` (b011 패널 4장 시트, 사이즈/스타일 기준)

```
첨부는 야구 게임 HUD 패널 4장이 가로로 배치된 시트입니다 
(2B+3B 점등, 1672×941px).

이것과 완벽히 동일한 사이즈/레이아웃/스타일로 1장의 시트를 만들어주세요.
오직 베이스 상태만 다릅니다.

[이번 요청 상태] ← 매번 여기 한 줄만 변경
<상태 설명 (아래 표 참고)>

[엄격한 사이즈]
- 시트: 정확히 1672 × 941 픽셀
- 4 패널 가로 배치: 각 304 × 797 픽셀
- 패널 x 좌표: 1번 x=64, 2번 x=476, 3번 x=894, 4번 x=1312
- 패널 y 좌표: y=21에서 y=811

[4 패널 = 아웃 카운트 (좌→우)]
1번: 0아웃 / 2번: 1아웃 / 3번: 2아웃 / 4번: 3아웃

[디자인 — 첨부와 100% 동일]
- 패널 프레임/내부 BG/외부 야구장 일러스트 모두 동일
- INNING 라벨만 (숫자 그리지 말 것)
- 점등 베이스: 첨부의 2B/3B처럼 골드 그라데이션 + 글로우
- 미점등 베이스: 첨부의 1B처럼 어두운 네이비
- 홈플레이트: 흰색

[중요]
- 시트 1개만 (여러 장 합치지 말 것)
- 1672 × 941 px 정확히
```

### 도루 달리기 프레임 (10프레임 시트)
**첨부**: `assets/steal_run_01.png` + `assets/steal_run_10.png` (스타일 + 시작/끝 참고)

```
첨부는 야구 게임에서 검은 고양이 캐릭터가 베이스로 도루하는 장면입니다.
이 캐릭터 디자인/카메라 앵글/스타일과 100% 동일하게,
10프레임의 부드러운 달리기 시퀀스를 만들어주세요.

[10프레임 진행 (좌→우, 위→아래 순서)]
1. 출발 (먼 거리)
2-9. 점진적으로 가까워지며 다양한 달리기 포즈
10. 베이스 도착 (슬라이딩, 첨부의 steal_run_10과 동일)

[엄격한 사양]
- 시트 크기: 1600 × 720 픽셀
- 레이아웃: 5열 × 2행 그리드
- 각 프레임: 320 × 360 픽셀
- 카메라 각도/배경/조명 모든 프레임 동일

[필수]
- 캐릭터: 검은 고양이, 흰 발/배, 보라 칼라
- 베이스(흰 사각형) 위치 모든 프레임 동일
- 프레임 간 부드러운 인터폴레이션
```

---

## 9. 핵심 함수 위치 (라인 번호 참고용 — 변경 시 grep 권장)

- `STATE` 정의: ~1167
- `game` 상태 객체: ~1175
- `HITBOX/PITCHER/BATTER`: ~1391
- `triggerImpact(big)`: 임팩트 효과 진입점
- `triggerSteal()`, `updateSteal()`, `resolveSteal()`, `endSteal()`: 도루 로직
- `canSteal()`: 도루 가능 여부
- `buildPawSequence()`: 12 발바닥 생성
- `handleStealKey(key)`: 방향키 입력 처리
- `updateHUD()`: HUD swap (game.bases, game.outs 기반)
- `update(dt)`: 메인 게임 루프 (state 머신)
- `draw()`: 캔버스 렌더링
- `loop(t)`: requestAnimationFrame 루프 (try/catch 있음)
- `setupCanvas()`: DPR 캔버스 셋업

---

## 10. 다음 세션 시작 시 권장 순서

1. 이 파일 + `DEVLOG.md` + `CLAUDE.md` 읽기
2. `versions/index_v1.2.html` 와 `index.html` 동일한지 확인 (diff)
3. 사용자에게 "v1.2 동결 상태 + 다음 작업은?" 물어보기
4. 다음 후보:
   - **vs 모드**: 백엔드 도입 결정 필요 (Firebase 추천, 비용 거의 0)
   - **랭킹**: vs 모드와 같이 진행
   - **도루 달리기 개선**: ChatGPT에 더 많은 프레임 요청
   - **웹 배포**: itch.io 또는 GitHub Pages
   - 사용자가 정하지 않은 새 기능

---

## 11. 핵심 원칙 요약 (한 줄씩)

- 단일 HTML 파일 유지
- 한글 UI 금지 (영문만)
- 페인팅 자산 우선 (CSS는 동적 부분만)
- 이미지 합성 시도 금지 (ChatGPT에 풀세트 요청)
- 백업 항상 만들고 복구 명령 알려주기
- 검증한 사실만 보고
- 답 정해놓고 추천하지 말기
- 사용자 기분 맞춰주는 답 금지
- `HITBOX/PITCHER/BATTER` 좌표 변경 금지
- 확률 값 임의 변경 금지
- 의심나는 거 있으면 코드 비교부터

---

## 12. 사용자 의도 추정 (모호한 표현 만났을 때)

- "이쁘게" = 페인팅 일러스트 스타일 (CSS 평면 도형 아님)
- "부드럽게" = fps 올리거나 프레임 추가
- "끊겨" = 프레임 레이트 부족 또는 이미지 src 변경 누락
- "엉뚱한 곳" = 캐싱 문제 or 정말 코드 변경. 둘 다 확인할 것
- "또 이상해" = 사용자가 두 번째 보고 — 신뢰 회복 필요. 코드 비교 먼저
- "단순" = 깊이 부족. 다양성/난이도 추가 검토
- "재미가 없어" = 같은 미니게임 다른 방식 제안
