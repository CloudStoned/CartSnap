'use client';

import { useState, useRef, useEffect } from 'react';

interface UseSlidingReceiptItemParams {
  itemId: string;
  onRemove: (itemId: string) => Promise<void>;
  deleteBtnWidth?: number;
}

export function useSlidingReceiptItem({
  itemId,
  onRemove,
  deleteBtnWidth = 70,
}: UseSlidingReceiptItemParams) {
  const [startX, setStartX] = useState<number | null>(null);
  const [currentX, setCurrentX] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isSlidOpen, setIsSlidOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Touch and mouse handlers for swipe/drag to slide
  const handleDragStart = (clientX: number) => {
    setStartX(clientX - currentX);
    setIsDragging(true);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging || startX === null) return;
    let newX = clientX - startX;
    
    // Only allow sliding to the left (negative X)
    if (newX > 10) newX = 10; // slight bounce to the right
    if (newX < -deleteBtnWidth - 20) {
      // Add friction as we pull past the delete button
      const overflow = newX + deleteBtnWidth + 20;
      newX = -deleteBtnWidth - 20 + overflow * 0.2;
    }
    setCurrentX(newX);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setStartX(null);

    // Snap to open or closed based on threshold
    if (currentX < -deleteBtnWidth / 2) {
      setCurrentX(-deleteBtnWidth);
      setIsSlidOpen(true);
    } else {
      setCurrentX(0);
      setIsSlidOpen(false);
    }
  };

  const handleRemove = async () => {
    setIsDeleting(true);
    try {
      await onRemove(itemId);
    } catch (err) {
      console.error(err);
      setIsDeleting(false);
      // Snap back if failed
      setCurrentX(0);
      setIsSlidOpen(false);
    }
  };

  // Close sliding state when mouse clicks elsewhere
  useEffect(() => {
    if (!isSlidOpen) return;
    const handleDocumentClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setCurrentX(0);
        setIsSlidOpen(false);
      }
    };
    document.addEventListener('mousedown', handleDocumentClick);
    return () => document.removeEventListener('mousedown', handleDocumentClick);
  }, [isSlidOpen]);

  return {
    currentX,
    isDragging,
    isSlidOpen,
    isDeleting,
    containerRef,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    handleRemove,
  };
}
