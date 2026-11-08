# ADR-002 — AI кеңесі optional, автоматты бағалауға no-go
Date 08.11.2026; owner Ақжан Расуул; status accepted for local demo.

Context: ағылшын диагностикасы мен жоспар AI-сыз пайдалы, provider key жарамсыз, human gold жоқ. Drivers: reproducibility, educational safety, cost, privacy, user таңдауы.

Options: (A) барлық score/plan-ды LLM-ге ауыстыру — қабылданбады, сапа дәлелі/availability жоқ; (B) сыртқы AI-ды міндетті қылу — қабылданбады, coreflow provider ге тәуелді; (C) deterministic core + optionalAI feedback — таңдалды.

Decision: user өтініші бойынша AI_ENABLED=false. Grammar benchmark және PMdraft қолмен/ережемен орындалады. Later opt-in: validkey, independentgold≥30, representativeholdout, macroF1≥.85/eachclass≥.75, costbudget, consent/region, reviewer signoff. Model update болса қайта gate.

Positive: диагностика/28 күн/жаттығу provider сіз; no hallucinated benchmark. Negative: персоналды AI feedback әзірше жоқ, genericprompt шектеулі, кейбір ЛЗ 12/13 критерийлері pending. Verification: isolatedE2E confirms fallback және owner; actualAIaccuracy unknown. Revisit: validkey және human annotation келгенде, жоспарланған 20.11 review.
