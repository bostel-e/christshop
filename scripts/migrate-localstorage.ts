import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Script pour migrer les données du localStorage vers PostgreSQL
 * 
 * IMPORTANT: Avant d'exécuter ce script:
 * 1. Ouvrez votre application dans le navigateur
 * 2. Ouvrez la console développeur (F12)
 * 3. Exécutez ces commandes pour extraire vos données:
 * 
 * console.log('PRODUCTS:', localStorage.getItem('christshop_products'))
 * console.log('CATEGORIES:', localStorage.getItem('christshop_categories'))
 * console.log('CUSTOMERS:', localStorage.getItem('christshop_customers'))
 * 
 * 4. Copiez les résultats et remplacez les données ci-dessous
 */

// ⚠️ REMPLACEZ CES DONNÉES PAR VOS VRAIES DONNÉES DU LOCALSTORAGE
const localStorageData = {
  products: [
    {
      id: "1",
      name: "Montre Élégante",
      description: "Montre de luxe avec bracelet en cuir véritable",
      price: 15000,
      image: "/elegant-luxury-women-watch.jpg",
      category: "Montres",
      inStock: true,
    },
    // Ajoutez vos autres produits ici
  ],
  
  categories: [
    { id: "1", name: "Accessoires" },
    { id: "2", name: "Sacs" },
    { id: "3", name: "Montres" },
    // Ajoutez vos autres catégories ici
  ],
  
  customers: [
    {
      id: "1",
      name: "Client Test",
      phone: "237670123456",
      registeredAt: new Date().toISOString(),
    },
    // Ajoutez vos autres clients ici
  ],
}

async function migrateData() {
  console.log('🚀 Début de la migration des données...\n')

  try {
    // 1. Migrer les catégories
    console.log('📁 Migration des catégories...')
    const categoryMap = new Map()
    
    for (const cat of localStorageData.categories) {
      const category = await prisma.category.upsert({
        where: { name: cat.name },
        update: {},
        create: { name: cat.name },
      })
      categoryMap.set(cat.name, category.id)
      console.log(`   ✓ ${cat.name}`)
    }
    console.log(`✅ ${localStorageData.categories.length} catégories migrées\n`)

    // 2. Migrer les produits
    console.log('📦 Migration des produits...')
    let productsCount = 0
    
    for (const prod of localStorageData.products) {
      const categoryId = categoryMap.get(prod.category)
      
      if (!categoryId) {
        console.warn(`   ⚠️  Catégorie "${prod.category}" introuvable pour "${prod.name}"`)
        continue
      }

      await prisma.product.create({
        data: {
          name: prod.name,
          description: prod.description,
          price: prod.price,
          image: prod.image,
          inStock: prod.inStock,
          categoryId: categoryId,
        },
      })
      productsCount++
      console.log(`   ✓ ${prod.name}`)
    }
    console.log(`✅ ${productsCount} produits migrés\n`)

    // 3. Migrer les clients
    console.log('👥 Migration des clients...')
    let customersCount = 0
    
    for (const cust of localStorageData.customers) {
      // Nettoyer le numéro de téléphone
      const cleanPhone = cust.phone.replace(/[\s-]/g, '')
      
      const existing = await prisma.customer.findUnique({
        where: { phone: cleanPhone },
      })

      if (existing) {
        console.log(`   ⚠️  Client avec le numéro ${cleanPhone} existe déjà`)
        continue
      }

      await prisma.customer.create({
        data: {
          name: cust.name,
          phone: cleanPhone,
          registeredAt: new Date(cust.registeredAt),
        },
      })
      customersCount++
      console.log(`   ✓ ${cust.name}`)
    }
    console.log(`✅ ${customersCount} clients migrés\n`)

    console.log('🎉 Migration terminée avec succès!')
    console.log('\n📊 Résumé:')
    console.log(`   • Catégories: ${localStorageData.categories.length}`)
    console.log(`   • Produits: ${productsCount}`)
    console.log(`   • Clients: ${customersCount}`)
    console.log('\n💡 Vous pouvez maintenant supprimer les données du localStorage')
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Exécuter la migration
migrateData()
  .then(() => {
    console.log('\n✨ Migration réussie!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Échec de la migration:', error)
    process.exit(1)
  })
