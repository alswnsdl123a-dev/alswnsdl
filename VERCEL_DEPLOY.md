# Vercel 배포 방법

이 프로젝트는 Next.js 기반이라 Vercel에 바로 배포할 수 있습니다.

1. https://vercel.com 에 로그인합니다.
2. Add New → Project를 누릅니다.
3. GitHub 저장소를 연결하거나 이 프로젝트를 GitHub에 올린 뒤 Import합니다.
4. Framework Preset은 Next.js로 자동 인식됩니다.
5. Environment Variables에 아래 값을 추가합니다.
   - NEXT_PUBLIC_KAKAO_JS_KEY = Kakao Developers의 JavaScript 키
   - KAKAO_REST_API_KEY = 선택 사항
6. Deploy를 누릅니다.
7. 배포가 끝나면 생성된 https://xxxxx.vercel.app 주소를 복사합니다.
8. Kakao Developers → 내 애플리케이션 → 플랫폼/Web 사이트 도메인에 그 주소를 추가합니다.
9. Vercel에서 Redeploy하면 카카오맵이 정상 동작합니다.

카카오맵 키 없이도 사이트는 열리며 지도 영역은 OpenStreetMap 대체 화면을 사용할 수 있습니다.
