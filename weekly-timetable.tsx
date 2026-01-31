"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Period, WeekSchedule, TeacherInput } from "@/lib/schedule-utils"
import { DAYS, formatTime, getCurrentDayId, isWorkDay } from "@/lib/schedule-utils"
import { Calendar } from "lucide-react"

interface WeeklyTimetableProps {
  schedule: Period[]
  weekSchedule: WeekSchedule
  getPeriodData: (day: string, periodId: number) => TeacherInput | undefined
}

export function WeeklyTimetable({ schedule, weekSchedule, getPeriodData }: WeeklyTimetableProps) {
  const now = new Date()
  const currentDayId = getCurrentDayId(now)
  const periods = schedule.filter((p) => !p.isBreak)

  return (
    <Card className="bg-card border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Calendar className="h-5 w-5 text-primary" />
          الجدول الأسبوعي
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse">
          <thead>
            <tr>
              <th className="p-2 text-right text-sm font-semibold text-muted-foreground border-b">الحصة</th>
              {DAYS.map((day) => (
                <th
                  key={day.id}
                  className={`p-2 text-center text-sm font-semibold border-b ${
                    day.id === currentDayId && isWorkDay(now) ? "text-primary bg-primary/5" : "text-muted-foreground"
                  }`}
                >
                  {day.nameAr}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {periods.map((period) => (
              <tr key={period.id} className="hover:bg-secondary/30 transition-colors">
                <td className="p-2 border-b">
                  <div className="font-medium text-sm">{period.nameAr}</div>
                  <div className="text-xs text-muted-foreground">{formatTime(period.startTime)}</div>
                </td>
                {DAYS.map((day) => {
                  const data = getPeriodData(day.id, period.id)
                  const isToday = day.id === currentDayId && isWorkDay(now)
                  return (
                    <td
                      key={`${day.id}-${period.id}`}
                      className={`p-2 text-center border-b ${isToday ? "bg-primary/5" : ""}`}
                    >
                      {data && (data.subject || data.className) ? (
                        <div className="space-y-1">
                          {data.subject && <div className="text-sm font-medium">{data.subject}</div>}
                          {data.className && (
                            <Badge variant="secondary" className="text-xs">
                              {data.className}
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}
