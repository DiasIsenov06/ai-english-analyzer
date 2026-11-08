import { beforeEach, describe, expect, it } from "vitest";
import { createToken, verifyToken, hashPassword, verifyPassword, getTokenFromRequest } from "../../src/lib/auth";
import { authenticate } from "../../src/lib/requestAuth";
import { validCredentials, validResult } from "../../src/lib/validation";
beforeEach(() => { process.env.JWT_SECRET = "unit-tests-only-not-a-production-secret-12345"; });
describe("session boundary", () => {
  it("accepts signed identity", async () => { const token = await createToken({ userId: "alice", email: "alice@example.invalid" }); expect((await verifyToken(token))?.userId).toBe("alice"); });
  it("rejects tampered and malformed tokens", async () => { const token = await createToken({ userId: "alice", email: "alice@example.invalid" }); expect(await verifyToken(token.slice(0, -8) + "modified")).toBeNull(); expect(await verifyToken("bad")).toBeNull(); });
  it("never falls back to a default secret", async () => { delete process.env.JWT_SECRET; await expect(createToken({ userId: "alice", email: "a@example.invalid" })).rejects.toThrow("JWT_SECRET"); expect(await verifyToken("bad")).toBeNull(); });
  it("rejects short and documented placeholder secrets", async () => { for (const value of ["short", "your-super-secret-jwt-key-change-in-production"]) { process.env.JWT_SECRET=value; await expect(createToken({ userId:"a", email:"a@b.c" })).rejects.toThrow(); } });
  it("does not accept identity from query string", async () => { const result=await authenticate(new Request("http://localhost/api/plan/current?userId=victim")); expect(result.response?.status).toBe(401); });
  it("uses bearer identity over spoofed query", async () => { const token=await createToken({ userId:"alice",email:"a@example.invalid" }); const request=new Request("http://localhost/?userId=bob",{headers:{Authorization:`Bearer ${token}`}}); expect((await authenticate(request)).userId).toBe("alice"); });
  it("ignores non-bearer headers",()=>{ expect(getTokenFromRequest(new Request("http://localhost",{headers:{authorization:"Basic x"}}))).toBeNull(); });
  it("hashes and verifies without plaintext persistence",async()=>{ const hash=await hashPassword("SyntheticPass1!"); expect(hash).not.toContain("SyntheticPass1!"); expect(await verifyPassword("SyntheticPass1!",hash)).toBe(true); expect(await verifyPassword("wrong",hash)).toBe(false); });
});
describe("input validation",()=>{
  it.each([["student@example.invalid","Test12345",true],["bad","Test12345",false],["a@b.c","short",false],["a@b.c","é".repeat(40),false],[null,123,false]])("credentials %s",(email,password,expected)=>expect(validCredentials(email,password)).toBe(expected));
  it.each([{score:-1,total:10,level:"A1"},{score:11,total:10,level:"A1"},{score:1,total:0,level:"A1"},{score:1,total:10,level:"invalid"},{score:1,total:10,level:"A1",grammarScore:101},{score:"1",total:10,level:"A1"}])("rejects invalid diagnostic %j",body=>expect(validResult(body)).toBe(false));
  it("accepts bounded scores",()=>expect(validResult({score:3,total:10,level:"A2",grammarScore:50})).toBe(true));
});
