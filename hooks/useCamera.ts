'use client';

import { useRef } from 'react';
import { SoundType } from '../store/types';

interface UseCameraProps {
  setCameraActive: (active: boolean) => void;
  setProductPhoto: (photo: string | null) => void;
  playSound: (type: SoundType) => void;
}

export function useCamera({
  setCameraActive,
  setProductPhoto,
  playSound
}: UseCameraProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const startCamera = async () => {
    playSound('click');
    setCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Camera access failed:", err);
      alert("Camera access failed. Please ensure camera permissions are granted.");
      setCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        playSound('beep');
        setProductPhoto(dataUrl);
      }
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  return {
    videoRef,
    canvasRef,
    startCamera,
    capturePhoto,
    stopCamera
  };
}
