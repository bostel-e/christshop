"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { User, CheckCircle2, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { createCustomer } from "@/lib/api"

interface UserLoginSheetProps {
  isOpen: boolean
  onClose: () => void
  onLoginSuccess: (name: string) => void
  onLogout: () => void
}

export function UserLoginSheet({ isOpen, onClose, onLoginSuccess, onLogout }: UserLoginSheetProps) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    // Check if user is already logged in
    const registered = localStorage.getItem("christshop_customer_registered")
    if (registered === "true") {
      setIsLoggedIn(true)
      const savedName = localStorage.getItem("christshop_customer_name")
      const savedPhone = localStorage.getItem("christshop_customer_phone")
      if (savedName) setName(savedName)
      if (savedPhone) setPhone(savedPhone)
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      // ✅ Enregistrer le client dans PostgreSQL via l'API
      const customer = await createCustomer({ name, phone })
      
      console.log("✅ Client enregistré dans la base de données:", customer)

      // Sauvegarder localement pour cette session
      localStorage.setItem("christshop_customer_registered", "true")
      localStorage.setItem("christshop_customer_name", name)
      localStorage.setItem("christshop_customer_phone", phone)
      localStorage.setItem("christshop_customer_id", customer.id)

      setIsLoggedIn(true)
      setShowSuccess(true)
      onLoginSuccess(name)

      setTimeout(() => {
        setShowSuccess(false)
        onClose()
      }, 2000)
    } catch (error: any) {
      console.error("❌ Erreur lors de l'inscription:", error)
      setError(error.message || "Erreur lors de l'inscription. Ce numéro existe peut-être déjà.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("christshop_customer_registered")
    localStorage.removeItem("christshop_customer_name")
    localStorage.removeItem("christshop_customer_phone")
    localStorage.removeItem("christshop_customer_id")
    setIsLoggedIn(false)
    setName("")
    setPhone("")
    onLogout()
    onClose()
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <User className="h-6 w-6 text-primary" />
          </div>
          <SheetTitle>{isLoggedIn ? "Mon Compte" : "Connexion Client"}</SheetTitle>
          <SheetDescription>
            {isLoggedIn
              ? "Gérez vos informations et vos notifications"
              : "Connectez-vous pour recevoir des notifications sur les nouveaux produits"}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          {showSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CheckCircle2 className="mb-4 h-16 w-16 text-green-500" />
              <h3 className="mb-2 text-lg font-semibold">Connexion réussie!</h3>
              <p className="text-sm text-muted-foreground">Bienvenue {name}</p>
            </div>
          ) : isLoggedIn ? (
            <div className="space-y-6">
              <div className="rounded-lg border bg-gradient-to-br from-primary/5 to-accent/5 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{name}</p>
                    <p className="text-sm text-muted-foreground">{phone}</p>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Notifications WhatsApp</span>
                    <span className="font-medium text-green-600">Activées</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Vous recevrez des notifications pour les nouveaux produits
                  </p>
                </div>
              </div>

              <Button variant="outline" className="w-full gap-2 bg-transparent" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Se déconnecter
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet *</Label>
                <Input
                  id="name"
                  placeholder="Votre nom"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Numéro WhatsApp *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="237XXXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground">Format: code pays + numéro (ex: 237670123456)</p>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Inscription en cours..." : "Se connecter"}
              </Button>

              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-xs text-muted-foreground">
                  En vous connectant, vous acceptez de recevoir des notifications WhatsApp concernant les nouveaux
                  produits de ChristShop.
                </p>
              </div>
            </form>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}