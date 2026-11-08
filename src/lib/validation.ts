export function validCredentials(email: unknown, password: unknown) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254 &&
    typeof password === "string" && password.length >= 8 && Buffer.byteLength(password, "utf8") <= 72;
}

export function validResult(body: Record<string, unknown>) {
  const { score, total, level } = body;
  if (typeof score !== "number" || typeof total !== "number" || !Number.isInteger(score) || !Number.isInteger(total) ||
      total < 1 || total > 1000 || score < 0 || score > total || !["A1", "A2", "B1", "B2", "C1", "C2"].includes(String(level))) return false;
  return ["grammarScore", "vocabularyScore", "correctionScore"].every(key => body[key] == null ||
    (typeof body[key] === "number" && Number.isFinite(body[key]) && (body[key] as number) >= 0 && (body[key] as number) <= 100));
}
