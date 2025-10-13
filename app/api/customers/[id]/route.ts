import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// DELETE /api/customers/[id] - Supprimer un client
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier que le client existe
    const existingCustomer = await prisma.customer.findUnique({
      where: { id: params.id },
    })

    if (!existingCustomer) {
      return NextResponse.json(
        { error: 'Client introuvable' },
        { status: 404 }
      )
    }

    // Supprimer le client
    await prisma.customer.delete({
      where: { id: params.id },
    })

    return NextResponse.json(
      { message: 'Client supprimé avec succès' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erreur DELETE /api/customers/[id]:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du client' },
      { status: 500 }
    )
  }
}

// GET /api/customers/[id] - Récupérer un client spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: params.id },
    })

    if (!customer) {
      return NextResponse.json(
        { error: 'Client introuvable' },
        { status: 404 }
      )
    }

    return NextResponse.json(customer)
  } catch (error) {
    console.error('Erreur GET /api/customers/[id]:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du client' },
      { status: 500 }
    )
  }
}
