import { useCallback, useEffect, useState } from 'react'
import { CartProvider, useCart } from './context/CartContext'
import Header from './components/Header'
import ProductGrid from './components/ProductGrid'
import ProductDetailModal from './components/ProductDetailModal'
import CartDrawer from './components/CartDrawer'
import type { Product, ProductListResponse } from './types/product'
import './App.css'

const PRODUCTS_URL = 'https://dummyjson.com/products'

function Shop() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [detailId, setDetailId] = useState<number | null>(null)
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null)
  const [cartOpen, setCartOpen] = useState(false)

  const {
    addToCart,
    items,
    itemCount,
    subtotal,
    increment,
    setLineQuantity,
    removeLine,
    clearCart,
  } = useCart()

  useEffect(() => {
    let cancelled = false
    fetch(PRODUCTS_URL)
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load products')
        return r.json() as Promise<ProductListResponse>
      })
      .then((data) => {
        if (!cancelled) setProducts(data.products ?? [])
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Something went wrong')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const openDetails = useCallback((product: Product) => {
    setPreviewProduct(product)
    setDetailId(product.id)
  }, [])

  const closeDetails = useCallback(() => {
    setDetailId(null)
    setPreviewProduct(null)
  }, [])

  const handleAdd = useCallback(
    (product: Product) => {
      addToCart(product, 1)
    },
    [addToCart],
  )

  const handleAddFromModal = useCallback(
    (product: Product) => {
      addToCart(product, 1)
    },
    [addToCart],
  )

  return (
    <div className="shop-app">
      <Header onOpenCart={() => setCartOpen(true)} itemCount={itemCount} />
      <ProductGrid
        products={products}
        loading={loading}
        error={error}
        onViewDetails={openDetails}
        onAddToCart={handleAdd}
      />
      {detailId != null && (
        <ProductDetailModal
          key={detailId}
          productId={detailId}
          previewProduct={previewProduct}
          onClose={closeDetails}
          onAddToCart={handleAddFromModal}
        />
      )}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={items}
        itemCount={itemCount}
        subtotal={subtotal}
        increment={increment}
        setLineQuantity={setLineQuantity}
        removeLine={removeLine}
        clearCart={clearCart}
      />
    </div>
  )
}

export default function App() {
  return (
    <CartProvider>
      <Shop />
    </CartProvider>
  )
}
