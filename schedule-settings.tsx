"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Save } from "lucide-react"
import type { Period, WeekSchedule, TeacherInput } from "@/lib/schedule-utils"
import { DAYS, formatTime } from "@/lib/schedule-utils"

interface ScheduleSettingsProps {
  schedule: Period[]
  weekSchedule: WeekSchedule
  onUpdatePeriod: (day: string, periodId: number, data: TeacherInput) => void
}

export function ScheduleSettings({ schedule, weekSchedule, onUpdatePeriod }: ScheduleSettingsProps) {
  const [open, setOpen] = useState(false)
  const [localSchedule, setLocalSchedule] = useState<WeekSchedule>({})
  const [activeDay, setActiveDay] = useState(DAYS[0].id)

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setLocalSchedule(JSON.parse(JSON.stringify(weekSchedule)))
    }
    setOpen(isOpen)
  }

  const handleInputChange = (day: string, periodId: number, field: "subject" | "className", value: string) => {
    setLocalSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [periodId]: {
          ...prev[day]?.[periodId],
          [field]: value,
        },
      },
    }))
  }

  const handleSave = () => {
    Object.entries(localSchedule).forEach(([day, periods]) => {
      Object.entries(periods).forEach(([periodId, data]) => {
        onUpdatePeriod(day, Number.parseInt(periodId), data as TeacherInput)
      })
    })
    setOpen(false)
  }

  const periods = schedule.filter((p) => !p.isBreak)

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-6 left-6 h-14 w-14 rounded-full shadow-lg z-50 bg-transparent"
        >
          <Settings className="h-6 w-6" />
          <span className="sr-only">إعدادات الجدول</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">إعدادات الجدول</DialogTitle>
        </DialogHeader>

        <Tabs value={activeDay} onValueChange={setActiveDay} className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid grid-cols-5 mb-4">
            {DAYS.map((day) => (
              <TabsTrigger key={day.id} value={day.id} className="text-sm">
                {day.nameAr}
              </TabsTrigger>
            ))}
          </TabsList>

          {DAYS.map((day) => (
            <TabsContent key={day.id} value={day.id} className="flex-1 overflow-y-auto space-y-4 pr-2">
              {periods.map((period) => (
                <div key={period.id} className="bg-secondary/30 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-foreground">{period.nameAr}</h4>
                    <span className="text-sm text-muted-foreground">
                      {formatTime(period.startTime)} - {formatTime(period.endTime)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor={`${day.id}-${period.id}-subject`} className="text-sm">
                        المادة
                      </Label>
                      <Input
                        id={`${day.id}-${period.id}-subject`}
                        placeholder="مثال: رياضيات"
                        value={localSchedule[day.id]?.[period.id]?.subject || ""}
                        onChange={(e) => handleInputChange(day.id, period.id, "subject", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor={`${day.id}-${period.id}-class`} className="text-sm">
                        الصف / الفصل
                      </Label>
                      <Input
                        id={`${day.id}-${period.id}-class`}
                        placeholder="مثال: 3/أ"
                        value={localSchedule[day.id]?.[period.id]?.className || ""}
                        onChange={(e) => handleInputChange(day.id, period.id, "className", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
          ))}
        </Tabs>

        <div className="pt-4 border-t mt-4">
          <Button onClick={handleSave} className="w-full" size="lg">
            <Save className="h-5 w-5 ml-2" />
            حفظ التغييرات
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
