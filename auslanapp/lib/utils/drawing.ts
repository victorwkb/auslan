export const drawLandmarks = (
    context: CanvasRenderingContext2D,
    landmarks: { x: number; y: number }[][],
    canvas: HTMLCanvasElement
  ) => {
    for (const handLandmarks of landmarks) {
      for (const landmark of handLandmarks) {
        context.beginPath();
        context.arc(
          landmark.x * canvas.width,
          landmark.y * canvas.height,
          5,
          0,
          2 * Math.PI
        );
        context.fillStyle = 'black';
        context.fill();
      }
    }
  };
  
  export const drawPrediction = (
    context: CanvasRenderingContext2D,
    prediction: string
  ) => {
    context.fillStyle = 'blue';
    context.font = '34px Arial';
    context.fillText(`Predicted letter: ${prediction}`, 10, 30);
  };