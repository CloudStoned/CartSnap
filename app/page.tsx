'use client';

import { GroceryProvider } from '../store/GroceryStore';
import FreshTrackApp from '../components/FreshTrackApp';

export default function Page() {
  return (
    <GroceryProvider>
      <FreshTrackApp />
    </GroceryProvider>
  );
}
