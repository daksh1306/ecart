import type { Product } from '../types/product'
import { formatMoney, unitPrice } from '../utils/price'
import './ProductCard.css'

type ProductCardProps = {
  product: Product
  onViewDetails: (product: Product) => void
  onAddToCart: (product: Product) => void
}

export default function ProductCard({
  product,
  onViewDetails,
  onAddToCart,
}: ProductCardProps) {
  const sale = unitPrice(product)
  const hasDiscount = (product.discountPercentage ?? 0) > 0

  return (
    <article className="product-card">
      <button
        type="button"
        className="product-card__media"
        onClick={() => onViewDetails(product)}
        aria-label={`View ${product.title}`}
      >
        <img
          src={product.thumbnail}
          alt=""
          loading="lazy"
          width={280}
          height={280}
        />
      </button>
      <div className="product-card__body">
        <h2 className="product-card__title">
          <button
            type="button"
            className="product-card__title-btn"
            onClick={() => onViewDetails(product)}
          >
            {product.title}
          </button>
        </h2>
        <div className="product-card__meta">
          <span className="product-card__category">{product.category}</span>
          {product.stock != null && (
            <span className="product-card__stock">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          )}
        </div>
        <div className="product-card__price-row">
          {hasDiscount && (
            <span className="product-card__list">{formatMoney(product.price)}</span>
          )}
          <span className="product-card__sale">{formatMoney(sale)}</span>
        </div>
        <div className="product-card__actions">
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => onViewDetails(product)}
          >
            Details
          </button>
          <button
            type="button"
            className="btn btn--primary"
            disabled={!product.stock}
            onClick={() => onAddToCart(product)}
          >
            Add to cart
          </button>
        </div>
      </div>
    </article>
  )
}
