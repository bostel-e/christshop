import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// POST /api/auth/logout - Déconnexion admin
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value

    if (token) {
      // Supprimer la session de la base de données
      await prisma.adminSession.deleteMany({
        where: { token },
      })
    }

    // Créer la réponse
    const response = NextResponse.json({
      success: true,
      message: 'Déconnexion réussie',
    })

    // Supprimer le cookie
    response.cookies.delete('admin_token')

    return response
  } catch (error) {
    console.error('Erreur POST /api/auth/logout:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la déconnexion' },
      { status: 500 }
    )
  }
}
