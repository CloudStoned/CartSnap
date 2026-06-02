import { supabase } from '@/lib/supabase/client';
import { GroceryItem } from '@/store/types';

/**
 * Fetches all items in the user's active shopping cart.
 */
export async function fetchCartItems(userId: string): Promise<GroceryItem[]> {
  const { data, error } = await supabase
    .from('cart_items')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching cart items:', error);
    return [];
  }

  return (data || []).map((dbItem) => ({
    id: dbItem.id,
    name: dbItem.name,
    category: dbItem.category,
    price: Number(dbItem.price),
    quantity: dbItem.quantity,
    productImage: dbItem.product_image || '',
    priceImage: '',
  }));
}

/**
 * Inserts a new item into the user's active cart.
 */
export async function addCartItem(userId: string, item: Omit<GroceryItem, 'id'>) {
  const { data, error } = await supabase
    .from('cart_items')
    .insert({
      user_id: userId,
      name: item.name,
      category: item.category,
      price: item.price,
      quantity: item.quantity,
      product_image: item.productImage,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding cart item:', error);
    throw error;
  }
  return data;
}

/**
 * Updates the quantity of a specific item in the user's cart.
 */
export async function updateCartItemQuantity(userId: string, itemId: string, quantity: number) {
  const { data, error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', itemId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating cart item quantity:', error);
    throw error;
  }
  return data;
}

/**
 * Deletes a specific item from the user's cart.
 */
export async function deleteCartItem(userId: string, itemId: string) {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', itemId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting cart item:', error);
    throw error;
  }
}

/**
 * Clears the user's active cart.
 */
export async function clearCart(userId: string) {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', userId);

  if (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
}
