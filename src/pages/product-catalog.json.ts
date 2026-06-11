import { supabase } from '../db/supabase';

export async function GET() {
  const siteBase = 'https://www.shreeyamhandicraft.com';

  const { data: products, error } = await supabase
    .from('products')
    .select('id, title, description, image_url, price, original_price, in_stock, has_sizes, size_variants, features, on_discount, discount_price, discount_percent, delivery_charges_apply, categories(name)')
    .order('title', { ascending: true });

  if (error) {
    return new Response(JSON.stringify({ error: 'Unable to load product catalog' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=300'
      }
    });
  }

  const payload = (products || []).map((product: any) => ({
    id: product.id,
    title: product.title,
    description: product.description,
    category: product.categories?.name || 'Handicraft',
    image: product.image_url,
    price: product.price,
    originalPrice: product.original_price || null,
    inStock: product.in_stock !== false,
    hasSizes: Boolean(product.has_sizes),
    sizeVariants: product.size_variants || [],
    features: product.features || [],
    onDiscount: Boolean(product.on_discount),
    discountPrice: Number(product.discount_price) || 0,
    discountPercent: Number(product.discount_percent) || 0,
    deliveryChargesApply: Boolean(product.delivery_charges_apply),
    url: `${siteBase}/product/${product.id}`
  }));

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=300'
    }
  });
}
