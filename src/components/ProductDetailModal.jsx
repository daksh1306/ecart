import { useEffect, useState } from 'react'
import { formatMoney, unitPrice } from '../utils/price'
import './ProductDetailModal.css'

const API = 'https://dummyjson.com/products'

export default function ProductDetailModal({
  productId,
  previewProduct,
  onClose,
  onAddToCart,
}) {
  const [detail, setDetail] = useState(previewProduct ?? null)
  const [loading, setLoading] = useState(Boolean(productId))
  const [err, setErr] = useState(null)

  useEffect(() => {
    if (!productId) return undefined
    let cancelled = false
    setLoading(true)
    setErr(null)
    fetch(`${API}/${productId}`)
      .then((r) => {
        if (!r.ok) throw new Error('Could not load product')
        return r.json()
      })
      .then((data) => {
        if (!cancelled) setDetail(data)
      })
      .catch((e) => {
        if (!cancelled) setErr(e.message ?? 'Failed to load')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [productId])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!productId && !previewProduct) return null

  const p = detail
  const sale = p ? unitPrice(p) : null
  const hasDiscount = p && (p.discountPercentage ?? 0) > 0
  const mainImage =
    p?.images?.[0] ?? p?.thumbnail ?? previewProduct?.thumbnail

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
              {p.images?.length > 1 && (
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
                {hasDiscount && (
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
                  <strong>Rating</strong> {p.rating} / 5
                </li>
                <li>
                  <strong>Stock</strong>{' '}
                  {p.stock > 0 ? `${p.stock} available` : 'Out of stock'}
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
