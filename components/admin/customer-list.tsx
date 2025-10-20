"use client"

import { Trash2, Phone, User, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Customer {
  id: string
  name: string
  phone: string
  registeredAt: string
}

interface CustomerListProps {
  customers: Customer[]
  onDelete: (customerId: string) => void
}

export function CustomerList({ customers, onDelete }: CustomerListProps) {
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString))
  }

  if (customers.length === 0) {
    return (
      <Card>
        <CardContent className="flex min-h-[300px] items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-medium text-muted-foreground">Aucun client inscrit</p>
            <p className="text-sm text-muted-foreground">
              Les clients qui s'inscrivent aux notifications apparaîtront ici
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {customers.map((customer) => (
        <Card key={customer.id}>
          <CardContent className="p-6">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <User className="h-6 w-6 text-primary" />
              </div>
              <Button variant="ghost" size="icon" className="text-destructive" onClick={() => onDelete(customer.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <h3 className="mb-3 text-lg font-semibold">{customer.name}</h3>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{customer.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(customer.registeredAt)}</span>
              </div>
            </div>

            <Badge variant="secondary" className="mt-4">
              Notifications actives
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
