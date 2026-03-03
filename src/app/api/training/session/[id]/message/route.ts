import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

type Params = { id: string };

export async function POST(
  request: Request,
  { params }: { params: Params }
) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: "Недействительный токен" },
        { status: 401 }
      );
    }

    const session = await prisma.trainingSession.findUnique({
      where: { id: params.id },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });
    if (!session || session.userId !== payload.userId) {
      return NextResponse.json({ error: "Не найдено" }, { status: 404 });
    }

    const body = await request.json();
    const { content } = body as { content: string };
    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "content обязателен" },
        { status: 400 }
      );
    }

    // сохраняем сообщение пользователя
    await prisma.trainingMessage.create({
      data: {
        sessionId: session.id,
        role: "user",
        content,
      },
    });

    const geminiKey = process.env.GEMINI_API_KEY?.trim();
    const openaiKey = process.env.OPENAI_API_KEY?.trim();
    const useGemini = !!geminiKey;
    const apiKey = geminiKey || openaiKey;

    let assistantReply =
      "Thanks for your message! Try to vary your vocabulary and pay attention to verb tenses. Write another short sentence on the same topic.";

    if (apiKey) {
      try {
        if (useGemini) {
          // Gemini API (generativelanguage.googleapis.com)
          const history = session.messages
            .slice(-6)
            .flatMap((m) =>
              m.role === "assistant"
                ? [{ role: "model" as const, parts: [{ text: m.content }] }]
                : [{ role: "user" as const, parts: [{ text: m.content }] }]
            );
          const contents = [
            ...history,
            { role: "user" as const, parts: [{ text: content }] },
          ];

          const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                systemInstruction: {
                  parts: [
                    {
                      text:
                        "You are an AI English tutor. Respond in Russian or English, concisely. " +
                        "Give feedback on grammar/vocabulary and propose the next micro-step. Be friendly and helpful.",
                    },
                  ],
                },
                contents,
                generationConfig: { temperature: 0.5 },
              }),
            }
          );

          if (res.ok) {
            const data = await res.json();
            const text =
              data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) assistantReply = text;
          } else {
            const errText = await res.text();
            console.error("[Daily Training] Gemini API error:", res.status, errText);
          }
        } else {
          // OpenAI API
          const history = session.messages
            .slice(-6)
            .map((m) => ({
              role: m.role === "assistant" ? "assistant" : "user",
              content: m.content,
            }));

          const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: "gpt-4o-mini",
              messages: [
                {
                  role: "system",
                  content:
                    "You are an AI English tutor. Respond in Russian or English, concisely. " +
                    "Give feedback on grammar/vocabulary and propose the next micro-step. Be friendly and helpful.",
                },
                ...history,
                { role: "user", content },
              ],
              temperature: 0.5,
            }),
          });

          if (res.ok) {
            const data = await res.json();
            const llmContent: string | undefined =
              data.choices?.[0]?.message?.content;
            if (llmContent) assistantReply = llmContent;
          } else {
            const errText = await res.text();
            console.error("[Daily Training] OpenAI API error:", res.status, errText);
          }
        }
      } catch (e) {
        console.error("[Daily Training] LLM request failed:", e);
      }
    } else {
      console.warn(
        "[Daily Training] Neither GEMINI_API_KEY nor OPENAI_API_KEY set — using fallback. Add one to .env and restart."
      );
    }

    await prisma.trainingMessage.create({
      data: {
        sessionId: session.id,
        role: "assistant",
        content: assistantReply,
      },
    });

    const updated = await prisma.trainingSession.findUnique({
      where: { id: session.id },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });

    return NextResponse.json(updated);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Ошибка отправки сообщения" },
      { status: 500 }
    );
  }
}

