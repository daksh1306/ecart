/** Unit price after discount (DummyJSON provides list price + discount %). */
export function unitPrice(product) {
  const pct = product.discountPercentage ?? 0
  const raw = product.price * (1 - pct / 100)
  return Math.round(raw * 100) / 100
}

export function formatMoney(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}
