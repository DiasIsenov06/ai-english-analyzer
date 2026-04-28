import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type GeneratedTask = {
  type: string;
  title: string;
  content: Record<string, unknown>;
  orderIndex: number;
};

function getWeakFocus(result: {
  grammarScore?: number | null;
  vocabularyScore?: number | null;
  correctionScore?: number | null;
}) {
  const grammar = result.grammarScore ?? 0;
  const vocabulary = result.vocabularyScore ?? 0;
  const correction = result.correctionScore ?? 0;

  const items = [
    { key: "grammar", value: grammar },
    { key: "vocabulary", value: vocabulary },
    { key: "correction", value: correction },
  ].sort((a, b) => a.value - b.value);

  return items[0].key;
}

function generateDayTasks(
  dayIndex: number,
  level: string,
  weakFocus: string
): GeneratedTask[] {
  const vocabularySets = [
    ["hello", "goodbye", "please", "thank you", "water", "food", "house", "book", "friend", "day"],
    ["city", "country", "family", "school", "teacher", "student", "work", "travel", "money", "time"],
    ["morning", "evening", "week", "month", "year", "shop", "market", "car", "bus", "train"],
    ["eat", "drink", "sleep", "read", "write", "speak", "listen", "walk", "run", "study"],
    ["happy", "sad", "big", "small", "fast", "slow", "hot", "cold", "easy", "difficult"],
    ["airport", "hotel", "ticket", "passport", "road", "street", "map", "station", "bag", "phone"],
    ["question", "answer", "example", "lesson", "exercise", "mistake", "correct", "practice", "repeat", "remember"],
  ];

  const grammarTopics = [
    {
      title: "Present Simple",
      explanation:
        "Use Present Simple for habits, routines, and general facts.",
      examples: ["I study every day.", "She works in a bank."],
    },
    {
      title: "Verb to be",
      explanation:
        "Use am, is, are to describe people, things, and states.",
      examples: ["I am a student.", "They are happy."],
    },
    {
      title: "Articles: a / an",
      explanation:
        "Use a/an with singular countable nouns when talking about one thing.",
      examples: ["a book", "an apple"],
    },
    {
      title: "Plural nouns",
      explanation:
        "Add -s or -es to form plural nouns in most cases.",
      examples: ["book → books", "bus → buses"],
    },
    {
      title: "Possessive adjectives",
      explanation:
        "Use my, your, his, her, its, our, their before nouns.",
      examples: ["my phone", "their house"],
    },
    {
      title: "There is / There are",
      explanation:
        "Use there is for singular and there are for plural.",
      examples: ["There is a cat.", "There are two books."],
    },
    {
      title: "Prepositions of place",
      explanation:
        "Use in, on, under, next to to describe position.",
      examples: ["The book is on the table.", "The cat is under the chair."],
    },
  ];

  const correctionTasks = [
    {
      title: "Fix simple sentence mistakes",
      sentences: [
        "She go to school every day.",
        "I am play football now.",
        "He have a car.",
      ],
    },
    {
      title: "Choose the correct sentence",
      sentences: [
        "They is happy. / They are happy.",
        "I has a dog. / I have a dog.",
        "She like tea. / She likes tea.",
      ],
    },
    {
      title: "Correct word order",
      sentences: [
        "Always I drink coffee.",
        "English speaks he well.",
        "To school goes she every day.",
      ],
    },
  ];

  const vocabWords = vocabularySets[(dayIndex - 1) % vocabularySets.length];
  const grammar = grammarTopics[(dayIndex - 1) % grammarTopics.length];
  const correction = correctionTasks[(dayIndex - 1) % correctionTasks.length];

  const tasks: GeneratedTask[] = [
    {
      type: "vocabulary",
      title: `Day ${dayIndex} Vocabulary`,
      content: {
        level,
        words: vocabWords,
        targetCount: 10,
      },
      orderIndex: 1,
    },
    {
      type: "grammar",
      title: grammar.title,
      content: {
        level,
        explanation: grammar.explanation,
        examples: grammar.examples,
      },
      orderIndex: 2,
    },
    {
      type: "correction",
      title: correction.title,
      content: {
        level,
        sentences: correction.sentences,
      },
      orderIndex: 3,
    },
  ];

  if (weakFocus === "grammar") {
    tasks[1].content = {
      ...tasks[1].content,
      priority: "high",
      note: "Main focus area based on diagnostic result",
    };
  }

  if (weakFocus === "vocabulary") {
    tasks[0].content = {
      ...tasks[0].content,
      priority: "high",
      note: "Main focus area based on diagnostic result",
    };
  }

  if (weakFocus === "correction") {
    tasks[2].content = {
      ...tasks[2].content,
      priority: "high",
      note: "Main focus area based on diagnostic result",
    };
  }

  return tasks;
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const parsedBody = rawBody ? JSON.parse(rawBody) : {};
    const url = new URL(request.url);

    const userId =
      parsedBody.userId || url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const latestResult = await prisma.testResult.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    const level = latestResult?.level ?? user.level ?? "A1";
    const weakFocus = latestResult
      ? getWeakFocus(latestResult)
      : "grammar";

    const existingPlan = await prisma.studyPlan.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        days: true,
      },
    });

    if (existingPlan) {
      return NextResponse.json({
        ok: true,
        alreadyExists: true,
        planId: existingPlan.id,
      });
    }

    const startDate = new Date();

    const plan = await prisma.studyPlan.create({
      data: {
        userId,
        metaJson: JSON.stringify({
          level,
          goal: user.goal ?? null,
          weakFocus,
          duration_days: 7,
          source: "simple-logic-generator",
        }),
      },
    });

    for (let dayIndex = 1; dayIndex <= 7; dayIndex++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + (dayIndex - 1));

      const day = await prisma.studyPlanDay.create({
        data: {
          planId: plan.id,
          dayIndex,
          date,
          dataJson: JSON.stringify({
            title: `Day ${dayIndex}`,
            focus: weakFocus,
            level,
          }),
          status: "pending",
        },
      });

      const tasks = generateDayTasks(dayIndex, level, weakFocus);

      for (const task of tasks) {
        await prisma.studyTask.create({
          data: {
            dayId: day.id,
            type: task.type,
            title: task.title,
            contentJson: JSON.stringify(task.content),
            orderIndex: task.orderIndex,
            status: "pending",
          },
        });
      }
    }

    return NextResponse.json({
      ok: true,
      planId: plan.id,
      level,
      weakFocus,
    });
  } catch (error) {
    console.error("Generate plan error:", error);

    return NextResponse.json(
      { error: "Failed to generate study plan" },
      { status: 500 }
    );
  }
}