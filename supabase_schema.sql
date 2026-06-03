-- ====================================================================
-- SUPABASE / POSTGRESQL SCHEMA FOR CARTSNAP (FRESHTRACK)
-- ====================================================================
-- This schema sets up database tables, security rules, indexes, and
-- database views to support weekly, monthly, and yearly insights.
-- ====================================================================

-- --------------------------------------------------------------------
-- 0. User Settings Table (Active Preferences & Budget Limit)
-- --------------------------------------------------------------------
-- Stores each user's slider values and settings (e.g. daily limit, currency, sound).
CREATE TABLE IF NOT EXISTS public.user_settings (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    budget_limit NUMERIC(10, 2) NOT NULL DEFAULT 1000.00,
    currency VARCHAR(3) NOT NULL DEFAULT '₱',
    sound_enabled BOOLEAN NOT NULL DEFAULT true,
    custom_departments JSONB NOT NULL DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- --------------------------------------------------------------------
-- 1. Receipts / Checkouts Table
-- --------------------------------------------------------------------
-- Stores the high-level transaction data when checking out a basket.
CREATE TABLE IF NOT EXISTS public.receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    receipt_ref TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    discount_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    final_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    budget_limit NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(3) NOT NULL DEFAULT '₱',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- --------------------------------------------------------------------
-- 2. Receipt Items Table
-- --------------------------------------------------------------------
-- Stores the individual product details associated with each checkout.
CREATE TABLE IF NOT EXISTS public.receipt_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    receipt_id UUID NOT NULL REFERENCES public.receipts(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    product_image TEXT, -- Base64 or Unsplash Seed
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- --------------------------------------------------------------------
-- 2b. Cart Items Table (Active Shopping Cart)
-- --------------------------------------------------------------------
-- Stores items currently in the user's active/saved shopping basket.
CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0) DEFAULT 1,
    product_image TEXT, -- Base64 or Unsplash Seed
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- --------------------------------------------------------------------
-- 3. Optimization Indexes
-- --------------------------------------------------------------------
-- Speeds up queries involving date grouping, price ordering, and user joins.
CREATE INDEX IF NOT EXISTS idx_receipts_user_id ON public.receipts(user_id);
CREATE INDEX IF NOT EXISTS idx_receipts_created_at ON public.receipts(created_at);
CREATE INDEX IF NOT EXISTS idx_receipt_items_receipt_id ON public.receipt_items(receipt_id);
CREATE INDEX IF NOT EXISTS idx_receipt_items_created_at ON public.receipt_items(created_at);
CREATE INDEX IF NOT EXISTS idx_receipt_items_price ON public.receipt_items(price);
CREATE INDEX IF NOT EXISTS idx_receipt_items_category ON public.receipt_items(category);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON public.cart_items(user_id);

-- --------------------------------------------------------------------
-- 4. Row Level Security (RLS) Policies
-- --------------------------------------------------------------------
-- Secures the tables so users can only access their own grocery data.
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipt_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Receipts Policies
CREATE POLICY "Allow users to view their own receipts" 
ON public.receipts FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert their own receipts" 
ON public.receipts FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own receipts" 
ON public.receipts FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);

-- Receipt Items Policies (Cascades security via receipts join)
CREATE POLICY "Allow users to view their own receipt items" 
ON public.receipt_items FOR SELECT 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.receipts r 
        WHERE r.id = receipt_items.receipt_id AND r.user_id = auth.uid()
    )
);

CREATE POLICY "Allow users to insert their own receipt items" 
ON public.receipt_items FOR INSERT 
TO authenticated 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.receipts r 
        WHERE r.id = receipt_items.receipt_id AND r.user_id = auth.uid()
    )
);

CREATE POLICY "Allow users to delete their own receipt items" 
ON public.receipt_items FOR DELETE 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.receipts r 
        WHERE r.id = receipt_items.receipt_id AND r.user_id = auth.uid()
    )
);

-- Cart Items Policies (Allows user full CRUD on their own active basket/cart)
CREATE POLICY "Allow users to view their own cart items" 
ON public.cart_items FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert their own cart items" 
ON public.cart_items FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own cart items" 
ON public.cart_items FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own cart items" 
ON public.cart_items FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);

-- --------------------------------------------------------------------
-- User Settings Policies (Allows user full CRUD on their own settings/slider)
-- --------------------------------------------------------------------
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to view their own settings" 
ON public.user_settings FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert their own settings" 
ON public.user_settings FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own settings" 
ON public.user_settings FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own settings" 
ON public.user_settings FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);

-- --------------------------------------------------------------------
-- Trigger: Auto-Create User Settings on Auth User Signup
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_settings (user_id, budget_limit, currency, sound_enabled)
  VALUES (new.id, 1000.00, '₱', true);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


