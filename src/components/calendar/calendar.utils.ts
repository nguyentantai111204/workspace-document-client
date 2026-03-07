import dayjs from 'dayjs'
import { CalendarEvent } from './calendar.interface'

export const getCalendarWeeks = (currentMonth: dayjs.Dayjs) => {
    const startDate = currentMonth.startOf('month').startOf('week')
    const endDate = currentMonth.endOf('month').endOf('week')

    const days: dayjs.Dayjs[] = []
    let day = startDate

    while (day.isBefore(endDate, 'day') || day.isSame(endDate, 'day')) {
        days.push(day)
        day = day.add(1, 'day')
    }

    const weeks: dayjs.Dayjs[][] = []
    for (let i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i, i + 7))
    }

    return { days, weeks }
}

export const groupEventsByDate = (events: CalendarEvent[]) => {
    const map: Record<string, CalendarEvent[]> = {}

    for (const event of events) {
        if (!map[event.date]) map[event.date] = []
        map[event.date].push(event)
    }

    Object.keys(map).forEach((date) => {
        map[date].sort((a, b) => {
            if (!a.startTime && !b.startTime) return 0
            if (!a.startTime) return 1
            if (!b.startTime) return -1

            return dayjs(a.startTime).valueOf() - dayjs(b.startTime).valueOf()
        })
    })

    return map
}

export const WEEK_DAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']