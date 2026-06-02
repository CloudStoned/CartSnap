export interface ReceiptItem {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  productImage: string;
  createdAt: string;
}

export interface Receipt {
  id: string;
  receiptRef: string;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  budgetLimit: number;
  currency: string;
  createdAt: string;
  items: ReceiptItem[];
}

export interface DaySpending {
  dateString: string;
  dayOfWeek: string;
  dayOfMonth: number;
  totalSpent: number;
  items: ReceiptItem[];
}
