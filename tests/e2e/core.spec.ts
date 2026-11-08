import { test, expect, APIRequestContext } from '@playwright/test';
async function account(request:APIRequestContext,role:string){
 const email=`lab-${role}-${Date.now()}@example.invalid`;
 const response=await request.post('/api/auth/register',{data:{email,password:'SyntheticOnly42!',level:'A2',goal:'Speaking'}});
 expect(response.status()).toBe(200);return {...await response.json(),email};
}
test('real DB: authentication, ownership, history, 28-day plan and atomic progress',async({request})=>{
 const a=await account(request,'a'),b=await account(request,'b');
 const ha={Authorization:`Bearer ${a.token}`},hb={Authorization:`Bearer ${b.token}`};
 expect((await request.get('/api/plan/current')).status()).toBe(401);
 expect((await request.post('/api/auth/login',{data:{email:a.email,password:'wrongpass'}})).status()).toBe(401);
 for(const score of [4,9])expect((await request.post('/api/test/results',{headers:ha,data:{score,total:13,level:'A2'}})).status()).toBe(200);
 expect((await (await request.get('/api/test/results',{headers:ha})).json()).length).toBe(2);
 expect((await (await request.get('/api/test/results',{headers:hb})).json()).length).toBe(0);
 expect((await request.post('/api/plan/generate',{headers:ha,data:{userId:b.user.id}})).status()).toBe(200);
 const {plan}=await (await request.get(`/api/plan/current?userId=${b.user.id}`,{headers:ha})).json();
 expect(plan.userId).toBe(a.user.id);expect(plan.days).toHaveLength(28);
 expect((await (await request.get('/api/plan/current',{headers:hb})).json()).plan).toBeNull();
 const day=plan.days[0];
 expect((await request.patch('/api/plan/day/1',{headers:hb,data:{dayId:day.id,status:'completed'}})).status()).toBe(404);
 expect((await request.patch('/api/plan/day/1',{headers:ha,data:{dayId:day.id,status:'completed'}})).status()).toBe(200);
 const details=await (await request.get('/api/plan/day/1',{headers:ha})).json();
 expect(details.day.status).toBe('completed');expect(details.day.tasks).toHaveLength(3);
 expect(details.day.tasks.every((t:{status:string})=>t.status==='completed')).toBe(true);
 expect((await request.get('/api/plan/day/29',{headers:ha})).status()).toBe(400);
 expect((await request.post('/api/study-activity',{headers:ha,data:{minutes:-1}})).status()).toBe(400);
});
test('training remains usable with AI disabled and protects sessions',async({request})=>{
 const a=await account(request,'chat'),b=await account(request,'outsider');
 const ha={Authorization:`Bearer ${a.token}`},hb={Authorization:`Bearer ${b.token}`};
 const session=await (await request.post('/api/training/session/start',{headers:ha})).json();
 const endpoint=`/api/training/session/${session.id}`;
 expect((await request.post(endpoint+'/message',{headers:hb,data:{content:'Hello'}})).status()).toBe(404);
 const res=await request.post(endpoint+'/message',{headers:ha,data:{content:'I likes tea.',useAI:true}});
 expect(res.status()).toBe(200);expect((await res.json()).messages.at(-1).content).toContain('[Практика без AI]');
 expect((await request.post(endpoint+'/complete',{headers:ha,data:{metrics:{minutes:1}}})).status()).toBe(200);
 expect((await request.post(endpoint+'/message',{headers:ha,data:{content:'Hello'}})).status()).toBe(409);
});
test('browser: register, dashboard, responsive privacy and keyboard controls',async({page})=>{
 await page.goto('/register');await page.locator('input[type=email]').fill(`ui-${Date.now()}@example.invalid`);
 await page.locator('input[type=password]').fill('SyntheticOnly42!');
 await page.getByRole('button',{name:'Зарегистрироваться'}).click();
 await expect(page).not.toHaveURL(/register/);
 await page.goto('/training');await expect(page.getByRole('checkbox')).not.toBeChecked();
 await page.getByRole('checkbox').check();await expect(page.getByRole('checkbox')).toBeChecked();
 await page.setViewportSize({width:390,height:844});await page.goto('/privacy');
 await expect(page.getByRole('heading',{name:'Данные и AI-подсказки'})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});
