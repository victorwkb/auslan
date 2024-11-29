'use client';

import { useState, useEffect, useRef } from 'react';
import { WebcamStream, WEBCAM_CONFIG } from '@/lib/types/webcam.types';

export const useWebcam = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [WCerror, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let stream: MediaStream | null = null;

    const initializeWebcam = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia(WEBCAM_CONFIG);
        
        if (mounted && videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (err) {
        if (mounted) {
          setError(`Failed to access webcam: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
      }
    };

    initializeWebcam();

    return () => {
      mounted = false;
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  return { videoRef, WCerror };
};