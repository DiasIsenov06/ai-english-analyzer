# ЛЗ 13 — PM ассистенті және академиялық адалдық

Қолдану: апталық project status draft. Дерек: read-onlygit(all fetched refs, committer date, unique SHA) және publicGitHubissue metadata. Есепті скрипт санайды; AI тек шектеулі narrative ұсынуға арналған. Қазіргі пайдаланушы таңдауы: AIoff, сондықтан deterministicdraft беріледі. [Runner](../../scripts/labs/ai_experiments.py), [workflow](../../.github/workflows/pm-report.yml), [week 1](evidence/ai/week-1-draft.md), [week 2](evidence/ai/week-2-draft.md), rawsnapshots/promptversions/results солкаталогта.

Екі нақты completed 7 daygitwindow:25.10–01.11 және 01.11–08.11, Asia/Qyzylorda. Commits 2 және 3;current open issues 3. Бұл actual git data, бірақ екі ресми sprinttransitionexport емес. Issuecount — бүгінгі snapshot, тарихи week-endcount емес. Git commitdate/rebase/import cadence-ті өзгертуі мүмкін; commitcount жеткізілген feature санын өлшемейді. No deployment inference.

Pipeline: collect→allowlist→deterministicfacts→versionedprompt→optionalLLM→numericclaimcompare→human review→artifact. Триггер: manualworkflowdispatch не дүйсенбі 05:00 UTC. YAML жергілікті дайын, main-ға кірмей schedule белсенді емес. Ешкімге email/Telegram/Slack жібермейді. CI artifact 30 күн, publicrepo-ға personal content қосылмайды.

## Verification және қате
LLM narrative алғашқы HTTP 400-ден жасалмады; кейін userAIoff таңдады. Сондықтан checkedLLMclaims=0, errorrate=null, materialerrors өлшенбеген. Оны «0%AI қате» деп көрсетпейміз. Скрипт claimkey/value mismatch-ті material деп белгілейді, missing/duplicateclaims болса fail; narrative-ті human review бөлек тексереді. Deterministicdraft 3 фактты source-пен салыстыруға болады, бірақ бұл LLM accuracy емес.

Уақыт: pipeline/automaticverify секундтары reportJSON-да өлшенген. Manualbaseline, human verification және initialsetup нақты адам өлшемінсіз unknown. Payback=(setupminutes)/(manualminutes−generationminutes−human verificationminutes), denominator≤0 болса payback жоқ. Мысал 10 мин manual/1 мин generate/3 мин verify/60 мин setup→10 есеп — **тек формуламысалы**, өлшенгенүнем емес.

## Human review checklist
Факт sourcewindow-ға сай ма;unknown нөлге ауыспадыма;proposedaction өткенжұмыс болып айтылмадыма;open issue snapshot дата айқынба;owner/deployment/incident ойданқосылмадыма;numeric claims толықпа. Бекіткен адам/күн/уақыт босқалады; автор өзіне тәуелсіз қол қоймайды.

Forbiddendata: .env/API/JWT/DBkeys, оқушы email/аты/chat/баға, issuebody/commitmessage ішіндегі жеке дерек, private customer contract. Script allowlist тек SHA/date/count және issueid/state/timestamps. Промптта нұсқау ретінде келген externaltext жоқ. Есеп — draft, шешім owner да.

AI-use disclosure: осы портфолионың құрылымы, код жөндеу және syntheticcases Codex көмегімен жасалды;1–13 DOCX requirements оқылды. Техникалық test/scanner/economicresult нақты орындалған; hypotheticalcustomer/interview/sprint/budget таңбаланған. Нақтыадамныңсұхбаты, қолтаңбасы, goldannotation, sponsorapproval немесе unavailablemodel result жасанды түрде расталған жоқ.
