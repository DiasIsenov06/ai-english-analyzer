import { NextResponse } from "next/server";
import { getTokenFromRequest, verifyToken } from "./auth";

/** Identity comes only from the signed session, never from a URL or request body. */
export async function authenticate(request: Request) {
  const token = getTokenFromRequest(request);
  const payload = token ? await verifyToken(token) : null;
  if (!payload) return { response: NextResponse.json({ error: "Не авторизован" }, { status: 401 }) };
  return { userId: payload.userId };
}
