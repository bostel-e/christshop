# 🚀 Démarrage Rapide ChristShop avec PostgreSQL

## ⚡ Installation Express (5 minutes)

### 1️⃣ Installation

```bash
# Cloner et installer
git clone <votre-repo>
cd christshop
npm install
```

### 2️⃣ Configuration Base de Données

Choisissez UNE option:

#### Option A: Vercel Postgres (Le plus simple)
```bash
vercel login
vercel link
vercel postgres create
# ✅ DATABASE_URL configuré automatiquement
```

#### Option B: Supabase (Gratuit)
1. Compte sur https://supabase.com
2. Créer projet → Copier connection string
3. Créer `.env`:
```env
DATABASE_URL="votre-connection-string"
JWT_SECRET="$(openssl rand -base64 32)"
NEXT_PUBLIC_WHATSAPP_NUMBER="237XXXXXXXXX"
```

### 3️⃣ Initialisation

```bash
# Créer les tables + données de test
npm run db:setup

# Lancer l'app
npm run dev
```

### 4️⃣ Connexion Admin

```
URL: http://localhost:3000/admin
Email: admin@christshop.com
Password: admin123
```

## ✅ C'est tout! 

Vous avez maintenant:
- ✅ Base PostgreSQL configurée
- ✅ API REST fonctionnelle
- ✅ Interface client prête
- ✅ Panneau admin opérationnel
- ✅ Authentification sécurisée
- ✅ Données de démonstration

## 🎯 Prochaines Étapes

1. **Personnalisation**
   - Changez le mot de passe admin
   - Ajoutez votre numéro WhatsApp dans `.env`
   - Personnalisez les couleurs dans `globals.css`

2. **Ajout de Produits**
   - Allez sur `/admin`
   - Créez vos catégories
   - Ajoutez vos produits

3. **Upload d'Images**
   - Utilisez des URLs d'images (Imgur, Cloudinary)
   - Ou configurez UploadThing pour l'upload direct

4. **Déploiement**
   ```bash
   vercel deploy
   ```

## 🆘 Problèmes Courants

### "Can't reach database"
```bash
# Vérifiez DATABASE_URL dans .env
cat .env | grep DATABASE_URL
```

### "Prisma Client not initialized"
```bash
npx prisma generate
npm run dev
```

### Voir la base de données
```bash
npx prisma studio
# Ouvre une interface web sur localhost:5555
```

## 📚 Commandes Essentielles

```bash
npm run dev              # Développement
npm run prisma:studio    # Interface BDD
npm run db:setup         # Reset + Seed
npm run build            # Production build
```

## 🔗 Liens Utiles

- [Guide Complet](./MIGRATION_GUIDE.md)
- [README Détaillé](./README.md)
- [Docs Prisma](https://prisma.io/docs)
- [Support Next.js](https://nextjs.org/docs)

---

**Besoin d'aide?** Ouvrez une issue sur GitHub! 🙌
