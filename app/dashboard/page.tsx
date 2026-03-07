"use client"

import { useAuth } from "@/lib/auth-context"
import { PatientDashboard } from "@/components/dashboard/patient-dashboard"
import { ProviderDashboard } from "@/components/dashboard/provider-dashboard"

export default function DashboardPage() {
  const { role, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading dashboard...</div>
      </div>
    )
  }

  if (role === "provider") {
    return <ProviderDashboard />
  }

  return <PatientDashboard />
}
