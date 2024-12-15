'use client';

import React from 'react';

interface QuizInterfaceProps {
  quizStatus: 'idle' | 'in-progress' | 'success' | 'failure';
  quizLetter: string | null;
  correctCount: number;
  currentFrameCount: number;
  totalFrames: number;
  onStartQuiz: () => void;
}

export const QuizInterface: React.FC<QuizInterfaceProps> = ({
  quizStatus,
  quizLetter,
  totalFrames,
  currentFrameCount,
  correctCount,
  onStartQuiz
}) => {
    const progressPercentage = quizStatus === 'in-progress' 
    ? (correctCount / totalFrames) * 100 
    : 0;

    const getProgressBarColor = () => {
        if (progressPercentage <= 15) return 'bg-red-500'; // Red for low progress
        if (progressPercentage <= 30) return 'bg-yellow-500'; // Yellow for medium-low progress
        if (progressPercentage <= 55) return 'bg-green-500'; // Green for medium-high progress
        return 'bg-blue-500'; // Blue for high progress
      };


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
              className={`h-4 rounded-full transition-all duration-300 ease-out ${getProgressBarColor()}`} 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      )}
      {quizStatus === 'success' && (
        <div className="text-center">
        <div className="bg-green-200 rounded border-2 border-green-500 text-green-700 p-4 mb-4 text-xl">
        <p>Correct!</p> 
        </div>
          <button 
            onClick={onStartQuiz}
            className="bg-purple-700 text-white px-10 py-2 text-xl rounded mt-2"
          >
            Try Again
          </button>
        </div>
      )}
      {quizStatus === 'failure' && (
        <div className="text-center">
        <div className="bg-red-200 rounded border-green-500 text-red-700 p-4 mb-4 text-xl">
        <p>Incorrect!</p> 
        </div>
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