import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { CartLine, Product } from '../types/product'
import { unitPrice } from '../utils/price'

export interface CartContextValue {
  items: CartLine[]
  addToCart: (product: Product, qty?: number) => void
  setLineQuantity: (productId: number, quantity: string | number) => void
  increment: (productId: number, delta: number) => void
  removeLine: (productId: number) => void
  clearCart: () => void
  itemCount: number
  subtotal: number
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([])

  const addToCart = useCallback((product: Product, qty = 1) => {
    const price = unitPrice(product)
    const max = product.stock ?? 999
    const add = Math.max(1, Math.min(qty, max))

    setItems((prev) => {
      const i = prev.findIndex((l) => l.id === product.id)
      if (i === -1) {
        return [
          ...prev,
          {
            id: product.id,
            title: product.title,
            thumbnail: product.thumbnail,
            unitPrice: price,
            listPrice: product.price,
            quantity: add,
            maxStock: max,
          },
        ]
      }
      const next = [...prev]
      const nextQty = Math.min(next[i].quantity + add, max)
      next[i] = { ...next[i], quantity: nextQty }
      return next
    })
  }, [])

  const setLineQuantity = useCallback(
    (productId: number, quantity: string | number) => {
      const n = Number(quantity)
      if (!Number.isFinite(n)) return
      const q = Math.max(0, Math.floor(n))
      setItems((prev) => {
        const line = prev.find((l) => l.id === productId)
        if (!line) return prev
        const cap = Math.min(q, line.maxStock)
        if (cap <= 0) return prev.filter((l) => l.id !== productId)
        return prev.map((l) =>
          l.id === productId ? { ...l, quantity: cap } : l,
        )
      })
    },
    [],
  )

  const increment = useCallback((productId: number, delta: number) => {
    setItems((prev) => {
      const line = prev.find((l) => l.id === productId)
      if (!line) return prev
      const nextQty = line.quantity + delta
      if (nextQty <= 0) return prev.filter((l) => l.id !== productId)
      const cap = Math.min(nextQty, line.maxStock)
      return prev.map((l) =>
        l.id === productId ? { ...l, quantity: cap } : l,
      )
    })
  }, [])

  const removeLine = useCallback((productId: number) => {
    setItems((prev) => prev.filter((l) => l.id !== productId))
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((s, l) => s + l.quantity, 0)
    const subtotalRaw = items.reduce(
      (s, l) => s + l.unitPrice * l.quantity,
      0,
    )
    const subtotal = Math.round(subtotalRaw * 100) / 100
    return {
      items,
      addToCart,
      setLineQuantity,
      increment,
      removeLine,
      clearCart,
      itemCount,
      subtotal,
    }
  }, [
    items,
    addToCart,
    setLineQuantity,
    increment,
    removeLine,
    clearCart,
  ])

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  )
}

// Fast refresh: hook is the public API for this context module.
// eslint-disable-next-line react-refresh/only-export-components -- useCart pairs with CartProvider
export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
