"use client"

import { ShoppingCart, MessageCircle } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/types/product"

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XAF",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleDirectOrder = () => {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
  const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
  const productUrl = `${baseUrl}/#produit-${product.id}`

  const message =
    `╔══════════════════════╗\n` +
    `   ✨ *NOUVELLE COMMANDE* ✨\n` +
    `╚══════════════════════╝\n\n` +
    `Bonjour *ChristShop* ! 👋\n\n` +
    `Je souhaite commander ce magnifique produit :\n\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `📦 *Produit*\n` +
    `${product.name}\n\n` +
    `💰 *Prix*\n` +
    `${formatPrice(product.price)}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n\n` +
    `🔗 *Voir le produit :*\n` +
    `${productUrl}\n\n` +
    `━━━━━━━━━━━━━━━━━━━━\n\n` +
    `💬 _J'aimerais avoir plus d'informations sur ce produit et finaliser ma commande._\n\n` +
    `Merci beaucoup ! 🙏✨`

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
  window.open(whatsappUrl, "_blank")
}
  return (
    <Card className="group relative aspect-[3/4] w-full overflow-hidden rounded-2xl border-0 shadow-xl transition-all duration-500 will-change-transform hover:shadow-primary/20 lg:hover:-translate-y-2">
      <Image
        src={product.image || "/placeholder.svg?height=600&width=450"}
        alt={product.name}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
        unoptimized={product.image?.startsWith("data:")}
      />
      
      <div className="absolute top-4 right-4 z-10">
        {!product.inStock ? (
          <Badge
            variant="secondary"
            className="rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm"
          >
            Rupture
          </Badge>
        ) : (
          <Badge className="rounded-full bg-primary/80 px-3 py-1 text-xs font-semibold text-primary-foreground backdrop-blur-sm">
            Disponible
          </Badge>
        )}
      </div>

      {/* Informations compactes pour Mobile/Tablette */}
      <div className="absolute bottom-0 left-0 z-10 w-full px-3 py-3 text-white bg-gradient-to-t from-black/90 via-black/60 via-30% to-transparent lg:hidden">
        <div className="space-y-2">
          {/* Infos produit très compactes */}
          <div className="space-y-0.5">
            <h3 className="font-serif text-base font-bold leading-tight tracking-tight line-clamp-1">
              {product.name}
            </h3>
            <p className="font-serif text-lg font-bold">
              {formatPrice(product.price)}
            </p>
          </div>
          {/* Boutons compacts */}
          <div className="flex gap-2">
            <Button
              className="flex-1 rounded-full bg-primary font-bold text-primary-foreground shadow-lg transition-transform active:scale-95 h-9 text-xs"
              onClick={handleDirectOrder}
              disabled={!product.inStock}
            >
              <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
              Commander
            </Button>
            <Button
              variant="outline"
              className="flex-1 rounded-full border-white/50 bg-white/20 font-bold text-white shadow-lg backdrop-blur-md transition-transform active:scale-95 hover:bg-white/30 h-9 text-xs"
              onClick={() => onAddToCart(product)}
              disabled={!product.inStock}
            >
              <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
              Panier
            </Button>
          </div>
        </div>
      </div>

      {/* Informations pour Desktop (compactes en bas) */}
      <div className="absolute bottom-0 left-0 z-10 w-full px-4 py-4 text-white bg-gradient-to-t from-black/90 via-black/60 via-30% to-transparent hidden lg:block transition-all duration-300 group-hover:via-40%">
        <div className="space-y-2">
          <h3 className="font-serif text-xl font-bold leading-tight tracking-tight line-clamp-1">
            {product.name}
          </h3>
          <p className="font-serif text-2xl font-bold">
            {formatPrice(product.price)}
          </p>
        </div>
      </div>

      {/* Boutons pour Desktop (apparaissent au hover, en bas) */}
      <div className="absolute bottom-0 left-0 z-20 hidden lg:flex w-full px-4 pb-4 gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:pb-28">
        <Button
          className="flex-1 rounded-full bg-primary font-bold text-primary-foreground shadow-lg transition-transform hover:scale-105"
          size="default"
          onClick={handleDirectOrder}
          disabled={!product.inStock}
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          Commander
        </Button>
        <Button
          variant="outline"
          className="flex-1 rounded-full border-white/50 bg-white/20 font-bold text-white shadow-lg backdrop-blur-md transition-transform hover:scale-105 hover:bg-white/30"
          size="default"
          onClick={() => onAddToCart(product)}
          disabled={!product.inStock}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Panier
        </Button>
      </div>
    </Card>
  )
}