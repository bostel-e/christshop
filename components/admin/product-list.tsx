"use client"

import { Pencil, Trash2 } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/types/product"

interface ProductListProps {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (productId: string) => void
}

export function ProductList({ products, onEdit, onDelete }: ProductListProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XAF",
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="flex min-h-[300px] items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-medium text-muted-foreground">Aucun produit</p>
            <p className="text-sm text-muted-foreground">Commencez par ajouter votre premier produit</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden">
          <div className="relative aspect-square bg-muted">
            <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
          </div>
          <CardContent className="p-4">
            <div className="mb-3 flex items-start justify-between gap-2">
              <div className="flex-1">
                <Badge variant="outline" className="mb-2">
                  {product.category}
                </Badge>
                <h3 className="font-semibold text-balance">{product.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{product.description}</p>
              </div>
            </div>

            <div className="mb-3 flex items-center justify-between">
              <p className="text-lg font-bold text-primary">{formatPrice(product.price)}</p>
              <Badge variant={product.inStock ? "default" : "secondary"}>
                {product.inStock ? "En stock" : "Rupture"}
              </Badge>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => onEdit(product)}>
                <Pencil className="mr-2 h-4 w-4" />
                Modifier
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive bg-transparent"
                onClick={() => onDelete(product.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
