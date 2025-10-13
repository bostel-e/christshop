"use client"

import { MessageCircle, Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import type { Product } from "@/types/product"

interface CartSheetProps {
  cart: Array<Product & { quantity: number }>
  isOpen: boolean
  onClose: () => void
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemove: (productId: string) => void
}

export function CartSheet({ cart, isOpen, onClose, onUpdateQuantity, onRemove }: CartSheetProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XAF",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const generateWhatsAppMessage = () => {
  const shopPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
  const baseUrl = typeof window !== "undefined" ? window.location.origin : ""

  let message = `╔═══════════════════════╗\n`
  message += `   🛍️ *COMMANDE CHRISTSHOP* 🛍️\n`
  message += `╚═══════════════════════╝\n\n`
  message += `Bonjour *ChristShop* ! 👋\n\n`
  message += `Je souhaite commander les articles suivants :\n\n`
  message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`

  cart.forEach((item, index) => {
    message += `*${index + 1}. ${item.name}*\n`
    message += `   📦 Quantité : *${item.quantity}*\n`
    message += `   💵 Prix unitaire : ${formatPrice(item.price)}\n`
    message += `   💰 Sous-total : *${formatPrice(item.price * item.quantity)}*\n`
    message += `   🔗 ${baseUrl}/#produit-${item.id}\n\n`
  })

  message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`
  message += `✨ *RÉCAPITULATIF* ✨\n\n`
  message += `📊 Nombre d'articles : *${cart.length}*\n`
  message += `💎 *TOTAL : ${formatPrice(total)}*\n\n`
  message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`
  message += `💬 _Merci de me confirmer la disponibilité et les modalités de livraison._\n\n`
  message += `Au plaisir de finaliser ma commande ! 🙏✨`

  const encodedMessage = encodeURIComponent(message)
  const whatsappUrl = `https://wa.me/${shopPhone}?text=${encodedMessage}`

  window.open(whatsappUrl, "_blank")
}

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader className="space-y-3">
          <SheetTitle className="flex items-center gap-2 text-2xl">
            <ShoppingBag className="h-6 w-6 text-primary" />
            Votre Panier
          </SheetTitle>
          <SheetDescription className="text-base">
            {cart.length === 0
              ? "Votre panier est vide"
              : `${cart.length} article${cart.length > 1 ? "s" : ""} dans votre panier`}
          </SheetDescription>
        </SheetHeader>

        <Separator className="my-4" />

        <div className="flex-1 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 py-12">
              <div className="rounded-full bg-muted p-6">
                <ShoppingBag className="h-12 w-12 text-muted-foreground" />
              </div>
              <p className="text-center text-muted-foreground">
                Votre panier est vide
                <br />
                <span className="text-sm">Ajoutez des produits pour commencer</span>
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="group flex gap-4 rounded-2xl border-2 border-primary/10 bg-gradient-to-br from-white via-muted/60 to-primary/5 p-4 shadow-lg transition-all duration-200 hover:scale-[1.03] hover:border-primary/40 hover:shadow-2xl"
                >
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-muted ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h4 className="font-extrabold text-lg leading-tight text-primary drop-shadow-sm">{item.name}</h4>
                      <p className="mt-1 text-base font-bold text-primary/80">{formatPrice(item.price)}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded-lg border bg-background p-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 hover:bg-primary/10 hover:text-primary"
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 hover:bg-primary/10 hover:text-primary"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        onClick={() => onRemove(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <>
            <Separator className="my-4" />
            <div className="space-y-4">
              <div className="rounded-xl bg-muted/50 p-4">
                <div className="flex items-center justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>
              </div>

              <Button
                className="w-full rounded-xl font-bold shadow-lg transition-all hover:shadow-xl"
                size="lg"
                onClick={generateWhatsAppMessage}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Commander via WhatsApp
              </Button>

              <p className="text-center text-xs leading-relaxed text-muted-foreground">
                Vous serez redirigé vers WhatsApp avec tous les détails de votre commande incluant les photos et liens
                des produits
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}