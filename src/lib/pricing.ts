// --- src/lib/pricing.ts ---
// Shared card-level pricing for product cards (landing grid, shop page, related products).
//
// Non-size products behave exactly as before: product-level price / discount fields.
// Size products derive the card price from their size_variants instead:
//   - displayPrice  → lowest effective price among in-stock sizes
//                    (discount_price when set, else price)
//   - originalPrice → crossed-out MRP of that cheapest size (when it has a discount)
//   - discountBadge → "UP TO X% OFF" (largest % across in-stock sizes) or "X% OFF" for a single size
// If a size product has no in-stock sizes (or no variants), fall back to product-level fields.

type RawVariant = {
  price?: number | string;
  original_price?: number | string;
  discount_price?: number | string;
  in_stock?: boolean;
};

type RawProduct = {
  price?: number | string;
  original_price?: number | string;
  on_discount?: boolean;
  discount_price?: number | string;
  discount_percent?: number | string;
  has_sizes?: boolean;
  size_variants?: RawVariant[];
};

const rupees = (value: number) => `₹${value}`;

export function getCardPricing(p: RawProduct): {
  displayPrice: string;
  originalPrice: string | null;
  discountBadge: string | null;
} {
  // Product-level (non-size) pricing — unchanged legacy behaviour
  const baseDisplay =
    p.on_discount && Number(p.discount_price) > 0
      ? rupees(Number(p.discount_price))
      : rupees(Number(p.price) || 0);
  const baseOriginal = Number(p.original_price) > 0 ? rupees(Number(p.original_price)) : null;
  const baseBadge =
    p.on_discount && Number(p.discount_percent) > 0
      ? `${Math.round(Number(p.discount_percent))}% OFF`
      : null;

  // No sizes (or nothing to derive from) → legacy product-level pricing
  if (!p.has_sizes || !Array.isArray(p.size_variants) || p.size_variants.length === 0) {
    return { displayPrice: baseDisplay, originalPrice: baseOriginal, discountBadge: baseBadge };
  }

  const variants = p.size_variants.map((v) => {
    const price = Number(v.price) || 0;
    const original = Number(v.original_price) || 0;
    const discount = Number(v.discount_price) || 0;
    const effective = discount > 0 ? discount : price;
    const percent =
      original > 0 && effective > 0 && original > effective
        ? Math.round(((original - effective) / original) * 100)
        : 0;
    return { original, effective, percent, inStock: v.in_stock !== false };
  });

  // Only in-stock sizes are purchasable — derive the card price from those
  const available = variants.filter((v) => v.inStock);
  if (available.length === 0) {
    return { displayPrice: baseDisplay, originalPrice: baseOriginal, discountBadge: baseBadge };
  }

  const cheapest = available.reduce((a, b) => (b.effective < a.effective ? b : a));
  const maxPercent = Math.max(...available.map((v) => v.percent));

  return {
    displayPrice: rupees(cheapest.effective),
    originalPrice:
      cheapest.original > 0 && cheapest.original > cheapest.effective
        ? rupees(cheapest.original)
        : null,
    discountBadge:
      maxPercent > 0
        ? available.length > 1
          ? `UP TO ${maxPercent}% OFF`
          : `${maxPercent}% OFF`
        : null,
  };
}
