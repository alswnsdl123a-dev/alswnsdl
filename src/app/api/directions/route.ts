import { NextResponse } from "next/server";

type Point = { lat: number; lng: number };

function num(value: string | null) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function decodeKakaoVertexes(vertexes: number[]) {
  const path: Point[] = [];
  for (let i = 0; i + 1 < vertexes.length; i += 2) {
    path.push({ lng: vertexes[i], lat: vertexes[i + 1] });
  }
  return path;
}

async function kakaoDirections(origin: Point, destination: Point) {
  const key = process.env.KAKAO_REST_API_KEY?.trim();
  if (!key) return null;

  const url = new URL("https://apis-navi.kakaomobility.com/v1/directions");
  url.searchParams.set("origin", `${origin.lng},${origin.lat}`);
  url.searchParams.set("destination", `${destination.lng},${destination.lat}`);
  url.searchParams.set("priority", "RECOMMEND");

  const res = await fetch(url, {
    headers: { Authorization: `KakaoAK ${key}` },
    next: { revalidate: 0 },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as {
    routes?: {
      result_code: number;
      summary?: { distance: number; duration: number };
      sections?: { roads?: { vertexes?: number[] }[] }[];
    }[];
  };
  const route = data.routes?.[0];
  if (!route || route.result_code !== 0) return null;

  const path = (route.sections ?? []).flatMap((section) =>
    (section.roads ?? []).flatMap((road) => decodeKakaoVertexes(road.vertexes ?? [])),
  );
  if (path.length < 2) return null;

  return {
    distanceMeters: route.summary?.distance ?? 0,
    durationSeconds: route.summary?.duration ?? 0,
    path,
    provider: "kakao" as const,
  };
}

async function osrmDirections(origin: Point, destination: Point) {
  const url = `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`;
  const res = await fetch(url, { next: { revalidate: 0 } });
  if (!res.ok) return null;
  const data = (await res.json()) as {
    routes?: {
      distance: number;
      duration: number;
      geometry?: { coordinates?: [number, number][] };
    }[];
  };
  const route = data.routes?.[0];
  const coords = route?.geometry?.coordinates;
  if (!route || !coords || coords.length < 2) return null;
  return {
    distanceMeters: Math.round(route.distance),
    durationSeconds: Math.round(route.duration),
    path: coords.map(([lng, lat]) => ({ lat, lng })),
    provider: "osrm" as const,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const origin = {
    lat: num(searchParams.get("originLat")),
    lng: num(searchParams.get("originLng")),
  };
  const destination = {
    lat: num(searchParams.get("destLat")),
    lng: num(searchParams.get("destLng")),
  };
  if (
    origin.lat === null ||
    origin.lng === null ||
    destination.lat === null ||
    destination.lng === null
  ) {
    return NextResponse.json({ error: "invalid-coords" }, { status: 400 });
  }

  const kakao = await kakaoDirections(origin as Point, destination as Point);
  if (kakao) return NextResponse.json(kakao);

  const osrm = await osrmDirections(origin as Point, destination as Point);
  if (osrm) return NextResponse.json(osrm);

  return NextResponse.json(
    {
      distanceMeters: 0,
      durationSeconds: 0,
      path: [origin, destination],
      provider: "straight",
    },
    { status: 200 },
  );
}
