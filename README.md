# 🛍️ ChristShop - E-commerce Premium avec PostgreSQL

![ChristShop](https://img.shields.io/badge/version-2.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-316192)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748)

Une application e-commerce moderne avec interface client élégante et panneau admin complet, intégration WhatsApp native, et base de données PostgreSQL.

## ✨ Fonctionnalités

### 🛒 Interface Client
- 🎨 Design ultra-premium avec animations fluides
- 🔍 Recherche et filtrage en temps réel
- 🛍️ Panier intelligent avec gestion des quantités
- 📱 Commande directe via WhatsApp
- 🔔 Inscription aux notifications de nouveaux produits
- 🌓 Mode sombre sophistiqué
- 📱 100% Responsive

### ⚙️ Panneau Admin
- 🔐 Authentification sécurisée avec JWT
- 📦 CRUD complet des produits
- 📁 Gestion dynamique des catégories
- 👥 Liste des clients inscrits
- 📲 Envoi de notifications WhatsApp (groupé ou individuel)
- 📊 Statistiques en temps réel
- 🖼️ Upload d'images (URL ou base64)

### 🗄️ Backend
- 🐘 PostgreSQL comme base de données
- 🔒 Authentification JWT sécurisée
- ✅ Validation avec Zod
- 🔑 Hash des mots de passe avec bcrypt
- 🚀 API RESTful complète
- 📝 ORM Prisma pour la gestion de la BDD

## 🚀 Installation Rapide

### Prérequis
- Node.js 18+ 
- npm ou yarn
- Une base de données PostgreSQL (Vercel Postgres, Supabase, ou Neon)

### 1. Cloner le projet

```bash
git clone <votre-repo>
cd christshop
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer la base de données

#### Option A: Vercel Postgres (Recommandé)

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter à Vercel
vercel login

# Lier le projet
vercel link

# Créer la base de données
vercel postgres create

# Les variables d'environnement seront automatiquement configurées
```

#### Option B: Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Copiez la connection string PostgreSQL
4. Créez un fichier `.env`:

```env
DATABASE_URL="postgresql://postgres:[password]@[host]:5432/postgres"
JWT_SECRET="your-secret-key-here"
NEXT_PUBLIC_WHATSAPP_NUMBER="237XXXXXXXXX"
```

#### Option C: Neon

1. Allez sur [neon.tech](https://neon.tech)
2. Créez un projet
3. Copiez la connection string
4. Ajoutez-la dans `.env`

### 4. Générer le JWT Secret

```bash
# Linux/Mac
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

Copiez le résultat dans `.env` comme `JWT_SECRET`

### 5. Initialiser la base de données

```bash
# Appliquer le schéma et créer les données de test
npm run db:setup

# Ou séparément:
npm run prisma:push    # Créer les tables
npm run prisma:seed    # Insérer les données de test
```

### 6. Lancer le serveur de développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) 🎉

### 7. Se connecter en tant qu'admin

```
URL: http://localhost:3000/admin
Email: admin@christshop.com
Mot de passe: admin123
```

⚠️ **Changez ce mot de passe en production!**

## 📁 Structure du Projet

```
christshop/
├── app/
│   ├── api/                    # API Routes Next.js
│   │   ├── products/          # CRUD Produits
│   │   ├── categories/        # CRUD Catégories
│   │   ├── customers/         # CRUD Clients
│   │   └── auth/              # Authentification
│   ├── admin/                 # Pages admin
│   │   └── page.tsx
│   ├── globals.css            # Styles globaux
│   ├── layout.tsx             # Layout racine
│   └── page.tsx               # Page d'accueil
├── components/
│   ├── admin/                 # Composants admin
│   ├── ui/                    # Composants shadcn/ui
│   └── *.tsx                  # Composants client
├── lib/
│   ├── api.ts                 # Utilitaires API
│   ├── auth.ts                # Utilitaires auth
│   └── utils.ts               # Utilitaires généraux
├── prisma/
│   ├── schema.prisma          # Schéma de la BDD
│   └── seed.ts                # Données de test
├── types/
│   └── product.ts             # Types TypeScript
├── .env.example               # Variables d'environnement
├── package.json
└── tsconfig.json
```

## 🗄️ Schéma de Base de Données

```prisma
- Category (id, name)
  ├─> Product[] (relation one-to-many)
  
- Product (id, name, description, price, image, inStock, categoryId)
  └─> Category (relation)
  
- Customer (id, name, phone, registeredAt)

- Admin (id, email, passwordHash, name)

- AdminSession (id, adminId, token, expiresAt)
```

## 🔧 Commandes Utiles

```bash
# Développement
npm run dev                    # Lancer le serveur de dev
npm run prisma:studio          # Interface visuelle de la BDD

# Base de données
npm run prisma:push            # Appliquer le schéma
npm run prisma:migrate         # Créer une migration
npm run prisma:seed            # Seed des données
npm run prisma:reset           # Reset complet
npm run db:setup               # Push + Seed

# Production
npm run build                  # Build pour production
npm start                      # Lancer en production
```

## 🌐 Déploiement

### Sur Vercel (Recommandé)

1. Poussez votre code sur GitHub
2. Importez le projet sur [vercel.com](https://vercel.com)
3. Vercel détectera automatiquement Next.js
4. Créez une base Postgres sur Vercel
5. Les variables d'environnement seront auto-configurées
6. Déployez! 🚀

### Variables d'environnement à configurer

```env
DATABASE_URL
JWT_SECRET
NEXT_PUBLIC_WHATSAPP_NUMBER
```

### Après le déploiement

```bash
# Appliquer les migrations en production
vercel env pull
npm run prisma:migrate:deploy
```

## 📸 Screenshots

### Interface Client
- Hero section avec animations parallax
- Grille de produits responsive
- Panier avec WhatsApp integration
- Interface d'inscription clients

### Panneau Admin
- Dashboard avec statistiques
- Gestion des produits
- Gestion des catégories
- Liste des clients
- Notifications WhatsApp

## 🛠️ Technologies Utilisées

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, CSS Variables
- **UI Components**: shadcn/ui, Radix UI
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma 5
- **Auth**: JWT (jose), bcryptjs
- **Validation**: Zod
- **Icons**: Lucide React
- **Fonts**: Google Fonts (Poppins, Inter)

## 📝 API Endpoints

### Produits
```
GET    /api/products              # Liste des produits
POST   /api/products              # Créer un produit
GET    /api/products/:id          # Récupérer un produit
PUT    /api/products/:id          # Modifier un produit
DELETE /api/products/:id          # Supprimer un produit
```

### Catégories
```
GET    /api/categories            # Liste des catégories
POST   /api/categories            # Créer une catégorie
GET    /api/categories/:id        # Récupérer une catégorie
DELETE /api/categories/:id        # Supprimer une catégorie
```

### Clients
```
GET    /api/customers             # Liste des clients
POST   /api/customers             # Inscrire un client
GET    /api/customers/:id         # Récupérer un client
DELETE /api/customers/:id         # Supprimer un client
```

### Authentification
```
POST   /api/auth/login            # Connexion admin
GET    /api/auth/verify           # Vérifier le token
POST   /api/auth/logout           # Déconnexion admin
```

## 🔒 Sécurité

- ✅ Mots de passe hashés avec bcrypt (10 rounds)
- ✅ Tokens JWT avec expiration (7 jours)
- ✅ Cookies HttpOnly pour les tokens
- ✅ Validation des données avec Zod
- ✅ Protection CSRF avec SameSite cookies
- ✅ SSL recommandé en production
- ⚠️ Changez le mot de passe admin par défaut

## 🐛 Troubleshooting

### Erreur: "Can't reach database server"
```bash
# Vérifiez votre DATABASE_URL dans .env
# Assurez-vous que PostgreSQL est accessible
# Vérifiez que SSL est activé si nécessaire
```

### Erreur: "Prisma Client did not initialize"
```bash
npx prisma generate
npm run dev
```

### Images ne s'affichent pas
```bash
# Vérifiez que les URLs d'images sont correctes
# Pour base64, assurez-vous du format: data:image/...
```

## 📚 Documentation

- [Guide de Migration Complet](./MIGRATION_GUIDE.md)
- [Documentation Prisma](https://www.prisma.io/docs)
- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation PostgreSQL](https://www.postgresql.org/docs/)

## 🤝 Contribution

Les contributions sont les bienvenues! N'hésitez pas à:
1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.

## 👨‍💻 Auteur

ChristShop - Créé avec ❤️

## 🙏 Remerciements

- shadcn/ui pour les composants
- Vercel pour l'hébergement
- Prisma pour l'ORM
- La communauté Next.js

---

**⭐ N'oubliez pas de mettre une étoile si ce projet vous a été utile!**
