import { supabase } from '../db/supabase';

export async function GET() {
  const siteBase = 'https://www.shreeyamhandicraft.com';

  const { data: products, error } = await supabase
    .from('products')
    .select('id, title, description, image_url, price, has_sizes, size_variants, features, categories(name)')
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
    hasSizes: Boolean(product.has_sizes),
    sizeVariants: product.size_variants || [],
    features: product.features || [],
    url: `${siteBase}/product/${product.id}`
  }));

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=300'
    }
  });
}
