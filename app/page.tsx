"use client"

import { useState, useEffect } from "react"
import { ShoppingCart, Search, User, ShieldCheck, Sparkles, Star, Zap, Package, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ProductCard } from "@/components/product-card"
import { CartSheet } from "@/components/cart-sheet"
import { UserLoginSheet } from "@/components/user-login-sheet"
import type { Product } from "@/types/product"
import { getProducts, getCategories } from "@/lib/api"
import Link from "next/link"

interface Category {
  id: string
  name: string
}

export default function HomePage() {
  const [cart, setCart] = useState<Array<Product & { quantity: number }>>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isUserLoginOpen, setIsUserLoginOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false)
  const [userName, setUserName] = useState("")
  const [scrollY, setScrollY] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([])
  const PRODUCTS_PAGE_SIZE = 12

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Charger les produits et catégories depuis l'API
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories()
        ])
        setProducts(productsData)
        setCategories(categoriesData)
        setVisibleProducts(productsData.slice(0, PRODUCTS_PAGE_SIZE))
      } catch (error) {
        console.error("Erreur lors du chargement:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()

    // Vérifier si l'utilisateur est connecté
    const loggedIn = localStorage.getItem("christshop_customer_registered")
    const savedName = localStorage.getItem("christshop_customer_name")
    if (loggedIn === "true" && savedName) {
      setIsUserLoggedIn(true)
      setUserName(savedName)
    }
  }, [])

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart((prev) => prev.map((item) => (item.id === productId ? { ...item, quantity } : item)))
  }

  const filteredProducts = products
    .filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((product) => !selectedCategory || product.category === selectedCategory)

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const loadMoreProducts = () => {
    setVisibleProducts(products.slice(0, visibleProducts.length + PRODUCTS_PAGE_SIZE))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navigation Ultra-Premium */}
      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-background/70 backdrop-blur-2xl transition-all duration-300">
        <div className="container mx-auto flex h-24 items-center justify-between px-6 lg:px-16">
          <Link href="/" className="group relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-primary via-accent to-primary rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
            <div className="relative flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-accent to-primary shadow-2xl shadow-primary/50 transition-transform group-hover:scale-110 duration-300">
                <Crown className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="font-serif text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  ChristShop
                </h1>
                <p className="text-[10px] tracking-[0.4em] text-primary/60 uppercase">Best Collection</p>
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-2 lg:gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2 rounded-full hover:bg-primary/10 transition-all duration-300" 
              onClick={() => setIsUserLoginOpen(true)}
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline font-medium">{isUserLoggedIn ? userName : "Compte"}</span>
            </Button>

            <Link href="/admin">
              <Button variant="ghost" size="sm" className="gap-2 rounded-full hover:bg-primary/10 transition-all duration-300">
                <ShieldCheck className="h-4 w-4" />
                <span className="hidden sm:inline font-medium">Admin</span>
              </Button>
            </Link>

            <Button 
              size="sm"
              className="relative h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-110" 
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <Badge className="absolute -right-2 -top-2 h-6 w-6 justify-center rounded-full border-2 border-background p-0 text-xs font-bold shadow-lg animate-pulse">
                  {cartItemsCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Spectaculaire avec Effet Parallax */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
        {/* Arrière-plan animé ultra-moderne */}
        <div className="absolute inset-0">
          <div 
            className="absolute top-0 left-1/4 h-[600px] w-[600px] rounded-full bg-primary/30 blur-[120px] animate-pulse"
            style={{ transform: `translateY(${scrollY * 0.3}px)` }}
          />
          <div 
            className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-accent/30 blur-[100px] animate-pulse"
            style={{ transform: `translateY(${-scrollY * 0.2}px)` }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,hsl(var(--background))_100%)]" />
        </div>

        <div className="container relative z-10 mx-auto px-6 lg:px-16">
          <div className="mx-auto max-w-5xl text-center">
            {/* Badge Premium Animé */}
            <div className="mb-12 inline-flex items-center gap-3 rounded-full border border-primary/30 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 px-8 py-3 backdrop-blur-xl shadow-2xl shadow-primary/20 animate-float">
              <Sparkles className="h-5 w-5 text-primary animate-spin-slow" />
              <span className="font-semibold tracking-wide">Collection Exclusive 2025</span>
              <Zap className="h-5 w-5 text-accent animate-pulse" />
            </div>

            {/* Titre Monumental */}
            <h1 className="mb-8 font-serif text-6xl font-bold leading-[1.1] tracking-tight lg:text-8xl">
              L'Art de
              <br />
              <span className="relative inline-block">
                <span className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent blur-2xl opacity-50">
                  l'Élégance
                </span>
                <span className="relative bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
                  l'Élégance
                </span>
              </span>
            </h1>

            <p className="mx-auto mb-16 max-w-3xl text-xl leading-relaxed text-muted-foreground/90 lg:text-2xl">
              Des produits d'exception soigneusement sélectionnés pour sublimer votre quotidien. 
              <span className="font-semibold text-foreground"> Livraison rapide via WhatsApp.</span>
            </p>

            {/* Barre de recherche Premium avec Glassmorphism */}
            <div className="mx-auto mb-16 max-w-3xl">
              <div className="group relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary via-accent to-primary blur-xl opacity-20 group-hover:opacity-40 transition-all duration-500" />
                <div className="relative flex items-center overflow-hidden rounded-full border border-white/20 bg-white/5 backdrop-blur-2xl shadow-2xl">
                  <Search className="absolute left-7 h-6 w-6 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Recherchez votre produit de rêve..."
                    className="h-20 rounded-full border-0 bg-transparent pl-16 pr-32 text-lg placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button 
                    size="lg"
                    className="absolute right-2 rounded-full bg-gradient-to-r from-primary to-accent px-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    Rechercher
                  </Button>
                </div>
              </div>
            </div>

            {/* Catégories Rapides */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full border-primary/30 bg-background/50 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 hover:scale-105 shadow-lg"
                onClick={() => setSelectedCategory(null)}
              >
                Tout Voir
              </Button>
              {categories.slice(0, 4).map((cat) => (
                <Button
                  key={cat.id}
                  variant="outline"
                  size="lg"
                  className="rounded-full border-primary/30 bg-background/50 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 hover:scale-105 shadow-lg"
                  onClick={() => setSelectedCategory(cat.name)}
                >
                  {cat.name}
                </Button>
              ))}
            </div>

            {/* Features Cards Luxueuses */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="group relative rounded-3xl border border-white/10 bg-gradient-to-br from-background via-primary/5 to-background p-8 backdrop-blur-xl shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:scale-105">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg">
                    <Package className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="mb-2 text-2xl font-bold">{products.length}+</h3>
                  <p className="text-sm text-muted-foreground">Produits Premium</p>
                </div>
              </div>

              <div className="group relative rounded-3xl border border-white/10 bg-gradient-to-br from-background via-accent/5 to-background p-8 backdrop-blur-xl shadow-2xl hover:shadow-accent/20 transition-all duration-500 hover:scale-105">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-primary shadow-lg">
                    <Star className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="mb-2 text-2xl font-bold">5.0★</h3>
                  <p className="text-sm text-muted-foreground">Note Clients</p>
                </div>
              </div>

              <div className="group relative rounded-3xl border border-white/10 bg-gradient-to-br from-background via-primary/5 to-background p-8 backdrop-blur-xl shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:scale-105">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="mb-2 text-2xl font-bold">24/7</h3>
                  <p className="text-sm text-muted-foreground">Support Client</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="h-12 w-8 rounded-full border-2 border-primary/30 flex items-start justify-center p-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          </div>
        </div>
      </section>

      {/* Section Produits Premium */}
      <section className="relative py-32">
        <div className="container mx-auto px-6 lg:px-16">
          {/* En-tête Section */}
          <div className="mb-20 text-center">
            <Badge className="mb-6 rounded-full px-6 py-2 text-sm">
              {selectedCategory || "Tous nos produits"}
            </Badge>
            <h2 className="mb-6 font-serif text-5xl font-bold lg:text-6xl">
              Collection{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Exclusive
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              {filteredProducts.length} produit{filteredProducts.length > 1 ? "s" : ""} d'exception pour vous
            </p>
          </div>

          {/* Grille de Produits */}
          {visibleProducts.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard product={product} onAddToCart={addToCart} />
                </div>
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-2xl rounded-3xl border-2 border-dashed border-border/50 bg-muted/30 p-20 text-center backdrop-blur-sm">
              <Search className="mx-auto mb-6 h-24 w-24 text-muted-foreground/20" />
              <h3 className="mb-3 text-2xl font-bold">Aucun produit trouvé</h3>
              <p className="text-muted-foreground mb-6">
                Essayez de modifier votre recherche ou explorez nos catégories
              </p>
              <Button
                size="lg"
                className="rounded-full"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory(null)
                }}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          )}
          {visibleProducts.length < filteredProducts.length && (
            <div className="flex justify-center mt-8">
              <Button onClick={loadMoreProducts}>Charger plus</Button>
            </div>
          )}
        </div>
      </section>

      {/* Footer Ultra-Premium */}
      <footer className="relative overflow-hidden border-t border-white/10 bg-gradient-to-b from-background to-muted/50 py-20">
        <div className="absolute inset-0">
          <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
        </div>
        
        <div className="container relative mx-auto px-6 text-center lg:px-16">
          <div className="mb-8 inline-flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-2xl shadow-primary/30">
              <Crown className="h-8 w-8 text-white" />
            </div>
            <h3 className="font-serif text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ChristShop
            </h3>
          </div>
          <p className="mb-6 text-lg text-muted-foreground">
            L'excellence à portée de main
          </p>
          <div className="flex items-center justify-center gap-4 mb-8">
            <Badge variant="outline" className="rounded-full px-4 py-2">
              Service Premium
            </Badge>
            <Badge variant="outline" className="rounded-full px-4 py-2">
              Livraison Rapide
            </Badge>
            <Badge variant="outline" className="rounded-full px-4 py-2">
              Qualité Garantie
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground/60">
            © 2025 ChristShop. Tous droits réservés. Créé avec passion.
          </p>
        </div>
      </footer>

      <CartSheet 
        cart={cart} 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        onUpdateQuantity={updateQuantity} 
        onRemove={removeFromCart} 
      />
      <UserLoginSheet 
        isOpen={isUserLoginOpen} 
        onClose={() => setIsUserLoginOpen(false)} 
        onLoginSuccess={(name) => { setIsUserLoggedIn(true); setUserName(name); }} 
        onLogout={() => { setIsUserLoggedIn(false); setUserName(""); }} 
      />
    </div>
  )
}
