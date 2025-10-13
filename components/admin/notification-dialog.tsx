"use client"

import { useState } from "react"
import { MessageCircle, CheckCircle2, Copy, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/types/product"

interface NotificationDialogProps {
  product: Product
  customers: Array<{ id: string; name: string; phone: string }>
  onClose: () => void
}

export function NotificationDialog({ product, customers, onClose }: NotificationDialogProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XAF",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const generateWhatsAppMessage = (customerName: string) => {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
  const productUrl = `${baseUrl}/#produit-${product.id}`

  return `╔═══════════════════════╗\n` +
    `   ✨ *NOUVEAU PRODUIT* ✨\n` +
    `╚═══════════════════════╝\n\n` +
    `Bonjour *${customerName}* ! 👋\n\n` +
    `Nous avons le plaisir de vous annoncer l'arrivée d'un nouveau produit chez *ChristShop* :\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
    `📦 *Produit*\n` +
    `${product.name}\n\n` +
    `💰 *Prix*\n` +
    `${formatPrice(product.price)}\n\n` +
    `📝 *Description*\n` +
    `${product.description}\n\n` +
    `🏷️ *Catégorie*\n` +
    `${product.category}\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
    `🔗 *Découvrez le produit :*\n` +
    `${productUrl}\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
    `💬 _N'hésitez pas à nous contacter pour passer commande !_\n\n` +
    `À très bientôt ! 🎉✨`
}
  const generateWhatsAppLink = (phone: string, customerName: string) => {
    const message = generateWhatsAppMessage(customerName)
    const encodedMessage = encodeURIComponent(message)
    return `https://wa.me/${phone}?text=${encodedMessage}`
  }

  const handleCopyMessage = (customerName: string, index: number) => {
    const message = generateWhatsAppMessage(customerName)
    navigator.clipboard.writeText(message)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleSendToAll = () => {
    customers.forEach((customer) => {
      const link = generateWhatsAppLink(customer.phone, customer.name)
      window.open(link, "_blank")
    })
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            Notifications WhatsApp
          </DialogTitle>
          <DialogDescription>
            Envoyez des notifications à {customers.length} client{customers.length > 1 ? "s" : ""} inscrit
            {customers.length > 1 ? "s" : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border bg-muted/50 p-4">
            <h4 className="mb-2 font-semibold">Produit ajouté:</h4>
            <p className="text-sm">
              <strong>{product.name}</strong> - {formatPrice(product.price)}
            </p>
            <Badge variant="outline" className="mt-2">
              {product.category}
            </Badge>
          </div>

          <div>
            <h4 className="mb-3 font-semibold">Clients à notifier:</h4>
            <ScrollArea className="h-[300px] rounded-lg border">
              <div className="space-y-2 p-4">
                {customers.map((customer, index) => (
                  <div key={customer.id} className="flex items-center justify-between rounded-lg border bg-card p-3">
                    <div className="flex-1">
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-muted-foreground">{customer.phone}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyMessage(customer.name, index)}
                        className="bg-transparent"
                      >
                        {copiedIndex === index ? (
                          <>
                            <CheckCircle2 className="mr-1 h-4 w-4 text-green-500" />
                            Copié
                          </>
                        ) : (
                          <>
                            <Copy className="mr-1 h-4 w-4" />
                            Copier
                          </>
                        )}
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => window.open(generateWhatsAppLink(customer.phone, customer.name), "_blank")}
                      >
                        <ExternalLink className="mr-1 h-4 w-4" />
                        Envoyer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> Cliquez sur "Envoyer à tous" pour ouvrir WhatsApp pour chaque client, ou envoyez
              individuellement en cliquant sur "Envoyer" pour chaque client.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
          <Button onClick={handleSendToAll}>
            <MessageCircle className="mr-2 h-4 w-4" />
            Envoyer à tous ({customers.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}