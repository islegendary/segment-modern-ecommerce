export function formatMoney(value) {
  return `$${Number(value).toFixed(2)}`;
}

export function cartTotal(cart) {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function getPriceDisplay(product) {
  if (product.isCustom) {
    return 'TBD';
  }

  if (product.hasSizes && product.sizes) {
    const prices = product.sizes.map((size) => size.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    return minPrice === maxPrice
      ? formatMoney(minPrice)
      : `${formatMoney(minPrice)} - ${formatMoney(maxPrice)}`;
  }

  return formatMoney(product.price);
}
