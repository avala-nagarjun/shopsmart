import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createAccessToken, createRefreshToken, verifyRefreshToken } from "@/lib/server/jwt";
import db from "@/lib/db";
import { hashToken } from "@/lib/hash";

export async function POST() {

  const token = (await cookies()).get("refreshToken")?.value;
  if (!token) return new Response("Unauthorized", { status: 401 });

  try {
    const payload = verifyRefreshToken(token);
    if (!payload?.sub || !payload.deviceId) return new Response("Unauthorized", { status: 401 });

    const hashed = hashToken(token);

    const session = await db.session.findFirst({
      where: {
        userId: payload.sub,
        deviceId: payload.deviceId,
        refreshTokenHash: hashed,
        revoked: false
      }
    });

    if (!session) return new Response("Unauthorized", { status: 401 });

    // ✅ Rotate token

    const newRefresh = createRefreshToken({ sub: payload.sub, deviceId: payload.deviceId });
    const newHash = hashToken(newRefresh);

    await db.session.update({
      where: { id: session.id },
      data: { refreshTokenHash: newHash, lastUsed: new Date(), }
    });

    await db.securityEvent.create({
      data: { userId: payload.sub, type: "refresh", deviceId: payload.deviceId }
    });


    const access = createAccessToken({ sub: payload.sub });

    const res = NextResponse.json({ access });
    res.cookies.set({
      name: "refreshToken",
      value: newRefresh,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;

  } catch {
    return NextResponse.json({ message: "Token expired or invalid" }, { status: 403 });
  }
}
