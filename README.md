# 남도의 숨은 길 / Hidden Jeonnam

전라남도 22개 시·군의 덜 알려진 장소를 찾고, 취향에 맞는 여행 코스를 짜는 반응형 웹앱입니다. 초기에는 예시 관광지 데이터(44곳)로 동작합니다.

## 기능

- **시·군 검색**: 목포부터 신안까지 22개 지역 필터와 이름 검색
- **취향 필터**: 자연, 음식, 역사, 체험
- **카카오맵 길찾기**: 왼쪽 목록의 장소를 누르면 오른쪽 패널(사진·지도·리뷰)이 그 장소로 바뀝니다. 카카오맵 도메인이 아직 안 열리면 같은 좌표의 지도가 바로 표시되고, 키가 등록되면 카카오맵으로 바뀝니다.
- **코스 추천**: 취향·기간·출발 권역으로 일정 생성, 추천 코스 5개 제공
- **다국어**: 한국어, English, 中文, 日本語 (헤더에서 바로 전환)

## 실행

```bash
cp .env.example .env.local
# NEXT_PUBLIC_KAKAO_JS_KEY 값을 넣은 뒤
npm install
npm run dev
```

브라우저에서 [http://localhost:43127](http://localhost:43127) 을 엽니다.

```bash
npm run build
npm start
```

## 카카오맵 키

지도는 [Kakao Maps JavaScript API](https://apis.map.kakao.com/web/)를 사용합니다.

1. [Kakao Developers](https://developers.kakao.com)에서 앱을 만들고 **JavaScript 키**를 발급합니다.
2. 앱 설정 → 플랫폼 → Web에 사이트 도메인을 **둘 다** 등록합니다.
   - `http://localhost:43127`
   - `http://127.0.0.1:43127`
   두 주소는 카카오에서 다른 사이트로 취급됩니다. 미리보기 창이 `127.0.0.1`이면 그것도 등록해야 지도가 뜹니다.
3. `.env.local`에 키를 넣습니다.

```bash
NEXT_PUBLIC_KAKAO_JS_KEY=your_javascript_key
# 선택. 있으면 카카오모빌리티 길찾기, 없으면 OSRM 경로선
KAKAO_REST_API_KEY=your_rest_api_key
```

키 없이 실행하면 오른쪽 지도 자리에 설정 안내가 나옵니다. `NEXT_PUBLIC_` 값을 바꾼 뒤에는 개발 서버를 다시 시작하세요.

## 기술

Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, Kakao Maps JavaScript API

배편과 영업시간은 방문 전에 공식 정보를 확인해 주세요.
