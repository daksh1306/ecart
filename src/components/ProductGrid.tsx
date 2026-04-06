import type { Product } from '../types/product'
import ProductCard from './ProductCard'
import './ProductGrid.css'

type ProductGridProps = {
  products: Product[]
  loading: boolean
  error: string | null
  onViewDetails: (product: Product) => void
  onAddToCart: (product: Product) => void
}

export default function ProductGrid({
  products,
  loading,
  error,
  onViewDetails,
  onAddToCart,
}: ProductGridProps) {
  if (loading) {
    return (
      <div className="product-grid product-grid--state" role="status">
        <p>Loading products…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="product-grid product-grid--state product-grid--error" role="alert">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="product-grid">
      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          onViewDetails={onViewDetails}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  )
}
