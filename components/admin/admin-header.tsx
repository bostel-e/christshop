"use client"

import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AdminHeaderProps {
  onLogout: () => void
}

export function AdminHeader({ onLogout }: AdminHeaderProps) {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">ChristShop Admin</h1>
          <p className="text-sm text-muted-foreground">Panneau d'administration</p>
        </div>
        <Button variant="outline" onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Déconnexion
        </Button>
      </div>
    </header>
  )
}
