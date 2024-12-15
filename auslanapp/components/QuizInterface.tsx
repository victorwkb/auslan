'use client';

import React from 'react';

interface QuizInterfaceProps {
  quizStatus: 'idle' | 'in-progress' | 'success' | 'failure';
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
  onStartQuiz
}) => {
    const progressPercentage = quizStatus === 'in-progress' 
    ? (correctCount / totalFrames) * 100 
    : 0;

  return (
    <div className="w-1/2 p-4 flex flex-col items-center justify-center">
      {quizStatus === 'idle' && (
        <button 
          onClick={onStartQuiz}
          className="bg-purple-700 text-white text-xl px-4 py-2 rounded"
        >
          Start Quiz
        </button>
      )}
      {quizStatus === 'in-progress' && (
        <div className="text-center">
          <p className="leading-loose text-xl text-blue-400 italic">Show the letter:</p>
          <p className="text-9xl text-blue-700">{quizLetter}</p>

          <div className="w-full bg-gray-400 rounded-full h-4 mt-4 overflow-hidden">
            <div 
              className="bg-blue-600 h-4 rounded-full transition-all duration-300 ease-out" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      )}
      {quizStatus === 'success' && (
        <div className="text-center">
        <div className="bg-green-200 rounded border-green-500 text-green-700 p-4 mb-4 text-xl">
        <p>Correct!</p> 
        </div>
          <button 
            onClick={onStartQuiz}
            className="bg-purple-700 text-white px-4 py-2 text-xl rounded mt-2"
          >
            Try Again
          </button>
        </div>
      )}
      {quizStatus === 'failure' && (
        <div className="text-2xl text-red-600 text-center">
          <p>Oops! You didn't hold the letter {quizLetter} long enough.</p>
          <button 
            onClick={onStartQuiz}
            className="bg-red-400 text-white px-4 py-2 text-xl rounded mt-2"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};  