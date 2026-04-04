# FlipBee 패치 노트

## 2026-04-05 (v0.2 패치)

### 🐛 버그 수정

#### 드래그 앤 드롭 스크롤 방지 (모바일/데스크탑)
- **원인**: 스크롤 컨테이너가 `window`가 아닌 `.main` 요소(`overflow-y:auto`)였고, 모바일에서는 `touchmove` 핸들러가 10px 이동 후에야 `preventDefault()` 호출 → 그 전에 스크롤 발생
- **수정**:
  - `.main` 컨테이너도 드래그 중 `overflow-y:hidden` 처리
  - `dragover`마다 `.main.scrollTop` 강제 고정
  - 모든 터치 DnD 핸들러에서 핸들 터치 시 **즉시** `e.preventDefault()` 호출

#### 단어장 아이템 복제 버그
- **원인**: `_bindWsManageDnD()`의 `container` 이벤트 리스너가 `renderWsManageList()` 호출마다 중복 추가됨 → drop 이벤트가 여러 번 실행
- **수정**:
  - `container._wmDndBound` 플래그로 리스너를 한 번만 바인딩
  - `_applyWsManageOrder()`에서 `Set`으로 중복 UID 필터링 (방어 코드)

#### 숙제 모달 이동 시 dirty 판정 오류
- **원인**: `hw-due` (날짜) 기본값이 오늘로 자동 설정되어, 아무것도 입력하지 않아도 dirty로 판정
- **수정**: dirty 체크에서 `hw-due` 제거 → 제목·설명 입력 여부만 확인

#### 날짜 기본값 시간대 오류
- **원인**: `_todayStr()`이 `toISOString()` (UTC 기준) 사용 → 한국(UTC+9) 오전 9시 이전 실행 시 전날 날짜 표시
- **수정**: `getFullYear() / getMonth() / getDate()` 로컬 시간 기준으로 변경

### ✨ 기능 개선

#### 메뉴 이동 시 모달 자동 닫기
- 메뉴 탭 이동 시 열려 있는 팝업 자동 처리
- 숙제·일정·단어장 편집 모달: 내용이 입력된 경우 이동 여부 확인 후 닫기
- 내용이 없는 경우 또는 기타 모달: 즉시 닫기

#### 복습 알림 → OS 네이티브 알림
- 기존 "앱 내 배너 알림" → 기기 알림 권한 요청 후 OS 시스템 알림으로 발송
- 권한 미허용 시 앱 내 배너로 자동 폴백
- 알림 설정 켤 때 / 테스트 버튼 클릭 시 권한 요청 팝업 표시
- 안내 문구("브라우저 알림은 https:// 환경에서만...") 제거

### 🎨 디자인

#### 앱 아이콘 변경
- `icon-192.png`, `icon-512.png`: "FB" 텍스트 → 꿀벌 🐝 이모지 아이콘으로 교체
- `icon.svg`, `icon-maskable.svg`는 기존에 이미 🐝 적용되어 있었음

---

### 수정된 파일
| 파일 | 변경 내용 |
|------|-----------|
| `flipbee_v0_2.html` | 버그 수정 및 기능 개선 전체 |
| `icon-192.png` | 꿀벌 아이콘으로 교체 |
| `icon-512.png` | 꿀벌 아이콘으로 교체 |

> `flipbee_v0_1.html`, `index.html`, `manifest.json`, `sw.js` 는 이번 패치에서 변경 없음
