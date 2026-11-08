"""Real GitHub Actions DORA snapshot. No synthetic deployment data."""
import os,json,csv,statistics,urllib.request,urllib.error,sys
from datetime import datetime,timedelta,timezone
from pathlib import Path
BASE="https://api.github.com/repos/DiasIsenov06/ai-english-analyzer"
OUT=Path(__file__).resolve().parents[1]/"docs/ops/lab10"
def dt(v):
    return datetime.fromisoformat(v.replace("Z","+00:00")) if v else None
def fetch(url):
    headers={"User-Agent":"Lab10-DORA","Accept":"application/vnd.github+json"}
    if os.getenv("GH_TOKEN"): headers["Authorization"]="Bearer "+os.environ["GH_TOKEN"]
    with urllib.request.urlopen(urllib.request.Request(url,headers=headers),timeout=20) as f:
        return json.load(f)
def deployments(api=fetch):
    def pages(url,key):
        result=[]
        for page in range(1,101):
            batch=api(url+f"&page={page}").get(key,[])
            result.extend(batch)
            if len(batch)<100:return result
        raise RuntimeError('Pagination limit reached: incomplete history')
    runs=pages(BASE+"/actions/workflows/ci.yml/runs?branch=main&per_page=100","workflow_runs")
    found=[]
    for run in runs:
        if run.get("head_branch")!="main" or run.get("event")!="push" or run.get("status")!="completed":continue
        jobs=pages(BASE+"/actions/runs/"+str(run["id"])+"/jobs?per_page=100","jobs")
        for job in jobs:
            if job.get("name")!="deploy-staging" or job.get("conclusion")!="success":continue
            stamp=api(BASE+"/commits/"+run["head_sha"])["commit"]["committer"]["date"]
            found.append({"id":str(run["id"]),"sha":run["head_sha"],"committed":stamp,"deployed":job["completed_at"],"url":run.get("html_url","")})
    return found
def calculate(runs,incidents,end,verified_through=None):
    start=end-timedelta(days=28)
    runs=[r for r in runs if dt(r.get("deployed")) and start<=dt(r["deployed"])<=end]
    lead=[(dt(r["deployed"])-dt(r["committed"])).total_seconds()/3600 for r in runs if r.get("committed") and dt(r["deployed"])>=dt(r["committed"])]
    verified=bool(verified_through and dt(verified_through)>=end)
    failing={str(r["deployment_run_id"]) for r in incidents if r.get("status")=="verified" and r.get("change_failure")=="true"}
    recover=[(dt(r["recovered_at"])-dt(r["detected_at"])).total_seconds()/3600 for r in incidents if r.get("status")=="verified" and r.get("detected_at") and r.get("recovered_at") and start<=dt(r["detected_at"])<=end and dt(r["recovered_at"])>=dt(r["detected_at"])]
    return {"period":[start.isoformat(),end.isoformat()],"scope":"successful deploy-staging job on main only (temporary staging, not production)","deployments":len(runs),"frequency_per_week":len(runs)/4,"lead_time_median_hours":round(statistics.median(lead),2) if lead else None,"change_failure_rate_pct":round(100*sum(r["id"] in failing for r in runs)/len(runs),2) if verified and runs else None,"mttr_median_hours":round(statistics.median(recover),2) if recover else None,"incident_log_verified":verified,"runs":runs}
def dashboard(m):
    parts=[]
    for title,key,unit in [("Deployment frequency","frequency_per_week","/апта"),("Lead time","lead_time_median_hours","сағ"),("Change failure rate","change_failure_rate_pct","%"),("MTTR","mttr_median_hours","сағ")]:
        value=m[key]
        parts.append('<div style="background:white;border:1px solid #ddd;border-radius:12px;padding:24px"><h3>'+title+'</h3><b style="font-size:32px">'+(str(value)+" "+unit if value is not None else "Н/Д")+"</b></div>")
    return '<!doctype html><meta charset="utf-8"><body style="font-family:Arial;background:#f2f6fb;margin:40px"><h1>AI English Analyzer | DORA</h1><p>Only confirmed temporary staging deployments; CI green is not deployment. Н/Д is unknown, not zero.</p><div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">'+"".join(parts)+"</div></body>"
def main():
    offline="--offline" in sys.argv
    end=dt(sys.argv[sys.argv.index("--offline")+1]) if offline and len(sys.argv)>sys.argv.index("--offline")+1 else datetime.now(timezone.utc)
    error=None
    try:
        if offline:raise RuntimeError('Offline: deployments were not fetched')
        runs=deployments()
    except (urllib.error.URLError,RuntimeError) as exc:
        runs=[];error=type(exc).__name__+': source unavailable or not fetched'
    with (OUT/"incidents.csv").open(encoding="utf-8",newline="") as f: incidents=list(csv.DictReader(f))
    verification=json.loads((OUT/"incident-verification.json").read_text(encoding="utf-8"))
    result=calculate(runs,incidents,end,verification.get("verified_through"))
    result['source']={'api':BASE,'retrieved_at':datetime.now(timezone.utc).isoformat(),'complete':error is None,'error':error}
    if error:
        for key in ['deployments','frequency_per_week','lead_time_median_hours','change_failure_rate_pct','mttr_median_hours']:result[key]=None
    (OUT/"metrics.json").write_text(json.dumps(result,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    (OUT/"dashboard.html").write_text(dashboard(result),encoding="utf-8")
    print(json.dumps(result,ensure_ascii=False,indent=2))
if __name__=="__main__": main()
