import type { Product } from '@/types/product'

// --- INTERFACES ---

interface ProductFilters {
  search?: string
  categoryId?: string
  inStock?: boolean
}

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
      // On force le filtre à true, sauf si on demande explicitement false
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
export async function createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'category'>): Promise<Product> {
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

// ============= CATÉGORIES =============

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

// --- FONCTION MANQUANTE AJOUTÉE ---
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

// --- FONCTION MANQUANTE AJOUTÉE ---
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

// --- FONCTION MANQUANTE AJOUTÉE ---
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

// --- FONCTION MANQUANTE AJOUTÉE ---
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