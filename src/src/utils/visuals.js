export const vegetableImages = {
  market: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1800&q=85',
  mixed: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=1200&q=85',
  leafy: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=900&q=85',
  tomatoes: 'https://images.unsplash.com/photo-1561136594-7f68413baa99?auto=format&fit=crop&w=900&q=85',
  carrots: 'https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=900&q=85',
  peppers: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=900&q=85',
  broccoli: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=900&q=85',
};

export function getProductImage(product = {}) {
  if (product.imageUrl) return product.imageUrl;
  const name = `${product.name || ''} ${product.category?.name || ''}`.toLowerCase();
  if (name.includes('tomato')) return vegetableImages.tomatoes;
  if (name.includes('carrot')) return vegetableImages.carrots;
  if (name.includes('pepper') || name.includes('capsicum')) return vegetableImages.peppers;
  if (name.includes('broccoli')) return vegetableImages.broccoli;
  if (name.includes('leaf') || name.includes('spinach') || name.includes('lettuce')) return vegetableImages.leafy;
  return vegetableImages.mixed;
}
