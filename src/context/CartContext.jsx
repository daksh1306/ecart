import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { unitPrice } from '../utils/price'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  const addToCart = useCallback((product, qty = 1) => {
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

  const setLineQuantity = useCallback((productId, quantity) => {
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
  }, [])

  const increment = useCallback((productId, delta) => {
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

  const removeLine = useCallback((productId) => {
    setItems((prev) => prev.filter((l) => l.id !== productId))
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const totals = useMemo(() => {
    const itemCount = items.reduce((s, l) => s + l.quantity, 0)
    const subtotal = items.reduce((s, l) => s + l.unitPrice * l.quantity, 0)
    return {
      itemCount,
      subtotal: Math.round(subtotal * 100) / 100,
    }
  }, [items])

  const value = useMemo(
    () => ({
      items,
      addToCart,
      setLineQuantity,
      increment,
      removeLine,
      clearCart,
      ...totals,
    }),
    [
      items,
      addToCart,
      setLineQuantity,
      increment,
      removeLine,
      clearCart,
      totals.itemCount,
      totals.subtotal,
    ],
  )

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
