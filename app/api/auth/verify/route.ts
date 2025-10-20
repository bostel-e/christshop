import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { jwtVerify } from 'jose'

const prisma = new PrismaClient()

// GET /api/auth/verify - Vérifier le token admin
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Vérifier le token JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    
    try {
      const { payload } = await jwtVerify(token, secret)

      // Vérifier si la session existe et n'est pas expirée
      const session = await prisma.adminSession.findUnique({
        where: { token },
        include: { admin: true },
      })

      if (!session || session.expiresAt < new Date()) {
        // Session expirée
        if (session) {
          await prisma.adminSession.delete({ where: { token } })
        }

        return NextResponse.json(
          { error: 'Session expirée' },
          { status: 401 }
        )
      }

      // Récupérer l'admin
      const admin = await prisma.admin.findUnique({
        where: { id: payload.adminId as string },
      })

      if (!admin) {
        return NextResponse.json(
          { error: 'Admin introuvable' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        authenticated: true,
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
        },
      })
    } catch (jwtError) {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Erreur GET /api/auth/verify:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la vérification' },
      { status: 500 }
    )
  }
}
