/**
 * Utilitaires pour l'authentification admin
 */

export interface AdminUser {
  id: string
  email: string
  name: string | null
}

export interface AuthResponse {
  authenticated: boolean
  admin?: AdminUser
  error?: string
}

/**
 * Vérifier si l'admin est authentifié
 */
export async function verifyAuth(): Promise<AuthResponse> {
  try {
    const response = await fetch('/api/auth/verify', {
      method: 'GET',
      credentials: 'include',
    })

    if (!response.ok) {
      return { authenticated: false }
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Erreur lors de la vérification:', error)
    return { authenticated: false }
  }
}

/**
 * Connexion admin
 */
export async function login(email: string, password: string): Promise<{
  success: boolean
  admin?: AdminUser
  error?: string
}> {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      return { success: false, error: data.error || 'Erreur de connexion' }
    }

    return { success: true, admin: data.admin }
  } catch (error) {
    console.error('Erreur lors de la connexion:', error)
    return { success: false, error: 'Erreur réseau' }
  }
}

/**
 * Déconnexion admin
 */
export async function logout(): Promise<{ success: boolean }> {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    })

    if (!response.ok) {
      return { success: false }
    }

    return { success: true }
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
    return { success: false }
  }
}
