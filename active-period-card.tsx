"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CountdownTimer } from "./countdown-timer"
import type { Period, TeacherInput } from "@/lib/schedule-utils"
import { formatTime, isWorkDay } from "@/lib/schedule-utils"
import { Coffee, BookOpen, Clock } from "lucide-react"

interface ActivePeriodCardProps {
  currentPeriod: Period | null
  nextPeriod: Period | null
  remainingTime: { minutes: number; seconds: number }
  teacherData?: TeacherInput
}

export function ActivePeriodCard({ currentPeriod, nextPeriod, remainingTime, teacherData }: ActivePeriodCardProps) {
  const now = new Date()
  const isWorkingDay = isWorkDay(now)

  if (!isWorkingDay) {
    return (
      <Card className="bg-card border-2 border-border shadow-lg">
        <CardContent className="p-6 md:p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <Coffee className="h-16 w-16 text-muted-foreground" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">يوم عطلة</h2>
            <p className="text-muted-foreground text-lg">استمتع بوقتك! نراك يوم الأحد</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!currentPeriod) {
    if (nextPeriod) {
      return (
        <Card className="bg-card border-2 border-border shadow-lg">
          <CardContent className="p-6 md:p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <Clock className="h-12 w-12 text-muted-foreground" />
              <h2 className="text-xl md:text-2xl font-semibold text-foreground">في انتظار بداية الدوام</h2>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>الحصة القادمة:</span>
                <Badge variant="outline" className="text-base">
                  {nextPeriod.nameAr}
                </Badge>
                <span>تبدأ {formatTime(nextPeriod.startTime)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card className="bg-card border-2 border-border shadow-lg">
        <CardContent className="p-6 md:p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <Coffee className="h-16 w-16 text-muted-foreground" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">انتهى الدوام</h2>
            <p className="text-muted-foreground text-lg">أحسنت! نراك غداً إن شاء الله</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const isBreak = currentPeriod.isBreak

  return (
    <Card
      className={`border-2 shadow-lg transition-all duration-300 ${
        isBreak ? "bg-accent/30 border-accent" : "bg-primary/5 border-primary/30"
      }`}
    >
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col items-center gap-6">
          {/* Status Badge */}
          <Badge
            className={`text-lg px-4 py-1 ${
              isBreak ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"
            }`}
          >
            {isBreak ? "وقت الفسحة" : "حصة جارية"}
          </Badge>

          {/* Period Name */}
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{currentPeriod.nameAr}</h2>
            <p className="text-muted-foreground">
              {formatTime(currentPeriod.startTime)} - {formatTime(currentPeriod.endTime)}
            </p>
          </div>

          {/* Teacher Data (if not break) */}
          {!isBreak && teacherData && (teacherData.subject || teacherData.className) && (
            <div className="flex flex-wrap items-center justify-center gap-3 bg-secondary/50 rounded-lg p-4 w-full">
              {teacherData.subject && (
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span className="text-lg font-medium">{teacherData.subject}</span>
                </div>
              )}
              {teacherData.className && (
                <Badge variant="secondary" className="text-base px-3 py-1">
                  {teacherData.className}
                </Badge>
              )}
            </div>
          )}

          {/* Countdown Timer */}
          <div className="mt-2">
            <p className="text-muted-foreground text-center mb-3">
              {isBreak ? "تنتهي الفسحة خلال" : "تنتهي الحصة خلال"}
            </p>
            <CountdownTimer minutes={remainingTime.minutes} seconds={remainingTime.seconds} />
          </div>

          {/* Next Up */}
          {nextPeriod && (
            <div className="flex items-center gap-2 text-muted-foreground mt-4 pt-4 border-t border-border w-full justify-center">
              <span>التالي:</span>
              <Badge variant="outline">{nextPeriod.nameAr}</Badge>
              <span>في {formatTime(nextPeriod.startTime)}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
