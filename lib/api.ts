/**
 * Utilitaires pour les appels API
 */

import type { Product } from '@/types/product'

export interface Category {
  id: string
  name: string
  productCount?: number
  createdAt?: string
  updatedAt?: string
}

export interface Customer {
  id: string
  name: string
  phone: string
  registeredAt: string
  updatedAt: string
}

// ============= PRODUITS =============

export async function getProducts(filters?: {
  categoryId?: string
  search?: string
  inStock?: boolean
}): Promise<Product[]> {
  try {
    const params = new URLSearchParams()
    if (filters?.categoryId) params.append('categoryId', filters.categoryId)
    if (filters?.search) params.append('search', filters.search)
    if (filters?.inStock !== undefined) params.append('inStock', String(filters.inStock))

    const response = await fetch(`/api/products?${params.toString()}`)
    if (!response.ok) throw new Error('Erreur lors du chargement des produits')
    
    return await response.json()
  } catch (error) {
    console.error('Erreur getProducts:', error)
    throw error
  }
}

export async function getProduct(id: string): Promise<Product> {
  try {
    const response = await fetch(`/api/products/${id}`)
    if (!response.ok) throw new Error('Produit introuvable')
    
    return await response.json()
  } catch (error) {
    console.error('Erreur getProduct:', error)
    throw error
  }
}

export async function createProduct(data: {
  name: string
  description: string
  price: number
  image?: string
  inStock: boolean
  categoryId: string
}): Promise<Product> {
  try {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Erreur lors de la création')
    }

    return await response.json()
  } catch (error) {
    console.error('Erreur createProduct:', error)
    throw error
  }
}

export async function updateProduct(id: string, data: Partial<{
  name: string
  description: string
  price: number
  image: string
  inStock: boolean
  categoryId: string
}>): Promise<Product> {
  try {
    const response = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Erreur lors de la mise à jour')
    }

    return await response.json()
  } catch (error) {
    console.error('Erreur updateProduct:', error)
    throw error
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Erreur lors de la suppression')
    }
  } catch (error) {
    console.error('Erreur deleteProduct:', error)
    throw error
  }
}

// ============= CATÉGORIES =============

export async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch('/api/categories')
    if (!response.ok) throw new Error('Erreur lors du chargement des catégories')
    
    return await response.json()
  } catch (error) {
    console.error('Erreur getCategories:', error)
    throw error
  }
}

export async function createCategory(name: string): Promise<Category> {
  try {
    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Erreur lors de la création')
    }

    return await response.json()
  } catch (error) {
    console.error('Erreur createCategory:', error)
    throw error
  }
}

export async function deleteCategory(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/categories/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Erreur lors de la suppression')
    }
  } catch (error) {
    console.error('Erreur deleteCategory:', error)
    throw error
  }
}

// ============= CLIENTS =============

export async function getCustomers(): Promise<Customer[]> {
  try {
    const response = await fetch('/api/customers')
    if (!response.ok) throw new Error('Erreur lors du chargement des clients')
    
    return await response.json()
  } catch (error) {
    console.error('Erreur getCustomers:', error)
    throw error
  }
}

export async function createCustomer(data: {
  name: string
  phone: string
}): Promise<Customer> {
  try {
    const response = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Erreur lors de l\'inscription')
    }

    return await response.json()
  } catch (error) {
    console.error('Erreur createCustomer:', error)
    throw error
  }
}

export async function deleteCustomer(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/customers/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Erreur lors de la suppression')
    }
  } catch (error) {
    console.error('Erreur deleteCustomer:', error)
    throw error
  }
}
