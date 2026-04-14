# Shreeyam Handicrafts AI Guide

## Site Overview

Shreeyam Handicrafts is an ecommerce site for Indian handicrafts including brass decor, wooden decor, lamps, antique-inspired products, devotional items, and giftable home pieces.

## Crawl Priorities

1. Homepage: `https://www.shreeyamhandicraft.com/`
2. Product listing: `https://www.shreeyamhandicraft.com/products`
3. Product detail pages: `https://www.shreeyamhandicraft.com/product/{id}`
4. Product sitemap: `https://www.shreeyamhandicraft.com/sitemap-products.xml`
5. Product catalog JSON: `https://www.shreeyamhandicraft.com/product-catalog.json`

## Product Data Available

Each product may include:

- `id`
- `title`
- `description`
- `category`
- `image`
- `price`
- `features`
- `sizeVariants`
- `url`

## Best Machine-Readable Sources

- `product-catalog.json` for structured catalog ingestion
- `sitemap-products.xml` for URL discovery
- Product page JSON-LD for product-specific metadata

## Crawling Guidance

- Product pages are intended to be indexed.
- Images are important for product understanding.
- Product names, descriptions, categories, and available size variants should be treated as primary product attributes.
- WhatsApp links are contact/order actions, not the primary canonical product URL.
