'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useWebcam } from '@/lib/hooks/useWebcam';
import { useMediaPipeModel } from '@/lib/hooks/useMediaPipeModel';
import { useTensorFlowModel } from '@/lib/hooks/useTensorFlowModel';
import { drawLandmarks, drawPrediction } from '@/lib/utils/drawing';
import { preprocessHandLandmarks, getPrediction } from '@/lib/utils/landmarkProcessing';
import { CAPTURE_INTERVAL } from '@/lib/constants/webcam.constants';

export const WebcamCapture = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [prediction, setPrediction] = useState<string>('');
  const { videoRef, stream, error: webcamError } = useWebcam();
  const { handLandmarker, error: mediaPipeError } = useMediaPipeModel();
  const { model, error: tensorFlowError } = useTensorFlowModel();

  const error = webcamError || mediaPipeError || tensorFlowError;
  const isLoading = !stream || !handLandmarker || !model;

  useEffect(() => {
    let captureInterval: NodeJS.Timer;

    const processFrame = async () => {
      if (!videoRef.current || !canvasRef.current || !handLandmarker ) {
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!context) return;

      // Setup canvas
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

      // Process frame
      const imageData = context.getImageData(0, 0, video.videoWidth, video.videoHeight);
      const results = await handLandmarker.detect(imageData);

      // Clear canvas and redraw video frame
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(video, 0, 0);

      if (results.worldLandmarks.length >= 1) {
        const landmarkTensor = preprocessHandLandmarks(results.worldLandmarks);
        console.log(landmarkTensor.print()); 
        const predictionResult = await getPrediction(model, landmarkTensor);
        setPrediction(predictionResult.letter);

        // Draw visual elements
        drawLandmarks(context, results.landmarks, canvas);
        drawPrediction(context, predictionResult.letter);
      }
    };

    if (!isLoading) {
      captureInterval = setInterval(processFrame, CAPTURE_INTERVAL);
    }

    return () => {
      clearInterval(captureInterval);
    };
  }, [isLoading, videoRef, handLandmarker]);


  return (
    <div className="relative w-full max-w-md mx-auto">
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted 
        className="w-full rounded-lg shadow-md"
      />
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full rounded-lg"
      />
    </div>
  );
};
