| 구성 요소            | 선택 기술                         | 선택 이유                                                                    |
| -------------------- | --------------------------------- | ---------------------------------------------------------------------------- |
| Frontend Framework   | Next.js 16 + React + TypeScript   | SaaS 최적화, Server Actions로 백엔드 통합, 파일 기반 라우팅, 안정적인 생태계 |
| UI Kit               | shadcn/ui                         | 즉시 사용 가능한 컴포넌트, Tailwind 기반, MVP UI 구성 속도 최강              |
| Styling              | TailwindCSS                       | 빠른 스타일링, 디자인 시스템 구축 필요 없음                                  |
| Backend Layer        | Next.js Server Actions            | 별도 서버 없이 API 구현 가능 → 개발 속도 가장 빠름, Vercel과 궁합 최고       |
| Database             | Supabase PostgreSQL               | Auth·DB·Storage가 한 번에 해결됨, 개발 속도 절반으로 줄어듦                  |
| Auth (로그인)        | Supabase Auth (Google OAuth 단일) | 1시간 내 설정 가능, 권한 관리 쉬움, 유지보수 최소                            |
| Storage              | Supabase Storage                  | 문서 보관, 파일 유입 가능, 비용 저렴                                         |
| ORM                  | Prisma                            | 스키마 관리 간편, DB 마이그레이션 자동, 타입 자동 생성                       |
| Validation           | Zod                               | LLM JSON 결과 검증 필수, API 파라미터 체크                                   |
| AI Provider          | OpenAI API                        | 문서 품질 확보, 비용 절감, 속도 빠름                                         |
| Hosting              | Vercel                            | Next.js 배포 최적화, API/Frontend 한 번에 관리, 속도 빠름                    |
| User Action Tracking | Amplitude                         | 이벤트 기반 유저 행동 트래킹                                                 |
| Monitoring           | Sentry                            | 오류 트래킹                                                                  |
| Package Manager      | pnpm                              | 설치 속도 빠르고 안정적                                                      |
