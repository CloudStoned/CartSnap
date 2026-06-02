'use client';

import { useState } from 'react';
import { SoundType } from '../../store/types';

export function useGroceryScan(
  playSound: (type: SoundType) => void,
  addNotification: (text: string) => void
) {
  const [productPhoto, setProductPhoto] = useState<string | null>(null);
  const [scannedName, setScannedName] = useState<string>('');
  const [scannedPrice, setScannedPrice] = useState<string>('');
  const [scannedCategory, setScannedCategory] = useState<string>('Produce');
  const [cameraActive, setCameraActive] = useState<boolean>(false);

  const removePhoto = (type: 'product' | 'price') => {
    playSound('delete');
    if (type === 'product') {
      setProductPhoto(null);
    }
  };

  return {
    productPhoto,
    setProductPhoto,
    scannedName,
    setScannedName,
    scannedPrice,
    setScannedPrice,
    scannedCategory,
    setScannedCategory,
    cameraActive,
    setCameraActive,
    removePhoto
  };
}
