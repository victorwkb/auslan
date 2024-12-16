export const drawLandmarks = (
  context: CanvasRenderingContext2D,
  landmarks: { x: number; y: number }[][],
  canvas: HTMLCanvasElement,
) => {
  // MediaPipe Hand Landmark Connections
  const HAND_CONNECTIONS = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4], // Thumb
    [0, 5],
    [5, 6],
    [6, 7],
    [7, 8], // Index finger
    [0, 9],
    [9, 10],
    [10, 11],
    [11, 12], // Middle finger
    [0, 13],
    [13, 14],
    [14, 15],
    [15, 16], // Ring finger
    [0, 17],
    [17, 18],
    [18, 19],
    [19, 20], // Pinky
  ];

  for (const handLandmarks of landmarks) {
    // Draw connection lines
    context.strokeStyle = "rgba(25, 25, 160, 0.6)";
    context.lineWidth = 3.5;
    context.beginPath();

    HAND_CONNECTIONS.forEach(([start, end]) => {
      const startPoint = handLandmarks[start];
      const endPoint = handLandmarks[end];

      context.moveTo(startPoint.x * canvas.width, startPoint.y * canvas.height);
      context.lineTo(endPoint.x * canvas.width, endPoint.y * canvas.height);
    });
    context.stroke();

    // Draw landmarks
    context.fillStyle = "rgba(0, 64, 160, 0.6)";

    for (const landmark of handLandmarks) {
      context.beginPath();
      context.arc(
        landmark.x * canvas.width,
        landmark.y * canvas.height,
        2,
        0,
        2 * Math.PI,
      );
      context.fill();
    }
  }
};

export const drawPrediction = (
  context: CanvasRenderingContext2D,
  prediction: string,
) => {
  context.fillStyle = "white";
  context.font = "20px Arial";
  context.globalAlpha = 1;
  context.fillText(`Predicted letter: ${prediction}`, 20, 40);
};

export const drawQuizScore = (
  context: CanvasRenderingContext2D,
  quizScore: number,
  canvas: HTMLCanvasElement,
) => {
  context.fillStyle = "black";
  context.globalAlpha = 0.65;

  context.fillRect(0, 0, canvas.width, canvas.height);

  context.globalAlpha = 1;
  context.fillStyle = "white";
  context.font = "20px Arial";
  context.fillText(`${quizScore} points`, canvas.width / 2.2, 40);
};
