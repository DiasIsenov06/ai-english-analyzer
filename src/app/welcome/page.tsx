"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-b from-sky-50 to-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl border border-sky-100 overflow-hidden">
        <div className="grid md:grid-cols-2 items-center gap-8 p-8 md:p-12">
          <div className="flex justify-center">
            <div className="relative w-[260px] h-[260px] md:w-[340px] md:h-[340px]">
              <Image
                src="/images/mascot-test.png"
                alt="Aqyldy_barys mascot"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          <div className="text-center md:text-left">
            <p className="text-sky-500 font-semibold text-sm uppercase tracking-wider mb-3">
              Welcome
            </p>

            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
              Сәлем! Мен Aqyldy_barys.
            </h1>

            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              Мен саған ағылшын деңгейіңді анықтауға көмектесемін.
            </p>

            <p className="text-base text-gray-500 mb-8 leading-relaxed">
              Алдымен қысқа placement test тапсырып алайық. Осыдан кейін
              система саған жеке learning plan ұсына алады.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button
                onClick={() => router.push("/test")}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-accent-start to-accent-end text-white font-semibold shadow-lg hover:scale-[1.02] transition"
              >
                Тестті бастау
              </button>

              <button
                onClick={() => router.push("/dashboard")}
                className="px-8 py-4 rounded-2xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition"
              >
                Кейінірек
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}