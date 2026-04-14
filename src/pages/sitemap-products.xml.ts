import { supabase } from '../db/supabase';

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const siteBase = 'https://www.shreeyamhandicraft.com';

  const { data: products, error } = await supabase
    .from('products')
    .select('id, updated_at')
    .order('title', { ascending: true });

  if (error) {
    return new Response('Unable to generate sitemap', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8'
      }
    });
  }

  const urls = (products || []).map((product: any) => {
    const loc = `${siteBase}/product/${product.id}`;
    const lastmod = product.updated_at ? `<lastmod>${new Date(product.updated_at).toISOString()}</lastmod>` : '';

    return `<url><loc>${escapeXml(loc)}</loc>${lastmod}<changefreq>weekly</changefreq><priority>0.9</priority></url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300'
    }
  });
}
