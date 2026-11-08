"""Reproducible educational economics, not a customer quote. Standard library only."""
from pathlib import Path
import json, math
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'docs/labs/data'
CATEGORIES=['development','infrastructure','licenses_ai','migration','training','support_review','decommission']
# KZT; [initial, year1, year2, year3]. Scenario assumptions, no invoices.
INPUTS={
 'do_nothing': {'support_review':[0,4800000,4800000,4800000]},
 'buy_saas': {'licenses_ai':[0,2400000,2400000,2400000],'migration':[120000,0,0,0],'training':[60000,0,0,0],'support_review':[0,600000,600000,600000],'decommission':[0,0,0,60000]},
 'adapt_open_source': {'development':[1800000,0,0,0],'infrastructure':[0,513040,513040,513040],'licenses_ai':[0,120000,120000,120000],'migration':[90000,0,0,0],'training':[60000,0,0,0],'support_review':[0,1080000,1080000,1080000],'decommission':[0,0,0,90000]},
 'extend_analyzer': {'development':[1260000,0,0,0],'infrastructure':[0,513040,513040,513040],'licenses_ai':[0,120000,120000,120000],'migration':[36000,0,0,0],'training':[24000,0,0,0],'support_review':[0,888000,888000,888000],'decommission':[0,0,0,60000]}
}
def calculate(lines,cost_factor=1.,benefit_factor=1.,discount=.15):
 costs=[sum(v[y] for v in lines.values())*cost_factor for y in range(4)]
 benefit=[0]+[4800000*benefit_factor]*3
 net=[b-c for b,c in zip(benefit,costs)]
 tco=sum(costs);npv=sum(v/(1+discount)**y for y,v in enumerate(net))
 payback=None;cum=net[0]
 if cum==0 and any(v>0 for v in net[1:]):payback=0
 for year in range(1,4):
  if cum<0 and cum+net[year]>=0 and net[year]>0 and payback is None:payback=(year-1)*12+12*(-cum/net[year])
  cum+=net[year]
 return {'costs_by_year':costs,'gross_benefit_by_year':benefit,'net_by_year':net,'tco_3y':tco,'roi_pct':100*(sum(benefit)-tco)/tco,'npv':npv,'payback_months':payback}
def main():
 OUT.mkdir(parents=True,exist_ok=True)
 alternatives={name:calculate(lines) for name,lines in INPUTS.items()}
 chosen=INPUTS['extend_analyzer'];r=alternatives['extend_analyzer']
 sensitivity={name:calculate(chosen,c,b) for name,c,b in [('base',1,1),('cost_plus_30',1.3,1),('benefit_half',1,.5),('both',1.3,.5)]}
 result={'as_of':'2026-11-08','currency':'KZT','status':'educational assumptions, no actual customer savings','discount':.15,'cost_lines':{a:{k:v.get(k,[0]*4) for k in CATEGORIES} for a,v in INPUTS.items()},'alternatives':alternatives,'sensitivity':sensitivity,
 'delay_cost_per_month':(4800000-r['costs_by_year'][1])/12,
 'break_even_benefit_fraction_npv':sum(c/(1.15)**y for y,c in enumerate(r['costs_by_year']))/sum(4800000/1.15**y for y in (1,2,3))}
 (OUT/'economics.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
 lines=['# ЛЗ3 — есептелген экономика','', 'Барлық сома ₸. Формулалар: TCO=Σcost; ROI=(Σbenefit−TCO)/TCO; NPV=Σnet_y/(1+r)^y; payback — кумулятив net нөлден асқан ай. r=15% — оқу hurdle rate, нарық болжамы емес.','', '| Балама | 3 жыл TCO | ROI | NPV | Payback ай |','|---|---:|---:|---:|---:|']
 for name,v in alternatives.items():lines.append(f"| {name} | {v['tco_3y']:,.0f} | {v['roi_pct']:.1f}% | {v['npv']:,.0f} | {v['payback_months'] if v['payback_months'] is not None else 'жоқ / baseline'} |")
 lines+=['','| Sensitivity | TCO | NPV | ROI |','|---|---:|---:|---:|']
 for name,v in sensitivity.items():lines.append(f"| {name} | {v['tco_3y']:,.0f} | {v['npv']:,.0f} | {v['roi_pct']:.1f}% |")
 lines += ['',f"Айлық кідіріс opportunity cost: {result['delay_cost_per_month']:,.0f} ₸ (жылдық benefit−run cost)/12. NPV=0 шегі: болжанған пайданың {100*result['break_even_benefit_fraction_npv']:.1f}%-ы. Уақыт үнемі ақшалай cash saving-ке айналмаса ROI дәлелденбейді."]
 (ROOT/'docs/labs/economics-results.md').write_text('\n'.join(lines)+'\n',encoding='utf-8')
 print(json.dumps({'npv':r['npv'],'payback_months':r['payback_months'],'sensitivity_both_npv':sensitivity['both']['npv']},indent=2))
if __name__=='__main__':main()
