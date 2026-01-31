export interface Period {
  id: number
  name: string
  nameAr: string
  startTime: string
  endTime: string
  isBreak?: boolean
}

export interface TeacherInput {
  subject: string
  className: string
}

export interface DaySchedule {
  [periodId: number]: TeacherInput
}

export interface WeekSchedule {
  [day: string]: DaySchedule
}

export const DAYS = [
  { id: "sunday", nameAr: "الأحد" },
  { id: "monday", nameAr: "الإثنين" },
  { id: "tuesday", nameAr: "الثلاثاء" },
  { id: "wednesday", nameAr: "الأربعاء" },
  { id: "thursday", nameAr: "الخميس" },
]

export const PERIOD_NAMES_AR = [
  "الحصة الأولى",
  "الحصة الثانية",
  "الحصة الثالثة",
  "الحصة الرابعة",
  "الحصة الخامسة",
  "الحصة السادسة",
  "الحصة السابعة",
]

// -----------------------------
//  جدول يوم الأحد (إشراف)
// -----------------------------
export const SUNDAY_SCHEDULE: Period[] = [
  { id: 1, name: "Period 1", nameAr: "الحصة الأولى", startTime: "07:30", endTime: "08:15" },
  { id: 2, name: "Period 2", nameAr: "الحصة الثانية", startTime: "08:15", endTime: "09:00" },

  // الفسحة = إشراف
  { id: 0, name: "Recess", nameAr: "إشراف", startTime: "09:00", endTime: "09:20", isBreak: true },

  { id: 3, name: "Period 3", nameAr: "الحصة الثالثة", startTime: "09:20", endTime: "10:05" },
  { id: 4, name: "Period 4", nameAr: "الحصة الرابعة", startTime: "10:05", endTime: "10:50" },
  { id: 5, name: "Period 5", nameAr: "الحصة الخامسة", startTime: "10:50", endTime: "11:35" },
  { id: 6, name: "Period 6", nameAr: "الحصة السادسة", startTime: "11:35", endTime: "12:20" },
  { id: 7, name: "Period 7", nameAr: "الحصة السابعة", startTime: "12:20", endTime: "13:05" },
]

// -----------------------------
//  جدول باقي الأيام
// -----------------------------
export const DEFAULT_SCHEDULE: Period[] = [
  { id: 1, name: "Period 1", nameAr: "الحصة الأولى", startTime: "07:30", endTime: "08:15" },
  { id: 2, name: "Period 2", nameAr: "الحصة الثانية", startTime: "08:15", endTime: "09:00" },

  // الفسحة العادية
  { id: 0, name: "Recess", nameAr: "الفسحة", startTime: "09:00", endTime: "09:20", isBreak: true },

  { id: 3, name: "Period 3", nameAr: "الحصة الثالثة", startTime: "09:20", endTime: "10:05" },
  { id: 4, name: "Period 4", nameAr: "الحصة الرابعة", startTime: "10:05", endTime: "10:50" },
  { id: 5, name: "Period 5", nameAr: "الحصة الخامسة", startTime: "10:50", endTime: "11:35" },
  { id: 6, name: "Period 6", nameAr: "الحصة السادسة", startTime: "11:35", endTime: "12:20" },
  { id: 7, name: "Period 7", nameAr: "الحصة السابعة", startTime: "12:20", endTime: "13:05" },
]

// -----------------------------
//  اختيار الجدول حسب اليوم
// -----------------------------
export function getScheduleForDay(dayId: string): Period[] {
  if (dayId === "sunday") return SUNDAY_SCHEDULE
  return DEFAULT_SCHEDULE
}

// -----------------------------
//  دوال مساعدة (بدون تغيير)
// -----------------------------
export function parseTime(timeStr: string): { hours: number; minutes: number } {
  const [hours, minutes] = timeStr.split(":").map(Number)
  return { hours, minutes }
}

export function timeToMinutes(timeStr: string): number {
  const { hours, minutes } = parseTime(timeStr)
  return hours * 60 + minutes
}

export function getCurrentPeriod(schedule: Period[], now: Date): Period | null {
  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  for (const period of schedule) {
    const startMinutes = timeToMinutes(period.startTime)
    const endMinutes = timeToMinutes(period.endTime)

    if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
      return period
    }
  }

  return null
}

export function getNextPeriod(schedule: Period[], now: Date): Period | null {
  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  for (const period of schedule) {
    const startMinutes = timeToMinutes(period.startTime)

    if (currentMinutes < startMinutes) {
      return period
    }
  }

  return null
}

export function getRemainingTime(endTime: string, now: Date): { minutes: number; seconds: number } {
  const { hours: endHours, minutes: endMinutes } = parseTime(endTime)
  const endDate = new Date(now)
  endDate.setHours(endHours, endMinutes, 0, 0)

  const diffMs = endDate.getTime() - now.getTime()

  if (diffMs <= 0) {
    return { minutes: 0, seconds: 0 }
  }

  const totalSeconds = Math.floor(diffMs / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return { minutes, seconds }
}

export function isWorkDay(date: Date): boolean {
  const day = date.getDay()
  return day >= 0 && day <= 4
}

export function getCurrentDayId(date: Date): string {
  const dayMap: { [key: number]: string } = {
    0: "sunday",
    1: "monday",
    2: "tuesday",
    3: "wednesday",
    4: "thursday",
  }
  return dayMap[date.getDay()] || ""
}

export function formatTime(timeStr: string): string {
  const { hours, minutes } = parseTime(timeStr)
  const period = hours >= 12 ? "م" : "ص"
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`
}