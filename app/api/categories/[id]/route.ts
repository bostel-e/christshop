import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// DELETE /api/categories/[id] - Supprimer une catégorie
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier que la catégorie existe
    const existingCategory = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    })

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Catégorie introuvable' },
        { status: 404 }
      )
    }

    // Vérifier s'il y a des produits dans cette catégorie
    if (existingCategory._count.products > 0) {
      return NextResponse.json(
        { 
          error: `Impossible de supprimer cette catégorie car elle contient ${existingCategory._count.products} produit(s)`,
          productCount: existingCategory._count.products 
        },
        { status: 409 }
      )
    }

    // Supprimer la catégorie
    await prisma.category.delete({
      where: { id: params.id },
    })

    return NextResponse.json(
      { message: 'Catégorie supprimée avec succès' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erreur DELETE /api/categories/[id]:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la catégorie' },
      { status: 500 }
    )
  }
}

// GET /api/categories/[id] - Récupérer une catégorie spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const category = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { products: true },
        },
        products: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Catégorie introuvable' },
        { status: 404 }
      )
    }

    const transformedCategory = {
      id: category.id,
      name: category.name,
      productCount: category._count.products,
      products: category.products,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    }

    return NextResponse.json(transformedCategory)
  } catch (error) {
    console.error('Erreur GET /api/categories/[id]:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la catégorie' },
      { status: 500 }
    )
  }
}
