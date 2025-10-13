import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

const CategorySchema = z.object({
  name: z.string().min(1, "Le nom de la catégorie est requis"),
})

// GET /api/categories - Récupérer toutes les catégories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })

    // Transformer pour inclure le nombre de produits
    const transformedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      productCount: category._count.products,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    }))

    return NextResponse.json(transformedCategories)
  } catch (error) {
    console.error('Erreur GET /api/categories:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des catégories' },
      { status: 500 }
    )
  }
}

// POST /api/categories - Créer une nouvelle catégorie
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = CategorySchema.parse(body)

    // Vérifier si la catégorie existe déjà
    const existingCategory = await prisma.category.findUnique({
      where: { name: validatedData.name },
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Une catégorie avec ce nom existe déjà' },
        { status: 409 }
      )
    }

    // Créer la catégorie
    const category = await prisma.category.create({
      data: {
        name: validatedData.name,
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
    })

    const transformedCategory = {
      id: category.id,
      name: category.name,
      productCount: category._count.products,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    }

    return NextResponse.json(transformedCategory, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Erreur POST /api/categories:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la catégorie' },
      { status: 500 }
    )
  }
}
