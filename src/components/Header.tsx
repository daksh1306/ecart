import './Header.css'

type HeaderProps = {
  onOpenCart: () => void
  itemCount: number
}

export default function Header({ onOpenCart, itemCount }: HeaderProps) {
  return (
    <header className="shop-header">
      <div className="shop-header__inner">
        <h1 className="shop-header__title">Shop</h1>
        <p className="shop-header__tagline">Products from DummyJSON</p>
      </div>
      <button
        type="button"
        className="shop-header__cart-btn"
        onClick={onOpenCart}
        aria-label={`Open cart, ${itemCount} items`}
      >
        <span className="shop-header__cart-label">Cart</span>
        {itemCount > 0 && (
          <span className="shop-header__badge">{itemCount}</span>
        )}
      </button>
    </header>
  )
}
