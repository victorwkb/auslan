export interface HandLandmark {
    x: number;
    y: number;
    z: number;
  }
  
  export interface DetectionResults {
    worldLandmarks: HandLandmark[][];
    landmarks: { x: number; y: number }[][];
  }
  
  export interface PredictionResult {
    letter: string;
    confidence: number;
  }
  
  export interface WebcamStream {
    stream: MediaStream | null;
    error: string | null;
  }

  export const WEBCAM_CONFIG = {
    video: {
      width: { ideal: 1280 },
      height: { ideal: 720 },
      facingMode: 'user'
    }
  } as const;