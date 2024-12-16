"use client";

import React, { useRef, useEffect, useState } from "react";
import { useWebcam } from "@/lib/hooks/useWebcam";
import { useMediaPipeModel } from "@/lib/hooks/useMediaPipeModel";
import { useTensorFlowModel } from "@/lib/hooks/useTensorFlowModel";
import {
  drawLandmarks,
  drawPrediction,
  drawQuizScore,
} from "@/lib/utils/drawing";
import {
  preprocessHandLandmarks,
  getPrediction,
} from "@/lib/utils/landmarkProcessing";
import { CAPTURE_INTERVAL } from "@/lib/constants/webcam.constants";
import { QuizInterface } from "./QuizInterface";

const QUIZ_CONFIG = {
  TOTAL_FRAMES: 20, // Detection at 20fps
  SUCCESS_THRESHOLD: 0.7, // 80% of frames must match the target letter
};

export const WebcamCapture = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { videoRef } = useWebcam();
  const { handLandmarker } = useMediaPipeModel();
  const { model } = useTensorFlowModel();

  const [quizLetter, setQuizLetter] = useState<string | null>(null);
  const [quizScore, setquizScore] = useState(0);
  const [currentFrameCount, setCurrentFrameCount] = useState(0);
  const [correctFrameCount, setCorrectFrameCount] = useState(0);
  const [quizStatus, setQuizStatus] = useState<
    "idle" | "in-progress" | "success" | "failure"
  >("idle");

  const startNewQuiz = () => {
    // Generate a random letter (A-Z)
    const letter = String.fromCharCode(65 + Math.floor(Math.random() * 5));
    setQuizLetter(letter);
    setCurrentFrameCount(0);
    setCorrectFrameCount(0);
    setQuizStatus("in-progress");
  };

  const isLoading = !handLandmarker || !model;

  useEffect(() => {
    let captureInterval: ReturnType<typeof setInterval> | null = null;

    const processFrame = async () => {
      if (
        !videoRef.current ||
        !canvasRef.current ||
        !handLandmarker ||
        !model
      ) {
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (!context) return;

      // Setup canvas
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

      // Process frame
      const imageData = context.getImageData(
        0,
        0,
        video.videoWidth,
        video.videoHeight,
      );
      const results = handLandmarker.detect(imageData);

      // Clear canvas and redraw video frame
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(video, 0, 0);
      drawQuizScore(context, quizScore, canvas);

      if (results.worldLandmarks.length >= 1) {
        const landmarkTensor = preprocessHandLandmarks(results.worldLandmarks);
        const predictionResult = await getPrediction(model, landmarkTensor);

        // Draw visual elements
        drawLandmarks(context, results.landmarks, canvas);
        drawPrediction(context, predictionResult.letter);

        // Only process quiz logic if in progress
        if (quizStatus === "in-progress" && quizLetter) {
          // Check if predicted letter matches quiz letter
          if (predictionResult.letter === quizLetter) {
            setCorrectFrameCount(correctFrameCount + 1);
          }

          setCurrentFrameCount((currentFrameCount) => {
            // Check quiz completion
            if (currentFrameCount >= QUIZ_CONFIG.TOTAL_FRAMES) {
              if (
                correctFrameCount >=
                QUIZ_CONFIG.TOTAL_FRAMES * QUIZ_CONFIG.SUCCESS_THRESHOLD
              ) {
                setQuizStatus("success");
                setquizScore(quizScore + 1);
              } else {
                setQuizStatus("failure");
              }
            }

            return currentFrameCount + 1;
          });
        }
      }
    };

    if (!isLoading) {
      captureInterval = setInterval(processFrame, CAPTURE_INTERVAL);
    }

    return () => {
      if (captureInterval) {
        clearInterval(captureInterval);
      }
    };
  }, [
    isLoading,
    videoRef,
    handLandmarker,
    model,
    quizStatus,
    quizLetter,
    quizScore,
    currentFrameCount,
    correctFrameCount,
  ]);

  return (
    <div className="h-screen w-full relative flex justify-end">
      <QuizInterface
        quizStatus={quizStatus}
        quizLetter={quizLetter}
        correctCount={correctFrameCount}
        totalFrames={QUIZ_CONFIG.TOTAL_FRAMES}
        onStartQuiz={startNewQuiz}
      />

      <div className="relative h-full w-full flex justify-end aspect-video">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
        />
      </div>
    </div>
  );
};
