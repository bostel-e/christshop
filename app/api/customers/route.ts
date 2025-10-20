import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

const CustomerSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  phone: z.string()
    .min(10, "Le numéro de téléphone doit contenir au moins 10 chiffres")
    .regex(/^[0-9+\s-]+$/, "Format de numéro de téléphone invalide"),
})

// GET /api/customers - Récupérer tous les clients
export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: {
        registeredAt: 'desc',
      },
    })

    return NextResponse.json(customers)
  } catch (error) {
    console.error('Erreur GET /api/customers:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des clients' },
      { status: 500 }
    )
  }
}

// POST /api/customers - Créer/Inscrire un nouveau client
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = CustomerSchema.parse(body)

    // Nettoyer le numéro de téléphone (enlever espaces et tirets)
    const cleanPhone = validatedData.phone.replace(/[\s-]/g, '')

    // Vérifier si le client existe déjà
    const existingCustomer = await prisma.customer.findUnique({
      where: { phone: cleanPhone },
    })

    if (existingCustomer) {
      // Mettre à jour les informations si le client existe
      const updatedCustomer = await prisma.customer.update({
        where: { phone: cleanPhone },
        data: {
          name: validatedData.name,
        },
      })

      return NextResponse.json({
        ...updatedCustomer,
        message: 'Client déjà inscrit, informations mises à jour',
      })
    }

    // Créer un nouveau client
    const customer = await prisma.customer.create({
      data: {
        name: validatedData.name,
        phone: cleanPhone,
      },
    })

    return NextResponse.json(customer, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Erreur POST /api/customers:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'inscription du client' },
      { status: 500 }
    )
  }
}
