'use client';
import * as faceapi from 'face-api.js';
import { useEffect, useRef } from 'react';

const ExpressionDetector = ({ onExpressionDetected }: { onExpressionDetected: (expression: string) => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const startVideo = async () => {
      try {
        // Load face-api models
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await faceapi.nets.faceExpressionNet.loadFromUri('/models');

        // Start video stream
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error starting video or loading models:', error);
      }
    };

    if (!videoRef.current?.srcObject) {
      startVideo();
    }

    const detectExpression = async () => {
      if (videoRef.current) {
        const detections = await faceapi
          .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceExpressions();

        if (detections) {
          const expressions = detections.expressions;
          const dominantExpression = Object.keys(expressions).reduce((a, b) => {
            return expressions[a as keyof typeof expressions] > expressions[b as keyof typeof expressions] ? a : b;
          });
          onExpressionDetected(dominantExpression);
        }
      }
    };

    const interval = setInterval(detectExpression, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [onExpressionDetected]);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      style={{ width: '100%', borderRadius: '8px', marginBottom: '15px', height: 300 }}
    />
  );
};

export default ExpressionDetector;
