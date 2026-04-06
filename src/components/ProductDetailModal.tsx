import { useEffect, useState } from 'react'
import type { Product } from '../types/product'
import { formatMoney, unitPrice } from '../utils/price'
import './ProductDetailModal.css'

const API = 'https://dummyjson.com/products'

type ProductDetailModalProps = {
  productId: number
  previewProduct: Product | null
  onClose: () => void
  onAddToCart: (product: Product) => void
}

export default function ProductDetailModal({
  productId,
  previewProduct,
  onClose,
  onAddToCart,
}: ProductDetailModalProps) {
  const [detail, setDetail] = useState<Product | null>(previewProduct ?? null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    if (!productId) return undefined
    let cancelled = false
    fetch(`${API}/${productId}`)
      .then((r) => {
        if (!r.ok) throw new Error('Could not load product')
        return r.json() as Promise<Product>
      })
      .then((data) => {
        if (!cancelled) setDetail(data)
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setErr(e instanceof Error ? e.message : 'Failed to load')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [productId])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!productId && !previewProduct) return null

  const p = detail
  const sale = p ? unitPrice(p) : 0
  const hasDiscount = Boolean(p && (p.discountPercentage ?? 0) > 0)
  const mainImage =
    p?.images?.[0] ?? p?.thumbnail ?? previewProduct?.thumbnail ?? ''

  return (
    <div
      className="modal-root"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-detail-title"
    >
      <button
        type="button"
        className="modal-backdrop"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="modal-panel">
        <button type="button" className="modal-close" onClick={onClose}>
          ×
        </button>
        {loading && !p && <p className="modal-loading">Loading…</p>}
        {err && <p className="modal-error">{err}</p>}
        {p && (
          <div className="modal-content">
            <div className="modal-gallery">
              <img src={mainImage} alt="" className="modal-gallery__main" />
              {p.images && p.images.length > 1 && (
                <div className="modal-thumbs">
                  {p.images.map((src) => (
                    <img key={src} src={src} alt="" loading="lazy" />
                  ))}
                </div>
              )}
            </div>
            <div className="modal-info">
              <p className="modal-info__brand">{p.brand || p.category}</p>
              <h2 id="product-detail-title" className="modal-info__title">
                {p.title}
              </h2>
              <div className="modal-info__price">
                {hasDiscount && (
                  <span className="modal-info__list">{formatMoney(p.price)}</span>
                )}
                <span className="modal-info__sale">{formatMoney(sale)}</span>
                {hasDiscount && p.discountPercentage != null && (
                  <span className="modal-info__pct">
                    −{Math.round(p.discountPercentage)}%
                  </span>
                )}
              </div>
              <p className="modal-info__desc">{p.description}</p>
              <ul className="modal-info__facts">
                <li>
                  <strong>Category</strong> {p.category}
                </li>
                <li>
                  <strong>Rating</strong> {p.rating ?? '—'} / 5
                </li>
                <li>
                  <strong>Stock</strong>{' '}
                  {(p.stock ?? 0) > 0 ? `${p.stock} available` : 'Out of stock'}
                </li>
                {p.sku && (
                  <li>
                    <strong>SKU</strong> {p.sku}
                  </li>
                )}
              </ul>
              <div className="modal-info__actions">
                <button
                  type="button"
                  className="btn btn--primary modal-add"
                  disabled={!p.stock}
                  onClick={() => onAddToCart(p)}
                >
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
