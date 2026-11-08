from datetime import datetime,timezone
from scripts.dora import calculate,dt,deployments,dashboard
NOW=datetime(2026,11,4,9,tzinfo=timezone.utc)
def test_zero_history_is_unknown_not_zero():
    r=calculate([],[],NOW)
    assert r["frequency_per_week"]==0
    assert r["lead_time_median_hours"] is None and r["mttr_median_hours"] is None
    assert r["change_failure_rate_pct"] is None
def test_green_ci_not_deploy():
    def api(url):
        if "/workflows/" in url:return {"workflow_runs":[{"id":1,"head_branch":"main","event":"push","status":"completed","head_sha":"abc"}]}
        return {"jobs":[{"name":"quality","conclusion":"success"}]}
    assert deployments(api)==[]
def test_real_deploy_only():
    def api(url):
        if "/workflows/" in url:return {"workflow_runs":[{"id":1,"head_branch":"main","event":"push","status":"completed","head_sha":"abc"}]}
        if "/jobs?" in url:return {"jobs":[{"name":"deploy-staging","conclusion":"success","completed_at":"2026-11-03T12:00:00Z"}]}
        return {"commit":{"committer":{"date":"2026-11-03T10:00:00Z"}}}
    assert len(deployments(api))==1
def test_calculate_verified_incident():
    run=[{"id":"1","committed":"2026-11-03T10:00:00Z","deployed":"2026-11-03T12:00:00Z"}]
    inc=[{"deployment_run_id":"1","change_failure":"true","status":"verified","detected_at":"2026-11-03T12:10:00Z","recovered_at":"2026-11-03T13:10:00Z"}]
    r=calculate(run,inc,NOW,"2026-11-04T09:00:00Z")
    assert r["frequency_per_week"]==.25 and r["lead_time_median_hours"]==2
    assert r["change_failure_rate_pct"]==100 and r["mttr_median_hours"]==1
def test_incomplete_incident_log():
    r=calculate([{"id":"1","committed":"2026-11-03T10:00:00Z","deployed":"2026-11-03T12:00:00Z"}],[],NOW)
    assert r["change_failure_rate_pct"] is None
def test_dashboard():
    assert "Н/Д" in dashboard(calculate([],[],NOW))
def test_utc():
    assert dt("2026-11-04T09:00:00Z")==NOW
