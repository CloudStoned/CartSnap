'use client';

import { useRef } from 'react';
import { SoundType } from '../store/types';

interface UseCameraProps {
  cameraPurpose: 'product' | 'price' | null;
  setCameraActive: (active: boolean) => void;
  setCameraPurpose: (purpose: 'product' | 'price' | null) => void;
  productPhoto: string | null;
  setProductPhoto: (photo: string | null) => void;
  pricePhoto: string | null;
  setPricePhoto: (photo: string | null) => void;
  triggerImageAnalysis: (prodImg: string, priceImg: string, fallbackName?: string, fallbackPrice?: string) => Promise<void>;
  playSound: (type: SoundType) => void;
}

export function useCamera({
  cameraPurpose,
  setCameraActive,
  setCameraPurpose,
  productPhoto,
  setProductPhoto,
  pricePhoto,
  setPricePhoto,
  triggerImageAnalysis,
  playSound
}: UseCameraProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const startCamera = async (purpose: 'product' | 'price') => {
    playSound('click');
    setCameraActive(true);
    setCameraPurpose(purpose);
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
      alert("Camera access failed in this frame. Please select a Preloaded Preset item or upload a local file to test.");
      setCameraActive(false);
      setCameraPurpose(null);
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
        
        if (cameraPurpose === 'product') {
          setProductPhoto(dataUrl);
          if (pricePhoto) {
            triggerImageAnalysis(dataUrl, pricePhoto);
          } else {
            triggerImageAnalysis(dataUrl, '');
          }
        } else {
          setPricePhoto(dataUrl);
          if (productPhoto) {
            triggerImageAnalysis(productPhoto, dataUrl);
          } else {
            triggerImageAnalysis('', dataUrl);
          }
        }
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
    setCameraPurpose(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, purpose: 'product' | 'price') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      playSound('beep');
      if (purpose === 'product') {
        setProductPhoto(result);
        if (pricePhoto) {
          triggerImageAnalysis(result, pricePhoto);
        } else {
          triggerImageAnalysis(result, '');
        }
      } else {
        setPricePhoto(result);
        if (productPhoto) {
          triggerImageAnalysis(productPhoto, result);
        } else {
          triggerImageAnalysis('', result);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  return {
    videoRef,
    canvasRef,
    startCamera,
    capturePhoto,
    stopCamera,
    handleFileUpload
  };
}
