"""Capture reproducible local verification logs without environment values."""
from pathlib import Path
import subprocess,os,json,time,datetime,sys
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'docs/labs/evidence'
def main():
 OUT.mkdir(parents=True,exist_ok=True)
 (OUT/'verification.json').write_text('{"status":"running"}\n',encoding='utf-8')
 npm='npm.cmd' if os.name=='nt' else 'npm'
 commands=[('typecheck',[npm,'run','typecheck']),('lint',[npm,'run','lint']),('unit',[npm,'run','test:coverage']),('python',[sys.executable,'-m','pytest','-q','tests/lab10','--cov=scripts.dora','--cov-fail-under=55']),('portfolio',[sys.executable,'scripts/labs/verify_portfolio.py']),('build',[npm,'run','build']),('audit',[npm,'audit','--json'])]
 results=[]
 for name,cmd in commands:
  start=time.perf_counter()
  with (OUT/(name+'.log')).open('w',encoding='utf-8') as f:run=subprocess.run(cmd,cwd=ROOT,stdout=f,stderr=subprocess.STDOUT)
  results.append({'name':name,'command':cmd,'exit_code':run.returncode,'seconds':round(time.perf_counter()-start,3),'log':name+'.log'})
  print(name,run.returncode,flush=True)
 try:
  e2e=json.loads((ROOT/'test-results/e2e.json').read_text(encoding='utf-8'))['stats']
 except (FileNotFoundError,KeyError):e2e=None
 result={'date':datetime.datetime.now(datetime.timezone.utc).isoformat(),'base_head':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'scope':'uncommitted working tree; local machine, not remote CI','commands':results,'playwright_last_run':e2e,'backup_restore':{'environment':'disposable test compose only','source_user_count':5,'restored_user_count':5,'observed_command_seconds':2.236,'independent_human_review':False},'ai':'disabled by user; live provider rejected prior key; no fabricated metrics'}
 (OUT/'verification.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
if __name__=='__main__':main()
