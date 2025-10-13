# 🗄️ Guide de Migration ChristShop vers PostgreSQL

## 📋 Table des Matières
1. [Installation et Configuration](#installation-et-configuration)
2. [Schéma de Base de Données](#schéma-de-base-de-données)
3. [API Routes](#api-routes)
4. [Migration du Frontend](#migration-du-frontend)
5. [Gestion des Images](#gestion-des-images)
6. [Authentification Sécurisée](#authentification-sécurisée)
7. [Déploiement](#déploiement)

---

## 1️⃣ Installation et Configuration

### Étape 1: Installer les dépendances

```bash
# Prisma (ORM moderne pour PostgreSQL)
npm install @prisma/client
npm install -D prisma

# Bibliothèques additionnelles
npm install bcryptjs           # Pour hasher les mots de passe
npm install @types/bcryptjs -D
npm install uploadthing        # Pour gérer les uploads d'images
npm install jose              # Pour JWT
npm install zod               # Pour validation
```

### Étape 2: Initialiser Prisma

```bash
npx prisma init
```

Cela crée:
- `prisma/schema.prisma`
- `.env` avec `DATABASE_URL`

### Étape 3: Choisir un hébergeur PostgreSQL

#### Option A: Vercel Postgres (Recommandé - Gratuit)
```bash
# Installer Vercel CLI
npm i -g vercel

# Créer une base de données
vercel link
vercel postgres create
```

#### Option B: Supabase (Gratuit)
1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Copiez la connection string PostgreSQL

#### Option C: Neon (Gratuit)
1. Allez sur [neon.tech](https://neon.tech)
2. Créez un projet
3. Copiez la connection string

### Étape 4: Configurer `.env`

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"

# UploadThing (pour les images)
UPLOADTHING_SECRET="sk_live_..."
UPLOADTHING_APP_ID="your_app_id"

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER="237XXXXXXXXX"

# JWT Secret (générez avec: openssl rand -base64 32)
JWT_SECRET="votre_secret_super_securise_ici"

# Admin credentials
ADMIN_EMAIL="admin@christshop.com"
ADMIN_PASSWORD_HASH="$2a$10$..." # Voir script de génération ci-dessous
```

### Étape 5: Générer le hash du mot de passe admin

Créez `scripts/generate-admin-hash.js`:

```javascript
const bcrypt = require('bcryptjs');

const password = 'VotreMotDePasseSecurise123!';
const hash = bcrypt.hashSync(password, 10);

console.log('Hash du mot de passe admin:');
console.log(hash);
console.log('\nCopiez ce hash dans votre .env comme ADMIN_PASSWORD_HASH');
```

Exécutez:
```bash
node scripts/generate-admin-hash.js
```

---

## 2️⃣ Schéma de Base de Données

Le fichier `prisma/schema.prisma` est déjà créé dans ce projet.

### Créer la base de données

```bash
# Appliquer le schéma
npx prisma db push

# Ou avec migrations (recommandé en production)
npx prisma migrate dev --name init

# Générer le client Prisma
npx prisma generate

# Visualiser la base de données
npx prisma studio
```

---

## 3️⃣ API Routes

Tous les fichiers API sont créés dans `app/api/`.

### Structure des API
```
app/api/
├── products/
│   ├── route.ts          # GET, POST
│   └── [id]/
│       └── route.ts      # GET, PUT, DELETE
├── categories/
│   ├── route.ts
│   └── [id]/
│       └── route.ts
├── customers/
│   ├── route.ts
│   └── [id]/
│       └── route.ts
├── auth/
│   ├── login/
│   │   └── route.ts
│   └── verify/
│       └── route.ts
└── upload/
    └── route.ts          # Upload d'images
```

---

## 4️⃣ Migration du Frontend

### Remplacer localStorage par API calls

#### Avant (localStorage):
```typescript
const products = JSON.parse(localStorage.getItem("christshop_products") || "[]")
```

#### Après (API):
```typescript
const response = await fetch('/api/products')
const products = await response.json()
```

Tous les fichiers frontend sont mis à jour dans ce projet.

---

## 5️⃣ Gestion des Images

### Option A: UploadThing (Recommandé)

1. Créez un compte sur [uploadthing.com](https://uploadthing.com)
2. Obtenez vos clés API
3. Les images sont stockées dans le cloud, pas en base64

### Option B: Cloudinary

```bash
npm install cloudinary
```

### Option C: Vercel Blob

```bash
npm install @vercel/blob
```

---

## 6️⃣ Authentification Sécurisée

### Système JWT implémenté

- Hash des mots de passe avec bcrypt
- Tokens JWT pour les sessions
- Middleware de protection des routes
- Expiration automatique des sessions

---

## 7️⃣ Déploiement

### Sur Vercel (Recommandé)

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Configurer les variables d'environnement
vercel env add DATABASE_URL
vercel env add JWT_SECRET
vercel env add UPLOADTHING_SECRET
vercel env add UPLOADTHING_APP_ID
```

### Checklist pré-déploiement

- [ ] Base de données PostgreSQL configurée
- [ ] Variables d'environnement définies
- [ ] Migrations appliquées (`npx prisma migrate deploy`)
- [ ] Client Prisma généré
- [ ] Images migrées vers service cloud
- [ ] Tests effectués

---

## 🚀 Commandes Utiles

```bash
# Développement
npm run dev

# Prisma Studio (interface visuelle)
npx prisma studio

# Réinitialiser la base de données
npx prisma migrate reset

# Générer le client après modification du schéma
npx prisma generate

# Formater le schéma
npx prisma format

# Vérifier les migrations
npx prisma migrate status
```

---

## 📚 Ressources

- [Documentation Prisma](https://www.prisma.io/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [UploadThing Docs](https://docs.uploadthing.com/)

---

## ⚠️ Notes Importantes

1. **Ne commitez JAMAIS le fichier `.env`** - Ajoutez-le à `.gitignore`
2. **Utilisez des mots de passe forts** pour l'admin
3. **Activez SSL** pour la connexion PostgreSQL en production
4. **Faites des backups** réguliers de la base de données
5. **Testez en local** avant de déployer

---

## 🐛 Troubleshooting

### Erreur: "Can't reach database server"
- Vérifiez votre `DATABASE_URL`
- Assurez-vous que PostgreSQL est en cours d'exécution
- Vérifiez les règles de firewall

### Erreur: "Prisma Client did not initialize yet"
- Exécutez `npx prisma generate`
- Redémarrez le serveur de développement

### Images ne s'affichent pas
- Vérifiez les clés UploadThing
- Assurez-vous que les URLs sont correctes
- Vérifiez les CORS si nécessaire

---

Besoin d'aide ? Créez une issue sur GitHub ! 🙌
