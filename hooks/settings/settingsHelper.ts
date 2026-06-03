export const DEFAULT_CATEGORIES = ["Produce", "Dairy", "Bakery", "Pantry", "Meat", "Other"];

/**
 * Validates whether a category name is unique (not in defaults or custom categories).
 */
export function isUniqueCategory(newCat: string, customCategories: string[]): boolean {
  const trimmed = newCat.trim();
  if (!trimmed) return false;
  
  const lowerDefault = DEFAULT_CATEGORIES.map(c => c.toLowerCase());
  const lowerCustom = customCategories.map(c => c.toLowerCase());
  
  return !lowerDefault.includes(trimmed.toLowerCase()) && !lowerCustom.includes(trimmed.toLowerCase());
}

/**
 * Merges default categories and custom categories, ensuring "Other" is always at the end.
 */
export function mergeCategories(customCategories: string[]): string[] {
  return [
    ...DEFAULT_CATEGORIES.filter(c => c !== 'Other'),
    ...customCategories,
    'Other'
  ];
}
