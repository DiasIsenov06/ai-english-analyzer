"""ЛЗ9: модельдік sprint metrics. Python 3.11+, сыртқы пакетсіз."""
import csv, json, datetime as D
from pathlib import Path
from statistics import mean

ROOT=Path(__file__).resolve().parents[1]/"docs/plan/lab9"
def parse(v): return D.datetime.fromisoformat(v) if v.strip() else None
def hours(a,b):
    if a is None or b is None or b<=a:return 0.0
    total=0.0
    day=a.date()
    while day<=b.date():
        if day.weekday()<5:
            st=max(a,D.datetime.combine(day,D.time(9)))
            en=min(b,D.datetime.combine(day,D.time(17)))
            if en>st:total+=(en-st).total_seconds()/3600
        day+=D.timedelta(days=1)
    return total
def quantile(seq,p):
    s=sorted(seq); k=(len(s)-1)*p; i=int(k)
    return s[i]+(s[min(i+1,len(s)-1)]-s[i])*(k-i)
def state(r,t):
    for key,label in [('done_at','Done'),('review_at','Review'),('started_at','In progress'),('ready_at','Ready')]:
        v=parse(r[key])
        if v and t>=v:return label
    return 'Backlog'
def svg(sprint,days,rows):
    labels=['Done','Review','In progress','Ready','Backlog']
    palette=['#269d80','#f2ae62','#689ad0','#a1b8d5','#e2e7ec']
    w,h=760,375; px=[80+i*150 for i in range(5)]; top=65; scale=30
    paths=[]; lower=[0]*5
    for label,color in zip(labels,palette):
        upper=[lower[i]+int(days[i][label]) for i in range(5)]
        pts=[f'{px[i]},{top+scale*(8-upper[i])}' for i in range(5)]
        pts+= [f'{px[i]},{top+scale*(8-lower[i])}' for i in range(4,-1,-1)]
        paths.append(f'<polygon points="{" ".join(pts)}" fill="{color}" stroke="white" stroke-width="1"/>')
        lower=upper
    dates=[d['date'][5:] for d in days]
    axes=''.join(f'<text x="{px[i]}" y="330" font-size="14" text-anchor="middle">{dt}</text>' for i,dt in enumerate(dates))
    legend=''.join(f'<rect x="{40+i*145}" y="344" width="13" height="12" fill="{color}"/><text x="{58+i*145}" y="354" font-size="12">{label}</text>' for i,(label,color) in enumerate(zip(labels,palette)))
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}"><rect width="100%" height="100%" fill="white"/><text x="40" y="30" font-family="Arial" font-size="20" font-weight="bold">CFD — sprint {sprint} (simulation)</text><g font-family="Arial">{"".join(paths)}{axes}{legend}</g></svg>'
def main():
    rows=list(csv.DictReader((ROOT/'simulated_transition_log.csv').open(encoding='utf-8-sig',newline='')))
    summaries={}; tasks=[]; daily=[]
    for s in (1,2):
        subset=[r for r in rows if int(r['sprint'])==s]; finished=[r for r in subset if r['done_at']]
        cycle=[];review=[]
        for r in finished:
            cy=hours(parse(r['started_at']),parse(r['done_at']))/8
            rv=hours(parse(r['review_at']),parse(r['done_at']))/8
            cycle.append(cy);review.append(rv)
            tasks.append({'sprint':s,'task_id':r['task_id'],'cycle_days':round(cy,4),'review_days':round(rv,4)})
        first=D.date(2026,10,12 if s==1 else 19)
        samples=[]
        for i in range(5):
            d=first+D.timedelta(days=i)
            start=D.datetime.combine(d,D.time(9));end=D.datetime.combine(d,D.time(17))
            t=end-D.timedelta(seconds=1)
            states={x:sum(state(r,t)==x for r in subset) for x in ('Done','Review','In progress','Ready','Backlog')}
            wip=sum(hours(max(start,parse(r['started_at'])),min(end,parse(r['done_at']))) for r in finished if parse(r['started_at'])<end and parse(r['done_at'])>start)/8
            item={'sprint':s,'date':str(d),'avg_wip':round(wip,4),**states}
            samples.append(item);daily.append(item)
        avg_wip=mean(d['avg_wip'] for d in samples)
        summaries[str(s)]={'period':f'{first} — {first+D.timedelta(days=4)}','planned_tasks':len(subset),
          'throughput_tasks':len(finished),'cycle_mean_days':round(mean(cycle),4),
          'cycle_p85_days':round(quantile(cycle,.85),4),'review_mean_days':round(mean(review),4),
          'mean_daily_wip':round(avg_wip,4),'little_rhs':round((len(finished)/5)*mean(cycle),4)}
        (ROOT/f'cfd-sprint-{s}.svg').write_text(svg(s,samples,subset),encoding='utf-8')
    def save_csv(name,arr):
        with (ROOT/name).open('w',encoding='utf-8',newline='') as f:
            wr=csv.DictWriter(f,fieldnames=arr[0].keys());wr.writeheader();wr.writerows(arr)
    save_csv('task_metrics.csv',tasks);save_csv('daily_wip.csv',daily)
    result={'model':'ОҚУ СИМУЛЯЦИЯСЫ; GitHub Projects экспорты емес','timezone':'Asia/Almaty',
      'workday':'Mon–Fri 09:00–17:00','percentile_method':'linear inclusive','sprints':summaries}
    (ROOT/'metrics.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(result,ensure_ascii=False,indent=2))
if __name__=='__main__': main()
