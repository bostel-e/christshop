import type { Product } from '@/types/product'

interface ProductFilters {
  search?: string
  categoryId?: string
  inStock?: boolean
}

interface Category {
  id: string
  name: string
}

// Récupérer tous les produits avec filtres optionnels
export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
  try {
    const params = new URLSearchParams()
    
    // Ajouter les paramètres seulement s'ils existent et ne sont pas vides
    if (filters?.search && filters.search.trim() !== '') {
      params.append('search', filters.search.trim())
    }
    
    if (filters?.categoryId) {
      params.append('categoryId', filters.categoryId)
    }
    
    if (filters?.inStock !== undefined) {
      params.append('inStock', String(filters.inStock))
    }

    const queryString = params.toString()
    const url = `/api/products${queryString ? `?${queryString}` : ''}`
    
    console.log('📡 Appel API:', url)
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Important pour avoir des données fraîches
    })

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`)
    }

    const data = await response.json()
    
    console.log('✅ Données reçues:', data.length, 'produits')
    
    return data
  } catch (error) {
    console.error('❌ Erreur getProducts:', error)
    throw error
  }
}

// Récupérer un produit par ID
export async function getProduct(id: string): Promise<Product> {
  try {
    const response = await fetch(`/api/products/${id}`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error('❌ Erreur getProduct:', error)
    throw error
  }
}

// Créer un nouveau produit
export async function createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
  try {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Erreur lors de la création')
    }

    return response.json()
  } catch (error) {
    console.error('❌ Erreur createProduct:', error)
    throw error
  }
}

// Mettre à jour un produit
export async function updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
  try {
    const response = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Erreur lors de la mise à jour')
    }

    return response.json()
  } catch (error) {
    console.error('❌ Erreur updateProduct:', error)
    throw error
  }
}

// Supprimer un produit
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
    console.error('❌ Erreur deleteProduct:', error)
    throw error
  }
}

// Récupérer toutes les catégories
export async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch('/api/categories', {
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error('❌ Erreur getCategories:', error)
    throw error
  }
}

// Créer une nouvelle catégorie
export async function createCategory(name: string): Promise<Category> {
  try {
    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Erreur lors de la création')
    }

    return response.json()
  } catch (error) {
    console.error('❌ Erreur createCategory:', error)
    throw error
  }
}