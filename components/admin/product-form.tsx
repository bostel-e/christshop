"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Product } from "@/types/product"
import { createProduct, updateProduct } from "@/lib/api"
import Image from "next/image"

interface Category {
  id: string
  name: string
}

interface ProductFormProps {
  product?: Product | null
  categories: Category[]
  onSubmit: (sendNotifications?: boolean) => void
  onCancel: () => void
}

export function ProductForm({ product, categories, onSubmit, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    image: product?.image || "",
    categoryId: product?.categoryId || "",
    inStock: product?.inStock ?? true,
  })
  const [sendNotifications, setSendNotifications] = useState(!product)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        categoryId: product.categoryId || "",
        inStock: product.inStock,
      })
    }
  }, [product])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Veuillez sélectionner une image valide.")
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("L'image est trop grande. Taille maximale: 5MB.")
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setFormData((prev) => ({ ...prev, image: base64String }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.categoryId) {
      setError("Veuillez sélectionner une catégorie.")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      if (product) {
        // Mise à jour
        await updateProduct(product.id, formData)
      } else {
        // Création
        await createProduct(formData)
      }
      
      onSubmit(sendNotifications)
    } catch (error: any) {
      setError(error.message || "Erreur lors de l'enregistrement")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 text-destructive text-sm">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nom du produit *</Label>
          <Input 
            id="name" 
            value={formData.name} 
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
            required 
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Catégorie *</Label>
          <Select 
            value={formData.categoryId} 
            onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
            disabled={isLoading}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Choisir une catégorie" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea 
          id="description" 
          value={formData.description} 
          onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
          rows={3} 
          required 
          disabled={isLoading}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price">Prix (FCFA) *</Label>
          <Input 
            id="price" 
            type="number" 
            min="0" 
            value={formData.price} 
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} 
            required 
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label>Image du produit</Label>
          <Tabs defaultValue="url" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Télécharger</TabsTrigger>
              <TabsTrigger value="url">Lien URL</TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="pt-2">
              <Input 
                id="image-upload" 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground mt-2">Taille maximale : 5MB.</p>
            </TabsContent>
            <TabsContent value="url" className="pt-2">
              <Input
                id="image-url"
                placeholder="https://example.com/image.jpg"
                value={formData.image.startsWith('http') || formData.image.startsWith('/') ? formData.image : ''}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                disabled={isLoading}
              />
               <p className="text-xs text-muted-foreground mt-2">URL complète de l'image.</p>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {formData.image && (
        <div className="space-y-2">
          <Label>Aperçu de l'image</Label>
          <div className="relative aspect-[3/4] w-full max-w-xs overflow-hidden rounded-lg border border-border bg-muted">
            <Image 
              src={formData.image} 
              alt="Aperçu" 
              fill 
              className="object-cover"
              unoptimized={formData.image.startsWith("data:")}
            />
          </div>
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Switch 
          id="inStock" 
          checked={formData.inStock} 
          onCheckedChange={(checked) => setFormData({ ...formData, inStock: checked })} 
          disabled={isLoading}
        />
        <Label htmlFor="inStock" className="cursor-pointer">Produit en stock</Label>
      </div>

      {!product && (
        <div className="rounded-lg border bg-muted/50 p-4">
          <div className="flex items-start space-x-3">
            <Checkbox 
              id="notifications" 
              checked={sendNotifications} 
              onCheckedChange={(checked) => setSendNotifications(checked as boolean)} 
              disabled={isLoading}
            />
            <div className="space-y-1">
              <Label htmlFor="notifications" className="cursor-pointer font-medium">
                Envoyer des notifications WhatsApp
              </Label>
              <p className="text-sm text-muted-foreground">
                Notifier tous les clients inscrits de ce nouveau produit.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Button type="submit" className="flex-1" disabled={isLoading}>
          {isLoading ? "Enregistrement..." : (product ? "Mettre à jour" : "Ajouter le produit")}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel} 
          className="flex-1 bg-transparent"
          disabled={isLoading}
        >
          Annuler
        </Button>
      </div>
    </form>
  )
}
