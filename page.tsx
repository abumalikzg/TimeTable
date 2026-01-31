"use client"

import { useSchedule } from "@/hooks/use-schedule"
import { ActivePeriodCard } from "@/components/active-period-card"
import { ScheduleSettings } from "@/components/schedule-settings"
import { WeeklyTimetable } from "@/components/weekly-timetable"
import { GraduationCap } from "lucide-react"

export default function Home() {
  const {
    schedule,
    weekSchedule,
    currentPeriod,
    nextPeriod,
    remainingTime,
    isLoaded,
    updatePeriodData,
    getPeriodData,
    getCurrentDayData,
  } = useSchedule()

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">جاري التحميل...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <header className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3">
            <GraduationCap className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">جدول المعلم</h1>
          </div>
          <p className="text-muted-foreground">تتبع حصصك مع العد التنازلي المباشر</p>
        </header>

        {/* Active Period Card */}
        <ActivePeriodCard
          currentPeriod={currentPeriod}
          nextPeriod={nextPeriod}
          remainingTime={remainingTime}
          teacherData={getCurrentDayData()}
        />

        {/* Weekly Timetable */}
        <WeeklyTimetable schedule={schedule} weekSchedule={weekSchedule} getPeriodData={getPeriodData} />

        {/* Settings FAB */}
        <ScheduleSettings schedule={schedule} weekSchedule={weekSchedule} onUpdatePeriod={updatePeriodData} />
      </div>
    </main>
  )
}
