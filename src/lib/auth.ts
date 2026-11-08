import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

function signingKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32 || secret === "your-super-secret-jwt-key-change-in-production") {
    throw new Error("JWT_SECRET must be configured with at least 32 characters");
  }
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashed: string
): Promise<boolean> {
  return bcrypt.compare(password, hashed);
}

export async function createToken(payload: { userId: string; email: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(signingKey());
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, signingKey(), { algorithms: ["HS256"] });
    if (typeof payload.userId !== "string" || !payload.userId || typeof payload.email !== "string") return null;
    return payload as { userId: string; email: string };
  } catch {
    return null;
  }
}

export function getTokenFromRequest(
  request: Request
): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) return authHeader.slice(7);
  return null;
}
