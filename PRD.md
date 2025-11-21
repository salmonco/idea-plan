# 📘 **IdeaPlan — 요구사항 정의서(PRD v1.0 / MVP Scope)**

**작업 기간: 2주**

**작성 기준: 2-Pager + MVP 범위**

**작성일: 2025.11.20**

---

# 1. 제품 개요

## 1.1 제품 설명

단순 아이디어 텍스트를 입력하면 **자동으로 1-Pager 기획서 → 기능목록 → 실행 계획(Action Plan)**을 생성하는

**개인 전략 AI 도구**.

## 1.2 MVP 목표

- 아이디어 입력 후 **즉시 문서 3종 자동 생성**
- 생성된 문서를 저장·조회·수정 가능
- 기본적인 계정 기능(Google OAuth)
- 단일 사용자 중심 기능만 구현

---

# 2. 사용자 시나리오 (유저 플로우)

## 🧑‍💻 **시나리오 A — 첫 방문**

1. 사용자가 랜딩 페이지 방문
2. “Google로 계속하기” 클릭 후 로그인
3. 대시보드에서 “새 아이디어 생성” 클릭
4. 아이디어 한 줄 입력
5. AI가 자동으로 **1-Pager** 생성
6. 사용자가 “기능목록 생성” 클릭
7. AI가 **Spec(기능목록/우선순위)** 생성
8. 사용자가 “실행 계획 생성” 클릭
9. **Action Plan(1~2주)** 자동 생성
10. 문서 저장 후 나중에 다시 열람
11. 공유 링크 생성해 팀원에게 전달 (MVP 1차: X, 개발 후순위)

---

# 3. 기능 요구사항

---

# ⭐ **3.1 Core Feature #1 — 1-Pager 자동 생성 (Idea → 1-Pager AI)**

### 3.1.1 입력값

| 항목     | 형식   | 예                                             |
| -------- | ------ | ---------------------------------------------- |
| ideaText | string | "카페에서 일하는 알바생을 위한 레시피 암기 앱" |

### 3.1.2 출력값(JSON)

```json
{
  "problem": "...",
  "target": "...",
  "hypothesis": "...",
  "features": ["...", "..."],
  "monetization": "...",
  "roadmap": ["...", "..."]
}
```

### 3.1.3 동작 조건

- 최소 10자 이상 입력
- 부적절한 입력(욕설 등) 시 에러 메시지 표기

### 3.1.4 예외 처리

- OpenAI API 요청 실패 시 “문서 생성에 실패했습니다. 다시 시도해주세요.”
- LLM JSON mode 실패 시 → fallback 프롬프트로 재시도 (2회까지)

---

# ⭐ **3.2 Core Feature #2 — Spec 자동 생성 (1-Pager → Spec AI)**

### 3.2.1 입력값

**1-Pager JSON** 전체

### 3.2.2 출력값(JSON)

```json
{
  "feature_list": [
    { "title": "아이디어 입력", "priority": "P0" },
    { "title": "1-Pager 생성", "priority": "P0" }
  ]
}
```

### 3.2.3 우선순위 규칙

- P0: 필수
- P1: 있으면 좋음
- P2: 후순위

### 3.2.4 예외

- 입력 JSON 구조 깨진 경우 → “1-Pager를 먼저 생성해주세요”

---

# ⭐ **3.3 Core Feature #3 — Action Plan 자동 생성 (Spec → Action Plan AI)**

### 3.3.1 입력값

- 기능목록(spec.feature_list[])
- 기간 설정(7일 or 14일)

### 3.3.2 출력값(JSON)

```json
{
  "timeline": [
    { "day": 1, "task": "UI 구성" },
    { "day": 2, "task": "로그인 개발" }
  ]
}
```

### 3.3.3 규칙

- 하루당 작업 1~3개
- P0 → 먼저 배치
- 일정은 직렬 배치(병렬 없음)

---

# ⭐ **3.4 Core Feature #4 — 아이디어 히스토리 저장/조회**

### 3.4.1 기능 요구사항

- 생성된 문서(1-Pager, Spec, Action Plan)를 DB에 저장
- 대시보드에서 목록 조회
- 클릭 시 상세 페이지에서 열람

### 3.4.2 기능 상세

| 기능 | 설명                      |
| ---- | ------------------------- |
| 저장 | 문서 생성 시 자동 DB 저장 |
| 조회 | 로그인한 사용자의 문서만  |
| 정렬 | 최신 생성 순              |
| 삭제 | MVP에서는 제외            |

---

# ⭐ **3.5 Core Feature #5 — 로그인 기능 (Google OAuth)**

### 3.5.1 요구사항

- Supabase Auth 사용
- 최초 로그인 시 user record 생성
- JWT 기반 session 유지

### 3.5.2 예외

- 로그인 실패 시 안내 토스트
- 토큰 만료 시 자동 로그아웃

---

# 4. 비기능 요구사항(NFR)

| 구분          | 기준                     |
| ------------- | ------------------------ |
| 응답속도      | 문서 생성 API 응답 ≤ 6초 |
| 가용성        | Vercel SLA 준수          |
| 보안          | JWT + RLS 활성화         |
| 브라우저 지원 | Chrome, Safari 최신 우선 |
| 모바일        | MVP: 반응형 최소 수준만  |

---

# 5. 화면 설계(High-level)

## 5.1 화면 목록

| 페이지      | 설명                                   |
| ----------- | -------------------------------------- |
| / (Landing) | 소개 + 로그인                          |
| /dashboard  | 생성된 문서 목록                       |
| /idea/new   | 아이디어 입력                          |
| /idea/[id]  | 1-Pager / Spec / Action Plan 편집/조회 |

---

# 6. API 명세 (Next.js Server Actions 기준)

### API 1 — createOnePager

```
POST /api/onepager
```

**Body**

```
{ ideaText: string, userId: string }
```

**Response**

- 200: 1-Pager JSON
- 400: invalid input

---

### API 2 — createSpec

```
POST /api/spec
```

**Body**

```
{ onePager: {...}, userId: string }
```

---

### API 3 — createActionPlan

```
POST /api/action-plan
```

**Body**

```
{ spec: {...}, duration: 7|14, userId: string }
```

---

# 7. 개발범위(MVP)

### **필수 포함**

- 구글 로그인
- 아이디어 입력
- 1-Pager 생성
- Spec 생성
- Action Plan 생성
- 저장/조회 UI
- 기본 Dashboard

### **제외 (후순위)**

- 팀 공유 링크
- PRD 생성 기능
- 경쟁사 분석 생성
- 구독 결제
- 삭제, 편집 기능 고도화

---

# 8. 일정(2 Week Sprint)

| 주차   | 작업                                                   | 상세             |
| ------ | ------------------------------------------------------ | ---------------- |
| Week 1 | FE 구조, Auth, DB 연동, 아이디어 입력 UI, 1-Pager 생성 | 1-Pager까지 완성 |
| Week 2 | Spec, Action Plan, Dashboard, 상세 페이지              | 전체 플로우 완성 |
