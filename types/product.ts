export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  categoryId?: string
  inStock: boolean
  createdAt?: Date | string
  updatedAt?: Date | string
}
