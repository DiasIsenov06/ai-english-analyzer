import { beforeEach, expect, it, vi } from "vitest";
const mocks=vi.hoisted(()=>({
  auth: vi.fn(),
  db: { studyPlan: {findFirst:vi.fn(),create:vi.fn()}, studyPlanDay:{findFirst:vi.fn(),update:vi.fn()}, studyTask:{updateMany:vi.fn()},
    testResult:{findFirst:vi.fn()}, user:{findUnique:vi.fn()}, $transaction:vi.fn() },
}));
vi.mock("@/lib/requestAuth",()=>({authenticate:mocks.auth}));
vi.mock("@/lib/prisma",()=>({prisma:mocks.db}));
import { GET as plan } from "../../src/app/api/plan/current/route";
import { PATCH as patchDay, GET as getDay } from "../../src/app/api/plan/day/[dayId]/route";
import { POST as generate } from "../../src/app/api/plan/generate/route";
beforeEach(()=>{vi.clearAllMocks();mocks.auth.mockResolvedValue({userId:"alice"});mocks.db.$transaction.mockImplementation(async fn=>fn(mocks.db));});
it("filters plan by signed owner",async()=>{mocks.db.studyPlan.findFirst.mockResolvedValue(null);await plan(new Request("http://localhost/?userId=bob"));expect(mocks.db.studyPlan.findFirst.mock.calls[0][0].where).toEqual({userId:"alice"});});
it("forbids foreign day mutation without any write",async()=>{mocks.db.studyPlanDay.findFirst.mockResolvedValue(null);const res=await patchDay(new Request("http://localhost",{method:"PATCH",body:JSON.stringify({dayId:"bobs-day",status:"completed"})}));expect(res.status).toBe(404);expect(mocks.db.studyPlanDay.update).not.toHaveBeenCalled();expect(mocks.db.studyTask.updateMany).not.toHaveBeenCalled();expect(mocks.db.studyPlanDay.findFirst.mock.calls[0][0].where.plan.userId).toBe("alice");});
it("updates day and tasks atomically",async()=>{mocks.db.studyPlanDay.findFirst.mockResolvedValue({id:"own"});const res=await patchDay(new Request("http://localhost",{method:"PATCH",body:JSON.stringify({dayId:"own",status:"completed"})}));expect(res.status).toBe(200);expect(mocks.db.$transaction).toHaveBeenCalledOnce();expect(mocks.db.studyTask.updateMany.mock.calls[0][0].data.status).toBe("completed");});
it("rejects invalid status",async()=>{expect((await patchDay(new Request("http://localhost",{method:"PATCH",body:JSON.stringify({dayId:"own",status:"admin"})}))).status).toBe(400);expect(mocks.db.$transaction).not.toHaveBeenCalled();});
it("rejects out of range day",async()=>{const result=await getDay(new Request("http://localhost"),{params:Promise.resolve({dayId:"-1"})});expect(result.status).toBe(400);});
it("creates all 28 days and 84 tasks in one write",async()=>{mocks.db.user.findUnique.mockResolvedValue({level:"A1",goal:"Speaking"});mocks.db.testResult.findFirst.mockResolvedValue(null);mocks.db.studyPlan.findFirst.mockResolvedValue(null);mocks.db.studyPlan.create.mockResolvedValue({id:"plan"});expect((await generate(new Request("http://localhost",{method:"POST",body:JSON.stringify({userId:"bob"})}))).status).toBe(200);const data=mocks.db.studyPlan.create.mock.calls[0][0].data;expect(data.userId).toBe("alice");expect(data.days.create).toHaveLength(28);expect(data.days.create.flatMap((d:any)=>d.tasks.create)).toHaveLength(84);expect(data.days.create[27].dayIndex).toBe(28);expect(mocks.db.studyPlan.create).toHaveBeenCalledOnce();});
it("reuses an existing plan",async()=>{mocks.db.user.findUnique.mockResolvedValue({});mocks.db.studyPlan.findFirst.mockResolvedValue({id:"existing"});const res=await generate(new Request("http://localhost",{method:"POST"}));expect((await res.json()).alreadyExists).toBe(true);expect(mocks.db.studyPlan.create).not.toHaveBeenCalled();});
