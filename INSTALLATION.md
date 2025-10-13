# 🚀 Installation ChristShop - Projet Complet

Bienvenue! Vous avez maintenant le projet ChristShop complet avec PostgreSQL.

## 📦 Contenu du Projet

Vous avez reçu:
- ✅ **christshop-complete/** - Dossier du projet complet
- ✅ **christshop-complete.tar.gz** - Archive du projet
- ✅ Documentation complète (README, QUICKSTART, START_HERE)

## ⚡ Installation Rapide (5 minutes)

### 1. Extraire le projet (si vous avez l'archive)

```bash
# Extraire l'archive
tar -xzf christshop-complete.tar.gz
cd christshop-complete
```

### 2. Installer les dépendances

```bash
npm install
```

Cela va installer toutes les dépendances nécessaires:
- Next.js, React, TypeScript
- Prisma (ORM pour PostgreSQL)
- shadcn/ui components
- bcryptjs, jose (sécurité)
- zod (validation)
- Et plus...

### 3. Configurer PostgreSQL

#### Option A: Vercel Postgres (Recommandé - Gratuit)

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Lier le projet
vercel link

# Créer la base de données
vercel postgres create
```

Les variables d'environnement seront configurées automatiquement!

#### Option B: Supabase (Gratuit)

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Copiez la connection string PostgreSQL
4. Créez un fichier `.env`:

```env
DATABASE_URL="postgresql://postgres:[password]@[host]:5432/postgres"
JWT_SECRET="$(openssl rand -base64 32)"
NEXT_PUBLIC_WHATSAPP_NUMBER="237XXXXXXXXX"
```

#### Option C: Neon (Gratuit)

1. Allez sur [neon.tech](https://neon.tech)
2. Créez un projet
3. Copiez la connection string
4. Créez `.env` comme ci-dessus

### 4. Générer JWT Secret

```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

Copiez le résultat dans `.env` comme `JWT_SECRET`

### 5. Initialiser la Base de Données

```bash
# Créer les tables et insérer les données de test
npm run db:setup
```

Cette commande va:
- ✅ Créer toutes les tables (products, categories, customers, admins, sessions)
- ✅ Insérer un compte admin (admin@christshop.com / admin123)
- ✅ Créer 4 catégories de test
- ✅ Ajouter 6 produits de démonstration
- ✅ Créer 3 clients de test

### 6. Lancer l'Application

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) 🎉

### 7. Se Connecter en Admin

```
URL: http://localhost:3000/admin
Email: admin@christshop.com
Mot de passe: admin123
```

⚠️ **IMPORTANT: Changez ce mot de passe en production!**

## 📁 Structure du Projet

```
christshop-complete/
├── app/                    # Pages Next.js
│   ├── api/               # API Routes (backend)
│   │   ├── products/     # CRUD produits
│   │   ├── categories/   # CRUD catégories
│   │   ├── customers/    # CRUD clients
│   │   └── auth/         # Authentification JWT
│   ├── admin/            # Page admin
│   ├── globals.css       # Styles globaux
│   ├── layout.tsx        # Layout racine
│   └── page.tsx          # Page d'accueil
│
├── components/
│   ├── ui/               # Composants shadcn/ui
│   ├── admin/            # Composants admin
│   ├── cart-sheet.tsx
│   ├── product-card.tsx
│   └── user-login-sheet.tsx
│
├── lib/
│   ├── api.ts            # Fonctions API
│   ├── auth.ts           # Utilitaires auth
│   └── utils.ts          # Utilitaires généraux
│
├── prisma/
│   ├── schema.prisma     # Schéma PostgreSQL
│   └── seed.ts           # Données de test
│
├── scripts/
│   ├── generate-admin-hash.js
│   └── migrate-localstorage.ts
│
├── types/
│   └── product.ts        # Types TypeScript
│
├── .env.example          # Template variables
├── .gitignore
├── package.json
├── README.md
└── QUICKSTART.md
```

## 🗄️ Base de Données

Le schéma PostgreSQL inclut:

- **products** - Catalogue de produits
- **categories** - Catégories de produits
- **customers** - Clients inscrits aux notifications
- **admins** - Comptes administrateurs
- **admin_sessions** - Sessions d'authentification
- **notification_logs** - Historique des notifications (optionnel)

## 🔧 Commandes Disponibles

```bash
# Développement
npm run dev                 # Serveur de développement
npm run build              # Build production
npm start                  # Serveur production

# Base de données
npm run db:push            # Appliquer le schéma
npm run db:seed            # Insérer données de test
npm run db:setup           # push + seed (installation initiale)
npm run db:studio          # Interface visuelle Prisma
npm run db:migrate         # Créer une migration
npm run db:reset           # Reset complet

# Autres
npm run lint               # Vérifier le code
```

## 🌐 Déploiement sur Vercel

### Méthode Automatique

1. Push sur GitHub
2. Importez sur [vercel.com](https://vercel.com)
3. Créez une base Postgres sur Vercel
4. Déployez!

### Méthode CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Créer la base de données
vercel postgres create

# Appliquer les migrations
vercel env pull
npm run db:migrate:deploy
```

### Variables d'Environnement

Configurez sur Vercel Dashboard:
```
DATABASE_URL
JWT_SECRET
NEXT_PUBLIC_WHATSAPP_NUMBER
```

## ✅ Vérification

Assurez-vous que tout fonctionne:

- [ ] `npm run dev` démarre sans erreur
- [ ] Page d'accueil affiche les produits
- [ ] Recherche et filtres fonctionnent
- [ ] Panier fonctionne
- [ ] Login admin fonctionne (admin@christshop.com / admin123)
- [ ] CRUD produits fonctionne
- [ ] CRUD catégories fonctionne
- [ ] Liste des clients s'affiche

## 🐛 Troubleshooting

### "Can't reach database server"
```bash
# Vérifiez DATABASE_URL
cat .env | grep DATABASE_URL

# Testez la connexion
npx prisma db pull
```

### "Prisma Client did not initialize"
```bash
npx prisma generate
npm run dev
```

### Erreurs de build
```bash
# Nettoyer et réinstaller
rm -rf node_modules .next
npm install
npm run build
```

### Voir la base de données
```bash
npx prisma studio
# Ouvre http://localhost:5555
```

## 📚 Documentation

- **[START_HERE.md](./START_HERE.md)** - Commencez ici
- **[QUICKSTART.md](./QUICKSTART.md)** - Installation rapide
- **[README.md](./README.md)** - Documentation complète

## 🔐 Sécurité

Pour la production:

1. **Changez le mot de passe admin**
```bash
node scripts/generate-admin-hash.js
```

2. **Utilisez un JWT_SECRET fort**
```bash
openssl rand -base64 32
```

3. **Configurez HTTPS** (automatique sur Vercel)

4. **Activez les règles de firewall** pour PostgreSQL

5. **Faites des backups** réguliers

## 🆘 Support

- Consultez la documentation
- Vérifiez les logs: `npm run dev`
- Utilisez Prisma Studio pour inspecter la BDD
- Ouvrez une issue sur GitHub

## 🎉 C'est Parti!

Votre application ChristShop est prête! 

**Prochaines étapes recommandées:**
1. Personnalisez les couleurs dans `app/globals.css`
2. Ajoutez vos vraies catégories et produits
3. Configurez votre numéro WhatsApp
4. Changez le mot de passe admin
5. Déployez sur Vercel

---

**Créé avec ❤️ pour ChristShop**

Pour toute question, consultez la documentation complète dans README.md
