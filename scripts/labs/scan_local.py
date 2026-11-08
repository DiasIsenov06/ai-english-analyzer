"""Scan a clean source snapshot, excluding ignored credentials/build files.
Docker required. Raw reports are redacted; output paths printed without secrets.
"""
from pathlib import Path
import subprocess,tempfile,shutil,json,datetime
ROOT=Path(__file__).resolve().parents[2]
def main():
 source=Path(tempfile.mkdtemp(prefix='aea-source-scan-'))
 out=ROOT/'docs/labs/evidence/security';out.mkdir(parents=True,exist_ok=True)
 paths=subprocess.check_output(['git','ls-files','-z','--cached','--others','--exclude-standard'],cwd=ROOT).decode('utf-8').split('\0')
 for name in set(paths):
  if not name or name.startswith(('docs/security/scans/','docs/labs/evidence/','coverage/')):continue
  src=ROOT/name
  if src.is_file() and not src.is_symlink():
   dst=source/name;dst.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(src,dst)
 commands={
  'trivy':['docker','run','--rm','-v',f'{source}:/src:ro','-v',f'{out}:/out','aquasec/trivy:0.76.2','fs','--scanners','vuln,misconfig','--include-dev-deps','--format','json','--output','/out/trivy.json','--exit-code','1','--severity','HIGH,CRITICAL','/src'],
  'gitleaks-tree':['docker','run','--rm','-v',f'{source}:/src:ro','-v',f'{out}:/out','ghcr.io/gitleaks/gitleaks:latest','dir','/src','--redact=100','--no-banner','--report-format','json','--report-path','/out/gitleaks-tree.json'],
  'gitleaks-history':['docker','run','--rm','-w','/src','-v',f'{ROOT}:/src:ro','-v',f'{out}:/out','ghcr.io/gitleaks/gitleaks:latest','git','/src','--log-opts=--all','--redact=100','--no-banner','--report-format','json','--report-path','/out/gitleaks-history.json']}
 results={}
 for name,args in commands.items():
  with (out/(name+'.log')).open('w',encoding='utf-8') as f:run=subprocess.run(args,cwd=ROOT,stdout=f,stderr=subprocess.STDOUT)
  results[name]={'exit_code':run.returncode,'report':name+'.json'};print(name,run.returncode,flush=True)
 result={'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'head':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'scope':'working source snapshot plus all fetched git history; excludes ignored .env and generated scan reports','results':results}
 (out/'provenance.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8')
if __name__=='__main__':main()
