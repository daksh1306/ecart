import { formatMoney } from '../utils/price'
import './CartDrawer.css'

export default function CartDrawer({
  open,
  onClose,
  items,
  itemCount,
  subtotal,
  increment,
  setLineQuantity,
  removeLine,
  clearCart,
}) {
  if (!open) return null

  return (
    <div className="cart-drawer-root">
      <button
        type="button"
        className="cart-drawer-backdrop"
        aria-label="Close cart"
        onClick={onClose}
      />
      <aside
        className="cart-drawer"
        aria-label="Shopping cart"
      >
        <div className="cart-drawer__head">
          <h2 className="cart-drawer__title">Your cart</h2>
          <button type="button" className="cart-drawer__close" onClick={onClose}>
            ×
          </button>
        </div>
        {items.length === 0 ? (
          <p className="cart-drawer__empty">Your cart is empty.</p>
        ) : (
          <>
            <ul className="cart-lines">
              {items.map((line) => {
                const lineTotal = Math.round(line.unitPrice * line.quantity * 100) / 100
                return (
                  <li key={line.id} className="cart-line">
                    <img
                      src={line.thumbnail}
                      alt=""
                      className="cart-line__thumb"
                      width={64}
                      height={64}
                    />
                    <div className="cart-line__main">
                      <p className="cart-line__title">{line.title}</p>
                      <p className="cart-line__unit">
                        {formatMoney(line.unitPrice)} each
                      </p>
                      <div className="cart-line__qty">
                        <button
                          type="button"
                          className="cart-line__step"
                          aria-label="Decrease quantity"
                          onClick={() => increment(line.id, -1)}
                        >
                          −
                        </button>
                        <input
                          className="cart-line__input"
                          type="number"
                          min={1}
                          max={line.maxStock}
                          value={line.quantity}
                          onChange={(e) =>
                            setLineQuantity(line.id, e.target.value)
                          }
                          aria-label={`Quantity for ${line.title}`}
                        />
                        <button
                          type="button"
                          className="cart-line__step"
                          aria-label="Increase quantity"
                          onClick={() => increment(line.id, 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="cart-line__right">
                      <p className="cart-line__line-total">
                        {formatMoney(lineTotal)}
                      </p>
                      <button
                        type="button"
                        className="cart-line__remove"
                        onClick={() => removeLine(line.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
            <div className="cart-drawer__footer">
              <div className="cart-drawer__row">
                <span>Items</span>
                <span>{itemCount}</span>
              </div>
              <div className="cart-drawer__row cart-drawer__row--strong">
                <span>Subtotal</span>
                <span>{formatMoney(subtotal)}</span>
              </div>
              <div className="cart-drawer__actions">
                <button
                  type="button"
                  className="btn btn--ghost cart-footer-btn"
                  onClick={clearCart}
                >
                  Clear cart
                </button>
                <button
                  type="button"
                  className="btn btn--primary cart-footer-btn"
                  onClick={onClose}
                >
                  Continue shopping
                </button>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
