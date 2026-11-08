# ЛЗ 12 — AI feature card және тәжірибе

Feature: ағылшын тіліндегі қысқа жауапқа қосымша кері байланыс; диагностиканың rule-based score-ын LLM-ге ауыстырмаймыз. User value: қате туралы түсіндірме, келесі micro-step. Non-goals: ресми CEFR/жоғары жауапкершілікті баға. Метрика: accuracy/macroF1≥.85, әркласс F1≥.75; input≤4000 char, timeout 12 s; no PII; human escalation. Baseline: нақты пайдаланушыда learning gain өлшенбеген.

Үш тәсіл дайын: (1) regex/rule non-AI, (2) Gemini zero-shot rubric, (3) сол модельге 3 бөлек few-shot example. 30 synthetic item:10 correct/10 incorrect/10 uncertain, ambiguity және dialect boundaries. [Dataset](evidence/ai/dataset.json), [runner](../../scripts/labs/ai_experiments.py), [results](evidence/ai/evaluation.json), zero/fewshot prompt+raw JSON сол каталогта.

**Эталонның мәртебесі:** assistant жасаған provisional labels, тәуелсіз адам белгілеген gold емес. Әдіскер 30 item-ді blind қарап, келіспеушілікті adjudicate еткенше сапаны production дәлелі деп қолдануға болмайды. Few-shot examples eval тізімінен бөлек, gold label prompt-қа жіберілмейді. Rulebaseline осы шағын corpus-қа тән, сыртқы generalization кепілі жоқ.

Нақты rule result: accuracy 26/30=86.67%, macroF1=.8681. CorrectF1=.8333, incorrect=.8235, uncertain=.9474. Қателер E14(since five years regex сан сөзін ұстамады), E19(present perfect+yesterday), E20(look forward to+gerund), E22(duck ambiguity, сұрақ белгісіз). Қателерді жасырып scoring threshold-ты кейін өзгерткен жоқпыз.

Gemini 2.5-flash, temperature 0, thinkingBudget 0, batch 30, maxOutput 8192; 08.11 екі нақты әрекет HTTP 400 `API key not valid` қайтарды. Modelversion/usage/token көрсетілмеді, сондықтан AIaccuracy/cost/latency quality **unknown**. Пайдаланушы осыдан кейін AI-сыз режимді таңдады; қайта ақылы сұраулар жасалмайды. Дайын runner жарамды key және кейінгі рұқсатпен `--live --mode eval` орындауға болады.

## Cost model
[Google ресми тарифі](https://ai.google.dev/gemini-api/docs/pricing#gemini-2.5-flash),08.11: Standard text input$0.30/1 M, output inclthinking$2.50/1 M. FormulaUSD=(input×.30+output×2.50)/1 M. Usage жоқта measuredprice ойдан толтырылмайды. Мысал assumption 800 input/200 output→$0.00074/op;2 k/mo→$1.48,10 x 20 k→$14.80 (invoice емес; chat history/token өзгеруі мүмкін). Humanreview 0.5 min×3000₸/h=25₸/op, exchange 500₸/$ — сценарий ғана. All-in variable≈25.37₸/op; AItextcost жалғыз толықоперацияқұны емес.

Self-host incremental fixed 100 k₸/mo, variable 5₸/op деген **баға жорамалы**: APIinference 0.37₸/op-тен қымбат, сондықтан тек inference бойынша positivebreak-even жоқ. Егер vendor тарифі/traffic шарттары өзгерсе Q=F/(Capi−Cself), denominator>0 болғанда ғана. GPU benchmark/quote жоқ. Humanreview екі нұсқада бірдей, салыстырудан қысқарады. Қымбат hardware сатып алу ұсынылмайды.

Provider pricing беті осы модельдің 01.12.2026 auto-routing өзгерісін хабарлайды; live эксперимент алдында model availability/version/rate қайта тексеріледі. Қазіргі негізгі сайт AIoff. [ADR 002](../adr/002-ai-gate.md).

Privacy/control: UI defaultopt-out; per-requestuseAI=true ғана сыртқы provider, serverAI_ENABLED=false басым; text және соңғы 6 message ғана, email жеке өріс ретінде жоқ. FreeformtextPII userwarning арқылы шектеледі, толық автоматты DLP емес. Fallback нақты label мен көрінеді; даулы feedback-ты мұғалім тексереді; бекітілген retention/region болмайынша realstudentpilot жоқ.
