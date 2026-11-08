"""Check traceability and arithmetic; does NOT certify pending human acceptance."""
from pathlib import Path
import json,math,re,sys
ROOT=Path(__file__).resolve().parents[2]
def read(path):return json.loads((ROOT/path).read_text(encoding='utf-8-sig'))
def main():
 errors=[];checks=[]
 def check(condition,message):
  (checks if condition else errors).append(message)
 for i in range(1,14):check((ROOT/f'docs/labs/lab-{i:02}.md').is_file(),f'lab{i} report exists')
 matrix=read('docs/labs/requirements-matrix.json')
 check(set(m['lab'] for m in matrix)==set(range(1,14)),'all 13 labs traced')
 for m in matrix:check((ROOT/'docs/labs'/m['evidence']).exists(),f"{m['id']} evidence exists")
 for p in list((ROOT/'docs/labs').glob('*.md'))+list((ROOT/'docs/wiki').glob('*.md'))+list((ROOT/'docs/adr').glob('*.md')):
  for link in re.findall(r'\]\(([^)]+)\)',p.read_text(encoding='utf-8')):
   if '://' in link or link.startswith('#'):continue
   check((p.parent/link.split('#')[0]).exists(),f'local link {p.name} -> {link}')
 jobs=read('docs/labs/data/vacancies.json');stories=read('docs/labs/data/backlog.json');risks=read('docs/security/risk-register.json')['risks']
 check(len(jobs)==10 and len({j['url'] for j in jobs})==10,'10 distinct vacancy URLs')
 check(15<=len(stories)<=20,'15–20 user stories')
 check(all(s['positive']['then'] and s['negative']['then'] and s['owner'] and s['size_hours']<=8 for s in stories),'acceptance, personal owners and small stories')
 check(all(s['risk_id'] in {r['id'] for r in risks} for s in stories),'story risk IDs match canonical register')
 check(len(risks)>=20,'20 risks')
 check(math.isclose(sum(r['probability']*r['impact_hours'] for r in risks),38.4,abs_tol=.001),'risk EMV=38.4h')
 econ=read('docs/labs/data/economics.json')
 for name,v in econ['alternatives'].items():
  check(math.isclose(sum(v['costs_by_year']),v['tco_3y'],abs_tol=.01),f'{name} TCO')
  check(math.isclose(sum(n/1.15**y for y,n in enumerate(v['net_by_year'])),v['npv'],abs_tol=.01),f'{name} NPV')
 budget=[r for r in read('docs/operations/lab8/assumptions-and-results.json')['monthly'] if re.fullmatch(r'\d{4}-\d{2}',r[0])]
 check(len(budget)==12,'12-month operations budget')
 check(math.isclose(sum(r[9] for r in budget),1712744,abs_tol=.01),'annual budget with reserve=1712744')
 evaluation=read('docs/labs/evidence/ai/evaluation.json')
 check(evaluation['n']>=30 and len(evaluation['approaches'])>=3,'30 evaluation cases / 3 approaches prepared')
 check(evaluation['human_gold_verified'] is False,'unverified human gold explicitly disclosed')
 result={'checks_passed':len(checks),'errors':errors,'pending_requirements':[m['id'] for m in matrix if m['status'] in ('human_pending','external_pending','deferred_by_user')], 'note':'Passing validates artifacts, not pending external acceptance.'}
 print(json.dumps(result,ensure_ascii=True,indent=2))
 if errors:sys.exit(1)
if __name__=='__main__':main()
