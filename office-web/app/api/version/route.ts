import { NextResponse } from "next/server";

// Build currently deployed. Open tabs compare it with the build they were
// loaded from to offer a reload after a deploy.
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    { build: process.env.NEXT_PUBLIC_BUILD_ID ?? "dev" },
    { headers: { "Cache-Control": "no-store" } }
  );
}
