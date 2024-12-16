"use client";

import React from "react";
import { Button } from "./ui/button";

interface QuizInterfaceProps {
  quizStatus: "idle" | "in-progress" | "success" | "failure";
  quizLetter: string | null;
  correctCount: number;
  totalFrames: number;
  onStartQuiz: () => void;
}

export const QuizInterface: React.FC<QuizInterfaceProps> = ({
  quizStatus,
  quizLetter,
  totalFrames,
  correctCount,
  onStartQuiz,
}) => {
  const progressPercentage =
    quizStatus === "in-progress" ? (correctCount / totalFrames) * 100 : 0;

  const getProgressBarColor = () => {
    if (progressPercentage <= 15) return "bg-red-500"; // Red for low progress
    if (progressPercentage <= 30) return "bg-yellow-500"; // Yellow for medium-low progress
    if (progressPercentage <= 55) return "bg-green-500"; // Green for medium-high progress
    return "bg-blue-500"; // Blue for high progress
  };

  return (
    <div
      className="absolute left-0 top-0 z-10 w-1/3 p-4 h-full w-1/4 flex flex-col items-center justify-center
      bg-gradient-to-b from-primary from-10% via-secondary via-40% to-tertiary to-90% "
    >
      {quizStatus === "idle" && (
        <Button
          onClick={onStartQuiz}
          className="animate-in text-l text-white uppercase px-14 py-6 mt-8"
          style={{ "--index": 1 } as React.CSSProperties}
        >
          Start Quiz
        </Button>
      )}
      {quizStatus === "in-progress" && (
        <div className="text-center">
          <p
            className="animate-in leading-loose text-xl text-blue-400 italic"
            style={{ "--index": 1 } as React.CSSProperties}
          >
            Show the letter:
          </p>
          <p
            className="animate-in text-9xl text-blue-700"
            style={{ "--index": 2 } as React.CSSProperties}
          >
            {quizLetter}
          </p>
          <div className="w-full bg-gray-400 rounded-full h-4 mt-4 overflow-hidden">
            <div
              className={`h-4 rounded-full transition-all duration-300 ease-out ${getProgressBarColor()}`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      )}
      {quizStatus === "success" && (
        <div className="text-center">
          <div className="bg-green-200 rounded-full border-2 border-green-500 text-green-700 px-14 py-6 mb-4 text-xl">
            <p>Correct!</p>
          </div>
          <button
            onClick={onStartQuiz}
            className="bg-purple-700 text-white px-14 py-4 text-xl rounded-full mt-2"
          >
            Try Again
          </button>
        </div>
      )}
      {quizStatus === "failure" && (
        <div className="text-center">
          <div className="bg-red-200 rounded-full border-2 border-red-500 text-red-700 px-14 py-6 mb-4 text-xl">
            <p>Incorrect!</p>
          </div>
          <button
            onClick={onStartQuiz}
            className="bg-red-400 text-white px-14 py-4 text-xl rounded-full mt-2"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};
