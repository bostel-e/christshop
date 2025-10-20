import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

// Schéma de validation pour un produit
const ProductSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().min(1, "La description est requise"),
  price: z.number().positive("Le prix doit être positif"),
  image: z.string().url("L'image doit être une URL valide").optional(),
  inStock: z.boolean().default(true),
  categoryId: z.string().min(1, "La catégorie est requise"),
})

// GET /api/products - Récupérer tous les produits
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')
    const search = searchParams.get('search')
    const inStock = searchParams.get('inStock')

    console.log('🔍 API - Paramètres reçus:', { categoryId, search, inStock })

    // Construction dynamique du where
    const where: any = {}

    // Filtre par catégorie
    if (categoryId) {
      where.categoryId = categoryId
    }

    // Filtre par recherche (CORRIGÉ - recherche dans nom, description ET catégorie)
    if (search && search.trim() !== '') {
      where.OR = [
        { 
          name: { 
            contains: search.trim(), 
            mode: 'insensitive' 
          } 
        },
        { 
          description: { 
            contains: search.trim(), 
            mode: 'insensitive' 
          } 
        },
        {
          category: {
            name: {
              contains: search.trim(),
              mode: 'insensitive'
            }
          }
        }
      ]
    }

    // Filtre par disponibilité
    if (inStock !== null && inStock !== undefined) {
      where.inStock = inStock === 'true'
    }

    console.log('🗄️ API - Where clause:', JSON.stringify(where, null, 2))

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    console.log(`✅ API - Produits trouvés: ${products.length}`)

    // Transformer les données pour correspondre au format frontend
    const transformedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image || '/placeholder.svg',
      category: product.category.name,
      categoryId: product.categoryId,
      inStock: product.inStock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }))

    return NextResponse.json(transformedProducts)
  } catch (error) {
    console.error('❌ Erreur GET /api/products:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des produits' },
      { status: 500 }
    )
  }
}

// POST /api/products - Créer un nouveau produit
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validation des données
    const validatedData = ProductSchema.parse(body)

    // Vérifier que la catégorie existe
    const category = await prisma.category.findUnique({
      where: { id: validatedData.categoryId },
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Catégorie introuvable' },
        { status: 404 }
      )
    }

    // Créer le produit
    const product = await prisma.product.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        price: validatedData.price,
        image: validatedData.image,
        inStock: validatedData.inStock,
        categoryId: validatedData.categoryId,
      },
      include: {
        category: true,
      },
    })

    // Transformer pour le frontend
    const transformedProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image || '/placeholder.svg',
      category: product.category.name,
      categoryId: product.categoryId,
      inStock: product.inStock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }

    return NextResponse.json(transformedProduct, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Erreur POST /api/products:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du produit' },
      { status: 500 }
    )
  }
}