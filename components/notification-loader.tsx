"use client"

import { useEffect } from "react"
import { scheduleDailyReminder } from "@/lib/notifications"

export function NotificationLoader() {
  useEffect(() => {
    // Schedule the daily reminder when the app mounts
    scheduleDailyReminder().catch(console.error)
  }, [])

  return null
}
