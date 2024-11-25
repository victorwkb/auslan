'use client';

import { useState, useEffect } from 'react';
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

export const useMediaPipeModel = () => {
  const [handLandmarker, setHandLandmarker] = useState<HandLandmarker | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const initializeModel = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        );

        const model = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: '/models/hand_landmarker.task'
          },
          numHands: 2,
          minHandDetectionConfidence: 0.35,
          minHandPresenceConfidence: 0.35
        });

        if (mounted) {
          setHandLandmarker(model);
        }
      } catch (err) {
        if (mounted) {
          setError(`Failed to load MediaPipe model: ${err.message}`);
        }
      }
    };

    initializeModel();

    return () => {
      mounted = false;
    };
  }, []);

  return { handLandmarker, error };
};
