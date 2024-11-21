'use client';

import { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';

export const useTensorFlowModel = () => {
  const [model, setModel] = useState<tf.GraphModel | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadModel = async () => {
      try {
        const loadedModel = await tf.loadGraphModel('/models/model.json');
        if (mounted) {
          setModel(loadedModel);
        }
      } catch (err) {
        if (mounted) {
          setError(`Failed to load TensorFlow model: ${err.message}`);
        }
      }
    };

    loadModel();

    return () => {
      mounted = false;
      model?.dispose();
    };
  }, []);

  return { model, error };
};