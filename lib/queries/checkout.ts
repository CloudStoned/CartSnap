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

/**
 * Retrieves the checkout history for the specified user, including all associated receipt items.
 */
export async function fetchReceiptsWithItems(userId: string) {
  // Fetch receipts
  const { data: receipts, error: receiptsError } = await supabase
    .from('receipts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (receiptsError) {
    console.error('Error fetching receipts:', receiptsError);
    return [];
  }

  if (!receipts || receipts.length === 0) return [];

  // Fetch receipt items for these receipts
  const receiptIds = receipts.map((r) => r.id);
  const { data: items, error: itemsError } = await supabase
    .from('receipt_items')
    .select('*')
    .in('receipt_id', receiptIds);

  if (itemsError) {
    console.error('Error fetching receipt items:', itemsError);
    return receipts.map((r) => ({ ...r, items: [] }));
  }

  // Map items to their respective receipts
  return receipts.map((r) => ({
    id: r.id,
    receiptRef: r.receipt_ref,
    totalAmount: Number(r.total_amount),
    discountAmount: Number(r.discount_amount),
    finalAmount: Number(r.final_amount),
    budgetLimit: Number(r.budget_limit),
    currency: r.currency,
    createdAt: r.created_at,
    items: (items || [])
      .filter((item) => item.receipt_id === r.id)
      .map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        price: Number(item.price),
        quantity: item.quantity,
        productImage: item.product_image || '',
        createdAt: item.created_at,
      })),
  }));
}
