import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Début du seed de la base de données...')

  // 1. Créer un compte admin
  console.log('👤 Création du compte admin...')
  const adminPasswordHash = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@christshop.com' },
    update: {},
    create: {
      email: 'admin@christshop.com',
      passwordHash: adminPasswordHash,
      name: 'Administrateur',
    },
  })
  console.log('✅ Admin créé:', admin.email)

  // 2. Créer des catégories
  console.log('📁 Création des catégories...')
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Montres' },
      update: {},
      create: { name: 'Montres' },
    }),
    prisma.category.upsert({
      where: { name: 'Sacs' },
      update: {},
      create: { name: 'Sacs' },
    }),
    prisma.category.upsert({
      where: { name: 'Accessoires' },
      update: {},
      create: { name: 'Accessoires' },
    }),
    prisma.category.upsert({
      where: { name: 'Bijoux' },
      update: {},
      create: { name: 'Bijoux' },
    }),
  ])
  console.log(`✅ ${categories.length} catégories créées`)

  // 3. Créer des produits de démonstration
  console.log('🛍️ Création des produits de démonstration...')
  
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Montre Élégante',
        description: 'Montre de luxe avec bracelet en cuir véritable',
        price: 15000,
        image: '/elegant-luxury-women-watch.jpg',
        inStock: true,
        categoryId: categories.find(c => c.name === 'Montres')!.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Sac à Main Premium',
        description: 'Sac à main en cuir de haute qualité',
        price: 25000,
        image: '/premium-leather-handbag-women.jpg',
        inStock: true,
        categoryId: categories.find(c => c.name === 'Sacs')!.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Lunettes de Soleil',
        description: 'Lunettes de soleil design avec protection UV',
        price: 8000,
        image: '/designer-sunglasses-women.jpg',
        inStock: true,
        categoryId: categories.find(c => c.name === 'Accessoires')!.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Portefeuille Cuir',
        description: 'Portefeuille compact en cuir véritable',
        price: 5000,
        image: '/leather-wallet-women.jpg',
        inStock: true,
        categoryId: categories.find(c => c.name === 'Accessoires')!.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Bracelet Or Rose',
        description: 'Bracelet élégant en or rose 18 carats',
        price: 35000,
        image: '/rose-gold-bracelet.jpg',
        inStock: true,
        categoryId: categories.find(c => c.name === 'Bijoux')!.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Collier Perles',
        description: 'Collier raffiné avec perles de culture',
        price: 20000,
        image: '/pearl-necklace.jpg',
        inStock: true,
        categoryId: categories.find(c => c.name === 'Bijoux')!.id,
      },
    }),
  ])
  console.log(`✅ ${products.length} produits créés`)

  // 4. Créer quelques clients de test
  console.log('👥 Création des clients de test...')
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: 'Marie Dupont',
        phone: '237670123456',
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Sophie Martin',
        phone: '237680234567',
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Claire Bernard',
        phone: '237690345678',
      },
    }),
  ])
  console.log(`✅ ${customers.length} clients créés`)

  console.log('🎉 Seed terminé avec succès!')
  console.log('\n📋 Informations de connexion admin:')
  console.log('   Email: admin@christshop.com')
  console.log('   Mot de passe: admin123')
  console.log('\n⚠️  Changez le mot de passe admin en production!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Erreur lors du seed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
