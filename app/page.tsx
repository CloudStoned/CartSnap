'use client';

import { GroceryProvider } from '../store/GroceryStore';
import CartSnapApp from '../components/CartSnapApp';

export default function Page() {
  return (
    <GroceryProvider>
      <CartSnapApp />
    </GroceryProvider>
  );
}
