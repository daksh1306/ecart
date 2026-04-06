/** Fields used from DummyJSON product payloads (list + single). */
export interface Product {
  id: number
  title: string
  description: string
  category: string
  price: number
  discountPercentage?: number
  rating?: number
  stock?: number
  brand?: string
  sku?: string
  images?: string[]
  thumbnail: string
}

export interface ProductListResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

export interface CartLine {
  id: number
  title: string
  thumbnail: string
  unitPrice: number
  listPrice: number
  quantity: number
  maxStock: number
}
