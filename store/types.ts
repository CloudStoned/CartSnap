export interface GroceryItem {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  productImage: string; // Base64 or Unsplash Seed
  priceImage: string;   // Base64 or Price tag marker
}

export type TabType = 'home' | 'scan' | 'insights' | 'calendar' | 'account';
export type SoundType = 'beep' | 'success' | 'delete' | 'click';

export interface GroceryContextType {
  // Navigation
  activeTab: TabType;
  switchTab: (tab: TabType) => void;
  
  // App Config
  currency: '₱' | '$';
  setCurrency: (currency: '₱' | '$') => void;
  budget: number;
  setBudget: (budget: number) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  playSound: (type: SoundType) => void;
  
  // Basket State
  basket: GroceryItem[];
  receiptRef: string;
  totalItemCount: number;
  totalAmount: number;
  dynamicDiscount: number;
  finalAmount: number;
  isOverBudget: boolean;
  
  // Scanner Form State
  productPhoto: string | null;
  setProductPhoto: (photo: string | null) => void;
  scannedName: string;
  setScannedName: (name: string) => void;
  scannedPrice: string;
  setScannedPrice: (price: string) => void;
  scannedCategory: string;
  setScannedCategory: (category: string) => void;
  
  // Camera State
  cameraActive: boolean;
  setCameraActive: (active: boolean) => void;
  
  // Checkout & confirmations
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  showOrderDone: boolean;
  setShowOrderDone: (done: boolean) => void;
  
  // Notifications
  notifications: string[];
  showNotificationBadge: boolean;
  setShowNotificationBadge: (show: boolean) => void;
  showNotificationsList: boolean;
  setShowNotificationsList: (show: boolean) => void;
  addNotification: (text: string) => void;
  clearNotifications: () => void;
  
  // Camera Refs & Actions
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  startCamera: () => Promise<void>;
  capturePhoto: () => void;
  stopCamera: () => void;
  
  // Actions
  handleAddToBasket: () => void;
  removePhoto: (type: 'product' | 'price') => void;
  updateQuantity: (id: string, delta: number) => void;
  deleteItem: (id: string, name: string) => void;
  handleConfirmCheckout: () => void;
  clearBasket: () => void;
}

