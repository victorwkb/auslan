'use client';

import { useState, useEffect, useRef } from 'react';
import { WebcamStream, WEBCAM_CONFIG } from '@/lib/types/webcam.types';

export const useWebcam = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [webcamState, setWebcamState] = useState<WebcamStream>({
    stream: null,
    error: null
  });

  useEffect(() => {
    let mounted = true;

    const initializeWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(WEBCAM_CONFIG);
        
        if (mounted) {
          setWebcamState({ stream, error: null });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            await videoRef.current.play();
          }
        }
      } catch (error) {
        if (mounted) {
          setWebcamState({ stream: null, error: `Failed to access webcam: ${error.message}` });
        }
      }
    };

    initializeWebcam();

    return () => {
      mounted = false;
      webcamState.stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  return { videoRef, ...webcamState };
};