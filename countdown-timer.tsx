"use client"

import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface CountdownTimerProps {
  minutes: number
  seconds: number
}

export function CountdownTimer({ minutes, seconds }: CountdownTimerProps) {
  const formattedMinutes = minutes.toString().padStart(2, "0")
  const formattedSeconds = seconds.toString().padStart(2, "0")
  
  // Determine color based on remaining time
  const totalMinutes = minutes + seconds / 60
  const isWarning = totalMinutes <= 10 && totalMinutes > 5 // Yellow: last 10 minutes
  const isUrgent = totalMinutes <= 5 // Red: last 5 minutes

  const timerColorClass = cn(
    "transition-colors duration-500",
    isUrgent 
      ? "text-red-500" 
      : isWarning 
        ? "text-amber-500" 
        : "text-foreground"
  )

  const iconColorClass = cn(
    "h-6 w-6 transition-colors duration-500",
    isUrgent 
      ? "text-red-500" 
      : isWarning 
        ? "text-amber-500" 
        : "text-primary"
  )

  return (
    <div className="flex items-center justify-center gap-3">
      <Clock className={iconColorClass} />
      <div className={cn("font-mono text-5xl md:text-6xl font-bold tracking-wider", timerColorClass)}>
        <span className="inline-block min-w-[2.5ch] text-center">{formattedMinutes}</span>
        <span className="animate-pulse">:</span>
        <span className="inline-block min-w-[2.5ch] text-center">{formattedSeconds}</span>
      </div>
    </div>
  )
}
