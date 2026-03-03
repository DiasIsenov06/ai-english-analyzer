import { addDays, formatISO } from "date-fns";

export type SkillBreakdown = {
  level: string;
  goal?: string | null;
  grammar: number;
  vocabulary: number;
  reading: number;
  listening: number;
  writing: number;
  speaking: number;
  weakestSkill: string;
};

export type StudyPlanMeta = {
  level: string;
  goal?: string | null;
  startDate: string;
  durationDays: number;
};

export type StudyPlanDayPayload = {
  dayIndex: number;
  date: string;
  focus: string;
  blocks: {
    type:
      | "warmup"
      | "grammar"
      | "vocabulary"
      | "reading"
      | "listening"
      | "writing"
      | "speaking"
      | "review"
      | "test";
    title: string;
    description: string;
    estimatedMinutes: number;
  }[];
};

export type StudyPlanPayload = {
  meta: StudyPlanMeta;
  days: StudyPlanDayPayload[];
};

export async function generateStudyPlanMock(
  skills: SkillBreakdown
): Promise<StudyPlanPayload> {
  const durationDays = 28;
  const start = new Date();

  const weakest = skills.weakestSkill || "Grammar";
  const secondWeakest =
    ["Grammar", "Vocabulary", "Speaking", "Listening"].find(
      (s) => s !== weakest
    ) ?? "Vocabulary";

  const dayPayloads: StudyPlanDayPayload[] = [];

  for (let i = 0; i < durationDays; i++) {
    const date = addDays(start, i);
    const isoDate = formatISO(date, { representation: "date" });

    const dayOfWeek = date.getDay(); // 0 Sunday

    const isReview = dayOfWeek === 0; // Sunday
    const isMiniTest = dayOfWeek === 3; // Wednesday

    const focus = isReview
      ? "Review & consolidation"
      : isMiniTest
      ? "Mini-test & feedback"
      : i < 10
      ? `${weakest} core practice`
      : i < 20
      ? `${secondWeakest} & integrated skills`
      : "Exam-style mixed practice";

    const blocks: StudyPlanDayPayload["blocks"] = [];

    blocks.push({
      type: "warmup",
      title: "Warm-up questions",
      description:
        "2–3 коротких вопроса на говорение/письмо, чтобы переключиться в английский.",
      estimatedMinutes: 5,
    });

    if (isReview) {
      blocks.push(
        {
          type: "review",
          title: "Review of last 3 days",
          description:
            "Просмотри заметки и ошибки за последние 3 дня. Попробуй переписать 5 предложений без ошибок.",
          estimatedMinutes: 10,
        },
        {
          type: "grammar",
          title: "Error log drill",
          description:
            "Выбери 5 типичных ошибок из предыдущих сессий и перепиши их правильно с коротким объяснением.",
          estimatedMinutes: 10,
        }
      );
    } else if (isMiniTest) {
      blocks.push(
        {
          type: "test",
          title: "Mini grammar & vocab test",
          description:
            "10–15 заданий на грамматику и лексику уровня " +
            skills.level +
            ". Отметь темы, где есть сомнения.",
          estimatedMinutes: 15,
        },
        {
          type: "writing",
          title: "Short writing task",
          description:
            "Напиши 80–100 слов по теме твоей цели (напр. IELTS, Speaking). Сфокусируйся на " +
            weakest.toLowerCase() +
            ".",
          estimatedMinutes: 15,
        }
      );
    } else {
      blocks.push(
        {
          type: "grammar",
          title: "Grammar micro-lesson",
          description:
            "Теория + 5–7 заданий по теме, связанной с " +
            weakest.toLowerCase() +
            " (уровень " +
            skills.level +
            ").",
          estimatedMinutes: 10,
        },
        {
          type: "vocabulary",
          title: "Vocabulary set",
          description:
            "Выучи 8–12 слов по теме, связанной с твоей целью (" +
            (skills.goal ?? "общий английский") +
            "). Составь 5 предложений.",
          estimatedMinutes: 10,
        },
        {
          type: i % 2 === 0 ? "reading" : "listening",
          title: i % 2 === 0 ? "Reading micro-task" : "Listening micro-task",
          description:
            i % 2 === 0
              ? "Короткий текст 150–220 слов с 3–4 вопросами понимания."
              : "Короткий аудио/видео фрагмент (или транскрипт) с 3–4 вопросами.",
          estimatedMinutes: 10,
        },
        {
          type: "speaking",
          title: "Speaking simulation",
          description:
            "Ответь письменно на 2–3 вопроса, как будто говоришь вслух. Сфокусируйся на беглости и точности.",
          estimatedMinutes: 5,
        }
      );
    }

    dayPayloads.push({
      dayIndex: i,
      date: isoDate,
      focus,
      blocks,
    });
  }

  return {
    meta: {
      level: skills.level,
      goal: skills.goal,
      startDate: formatISO(start, { representation: "date" }),
      durationDays,
    },
    days: dayPayloads,
  };
}

