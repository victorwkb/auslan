import * as tf from '@tensorflow/tfjs';
import { HandLandmark, DetectionResults, PredictionResult } from '@/lib/types/webcam.types';
import { ALPHABET, CONFIDENCE_THRESHOLD } from '@/lib/constants/webcam.constants';

export const preprocessHandLandmarks = (handWorldLandmarks: HandLandmark[][]): tf.Tensor => {
  if (handWorldLandmarks.length < 1) {
    return tf.tensor([], [0, 0, 0], 'float32');
  }

  const coordinates: number[][] = handWorldLandmarks.flatMap(handLandmarks =>
    handLandmarks.map(landmark => [landmark.x, landmark.y, landmark.z])
  );

  if (handWorldLandmarks.length === 1) {
    coordinates.push(...Array(21).fill([-1, -1, -1]));
  }

  return tf.tensor(coordinates)
    .reshape([2, 21, 3])
    .transpose([1, 2, 0])
    .expandDims();
};

export const getPrediction = async (
  model: tf.GraphModel,
  landmarkTensor: tf.Tensor
): Promise<PredictionResult> => {
  const prediction = model.predict(landmarkTensor) as tf.Tensor;
  const probabilities = tf.softmax(prediction, 1);
  const maxProbability = probabilities.max().dataSync()[0];
  const maxIndex = probabilities.argMax(1).dataSync()[0];

  return {
    letter: maxProbability >= CONFIDENCE_THRESHOLD ? ALPHABET[maxIndex] : 'None detected',
    confidence: maxProbability
  };
};