"use client";

import { useState } from "react";

type Word = {
  word: string;
  translation?: string;
  example?: string;
};

export default function VocabularyFlashcard({
  word,
  onClose,
}: {
  word: Word;
  onClose: () => void;
}) {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-[400px] shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-center">
          Vocabulary Card
        </h2>

        <div className="text-center mb-4">
          <p className="text-2xl font-semibold">{word.word}</p>
        </div>

        {!showAnswer ? (
          <button
            onClick={() => setShowAnswer(true)}
            className="w-full bg-blue-500 text-white py-2 rounded-lg"
          >
            Show Answer
          </button>
        ) : (
          <>
            <div className="text-center mt-4 space-y-2">
              <p className="text-gray-700">
                {word.translation || "No translation"}
              </p>
              <p className="text-sm text-gray-500">
                {word.example || "No example"}
              </p>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                className="flex-1 bg-green-500 text-white py-2 rounded-lg"
                onClick={onClose}
              >
                I know
              </button>

              <button
                className="flex-1 bg-orange-500 text-white py-2 rounded-lg"
                onClick={onClose}
              >
                Need practice
              </button>
            </div>
          </>
        )}

        <button
          onClick={onClose}
          className="mt-4 text-sm text-gray-400 w-full"
        >
          Close
        </button>
      </div>
    </div>
  );
}