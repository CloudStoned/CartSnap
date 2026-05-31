'use client';

import { useState } from 'react';
import { SoundType } from '../store/types';

export function useGroceryScan(
  playSound: (type: SoundType) => void,
  addNotification: (text: string) => void
) {
  const [productPhoto, setProductPhoto] = useState<string | null>(null);
  const [pricePhoto, setPricePhoto] = useState<string | null>(null);
  const [scannedName, setScannedName] = useState<string>('');
  const [scannedPrice, setScannedPrice] = useState<string>('');
  const [scannedCategory, setScannedCategory] = useState<string>('Produce');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraPurpose, setCameraPurpose] = useState<'product' | 'price' | null>(null);

  const triggerImageAnalysis = async (
    prodImg: string, 
    priceImg: string, 
    fallbackName: string = '', 
    fallbackPrice: string = ''
  ) => {
    setIsProcessing(true);
    setScannedName('');
    setScannedPrice('');

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productImage: prodImg.startsWith('http') ? null : prodImg,
          priceImage: priceImg.startsWith('http') ? null : priceImg,
          productNameClue: fallbackName,
          priceClue: fallbackPrice,
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        console.warn("Scan API warning:", data.error);
      }

      setScannedName(data.productName || fallbackName || '');
      setScannedPrice(data.price?.toString() || fallbackPrice || '');
      setScannedCategory(data.category || 'Other');
      
      addNotification(`Scanned "${data.productName || fallbackName || 'Item'}" successfully via ${data.extractedVia === 'gemini' ? 'Gemini AI Vision' : 'Smart Scan Engine'}.`);
      playSound('success');
    } catch (err) {
      console.error(err);
      setScannedName(fallbackName || '');
      setScannedPrice(fallbackPrice || '');
      setScannedCategory('Other');
    } finally {
      setIsProcessing(false);
    }
  };

  const removePhoto = (type: 'product' | 'price') => {
    playSound('delete');
    if (type === 'product') {
      setProductPhoto(null);
    } else {
      setPricePhoto(null);
    }
  };

  return {
    productPhoto,
    setProductPhoto,
    pricePhoto,
    setPricePhoto,
    scannedName,
    setScannedName,
    scannedPrice,
    setScannedPrice,
    scannedCategory,
    setScannedCategory,
    isProcessing,
    setIsProcessing,
    cameraActive,
    setCameraActive,
    cameraPurpose,
    setCameraPurpose,
    triggerImageAnalysis,
    removePhoto
  };
}
