import { supabase } from '@/lib/supabase/client';
import { GroceryItem } from '@/store/types';
import { clearCart } from './cart';

/**
 * Commits a checkout transaction by creating a receipt record, inserting
 * all receipt items, and clearing the user's active cart.
 */
export async function createCheckout(
  userId: string,
  checkoutData: {
    receiptRef: string;
    totalAmount: number;
    discountAmount: number;
    finalAmount: number;
    budgetLimit: number;
    currency: string;
    items: GroceryItem[];
  }
) {
  // 1. Insert transaction into receipts
  const { data: receipt, error: receiptError } = await supabase
    .from('receipts')
    .insert({
      receipt_ref: checkoutData.receiptRef,
      user_id: userId,
      total_amount: checkoutData.totalAmount,
      discount_amount: checkoutData.discountAmount,
      final_amount: checkoutData.finalAmount,
      budget_limit: checkoutData.budgetLimit,
      currency: checkoutData.currency,
    })
    .select()
    .single();

  if (receiptError) {
    console.error('Error creating receipt:', receiptError);
    throw receiptError;
  }

  // 2. Insert items associated with this checkout
  const receiptItems = checkoutData.items.map((item) => ({
    receipt_id: receipt.id,
    name: item.name,
    category: item.category,
    price: item.price,
    quantity: item.quantity,
    product_image: item.productImage,
  }));

  const { error: itemsError } = await supabase
    .from('receipt_items')
    .insert(receiptItems);

  if (itemsError) {
    console.error('Error creating receipt items:', itemsError);
    throw itemsError;
  }

  // 3. Clear active cart in DB
  await clearCart(userId);

  return receipt;
}