/**
 * Высокоуровневая функция генерации плана.
 * Использует GEMINI_API_KEY (если задан) или OPENAI_API_KEY.
 * Если что‑то идёт не так — fallback на generateStudyPlanMock.
 */
export async function generateStudyPlan(
  skills: SkillBreakdown
): Promise<StudyPlanPayload> {
  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  const openaiKey = process.env.OPENAI_API_KEY?.trim();
  const useGemini = !!geminiKey;
  const apiKey = geminiKey || openaiKey;

  if (!apiKey) {
    return generateStudyPlanMock(skills);
  }

  const systemPrompt =
    "You are an AI English tutor. Generate a 28-day personalized English study plan as STRICT JSON only. " +
    "Do not include any explanation or markdown. JSON schema: " +
    "{ \"meta\": { \"level\": string, \"goal\": string | null, \"startDate\": string (YYYY-MM-DD), \"durationDays\": number }, " +
    "\"days\": [ { \"dayIndex\": number, \"date\": string (YYYY-MM-DD), \"focus\": string, \"blocks\": [ { " +
    "\"type\": \"warmup\" | \"grammar\" | \"vocabulary\" | \"reading\" | \"listening\" | \"writing\" | \"speaking\" | \"review\" | \"test\", " +
    "\"title\": string, \"description\": string, \"estimatedMinutes\": number } ] } ] }. " +
    "DurationDays must be 28. Each day total time 20-40 minutes. Include review days and mini-tests.";

  const userPrompt = JSON.stringify({
    level: skills.level,
    goal: skills.goal ?? null,
    skills: {
      grammar: skills.grammar,
      vocabulary: skills.vocabulary,
      reading: skills.reading,
      listening: skills.listening,
      writing: skills.writing,
      speaking: skills.speaking,
    },
    weakestSkill: skills.weakestSkill,
  });

  try {
    let content: string;

    if (useGemini) {
      const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents: [{ role: "user", parts: [{ text: userPrompt }] }],
            generationConfig: { temperature: 0.4 },
          }),
        }
      );

      if (!res.ok) {
        throw new Error("LLM error");
      }

      const data = await res.json();
      content = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    } else {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.4,
        }),
      });

      if (!res.ok) {
        throw new Error("LLM error");
      }

      const data = await res.json();
      content = data.choices?.[0]?.message?.content ?? "";
    }
    if (!content) throw new Error("Empty LLM content");

    const parsed = JSON.parse(content) as StudyPlanPayload;
    // минимальная валидация
    if (!parsed.meta || !Array.isArray(parsed.days)) {
      throw new Error("Invalid LLM JSON");
    }
    return parsed;
  } catch (e) {
    console.error("LLM plan generation failed, fallback to mock:", e);
    return generateStudyPlanMock(skills);
  }
}

