"use client"

import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ProductForm } from "@/components/admin/product-form"
import { ProductList } from "@/components/admin/product-list"
import { CustomerList } from "@/components/admin/customer-list"
import { LoginForm } from "@/components/admin/login-form"
import { AdminHeader } from "@/components/admin/admin-header"
import { NotificationDialog } from "@/components/admin/notification-dialog"
import type { Product } from "@/types/product"
import { getProducts, getCategories, createCategory, deleteCategory, getCustomers, deleteCustomer, deleteProduct } from "@/lib/api"
import { verifyAuth, logout } from "@/lib/auth"

interface Category {
  id: string
  name: string
  productCount?: number
}

interface Customer {
  id: string
  name: string
  phone: string
  registeredAt: string
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategoryName, setNewCategoryName] = useState("")
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [notificationProduct, setNotificationProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const { authenticated } = await verifyAuth()
      if (authenticated) {
        setIsAuthenticated(true)
        await loadData()
      }
    } catch (error) {
      console.error("Erreur d'authentification:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadData = async () => {
    try {
      const [productsData, categoriesData, customersData] = await Promise.all([
        getProducts(),
        getCategories(),
        getCustomers()
      ])
      setProducts(productsData)
      setCategories(categoriesData)
      setCustomers(customersData)
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error)
    }
  }

  const handleLogin = async () => {
    await loadData()
    setIsAuthenticated(true)
  }

  const handleLogout = async () => {
    await logout()
    setIsAuthenticated(false)
    setProducts([])
    setCategories([])
    setCustomers([])
  }

  const handleAddCategory = async () => {
    if (newCategoryName.trim() === "") {
      alert("Veuillez entrer un nom de catégorie")
      return
    }
    try {
      await createCategory(newCategoryName.trim())
      setNewCategoryName("")
      // Recharger les catégories
      const categoriesData = await getCategories()
      setCategories(categoriesData)
    } catch (error: any) {
      alert(error.message || "Erreur lors de la création de la catégorie")
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) {
      try {
        await deleteCategory(categoryId)
        // Recharger les catégories
        const categoriesData = await getCategories()
        setCategories(categoriesData)
      } catch (error: any) {
        alert(error.message || "Erreur lors de la suppression")
      }
    }
  }

  const handleFormSubmit = async (sendNotifications?: boolean) => {
    // Recharger les produits après ajout/modification
    const productsData = await getProducts()
    setProducts(productsData)
    setEditingProduct(null)
    setIsFormOpen(false)

    // Si c'est un nouveau produit avec notifications
    if (sendNotifications && customers.length > 0) {
      const lastProduct = productsData[0] // Le dernier produit ajouté
      if (lastProduct) {
        setNotificationProduct(lastProduct)
      }
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setIsFormOpen(true)
  }

  const handleCancelEdit = () => {
    setEditingProduct(null)
    setIsFormOpen(false)
  }

  const handleDeleteCustomer = async (customerId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
      try {
        await deleteCustomer(customerId)
        // Recharger les clients
        const customersData = await getCustomers()
        setCustomers(customersData)
      } catch (error: any) {
        alert(error.message || "Erreur lors de la suppression")
      }
    }
  }

  // ✅ NOUVELLE FONCTION : Suppression de produit
  const handleDeleteProduct = async (productId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      try {
        await deleteProduct(productId)
        // Recharger les produits après suppression
        const productsData = await getProducts()
        setProducts(productsData)
      } catch (error: any) {
        alert(error.message || "Erreur lors de la suppression du produit")
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Vérification...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) return <LoginForm onLogin={handleLogin} />

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader onLogout={handleLogout} />
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products">Produits</TabsTrigger>
            <TabsTrigger value="categories">Catégories</TabsTrigger>
            <TabsTrigger value="customers">
              Clients <Badge className="ml-2">{customers.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold">Gestion des Produits</h2>
                <p className="text-muted-foreground">Ajoutez, modifiez ou supprimez des produits</p>
              </div>
              <Button onClick={() => { setEditingProduct(null); setIsFormOpen(true); }}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un produit
              </Button>
            </div>
            {isFormOpen && (
              <Card>
                <CardHeader>
                  <CardTitle>{editingProduct ? "Modifier le produit" : "Nouveau produit"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProductForm
                    product={editingProduct}
                    categories={categories}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCancelEdit}
                  />
                </CardContent>
              </Card>
            )}
            <ProductList 
              products={products} 
              onEdit={handleEdit} 
              onDelete={handleDeleteProduct}
            />
          </TabsContent>
          
          <TabsContent value="categories" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold">Gestion des Catégories</h2>
                <p className="text-muted-foreground">Organisez vos produits par catégories</p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Ajouter une catégorie</CardTitle>
                <CardDescription>Créez une nouvelle catégorie pour vos produits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Label htmlFor="category-name" className="sr-only">
                      Nom de la catégorie
                    </Label>
                    <Input
                      id="category-name"
                      placeholder="Ex: Chaussures, Bijoux, Parfums..."
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleAddCategory()
                        }
                      }}
                    />
                  </div>
                  <Button onClick={handleAddCategory}>
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <Card key={category.id}>
                  <CardContent className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <span className="text-lg font-semibold text-primary">
                          {category.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {category.productCount || 0} produit(s)
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {categories.length === 0 && (
              <Card>
                <CardContent className="flex min-h-[200px] items-center justify-center">
                  <div className="text-center">
                    <p className="text-lg font-medium text-muted-foreground">Aucune catégorie</p>
                    <p className="text-sm text-muted-foreground">
                      Commencez par ajouter votre première catégorie
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold">Clients Inscrits</h2>
                <p className="text-muted-foreground">
                  Liste des clients abonnés aux notifications
                </p>
              </div>
            </div>
            <CustomerList customers={customers} onDelete={handleDeleteCustomer} />
          </TabsContent>
        </Tabs>
      </main>

      {notificationProduct && (
        <NotificationDialog
          product={notificationProduct}
          customers={customers}
          onClose={() => setNotificationProduct(null)}
        />
      )}
    </div>
  )
}