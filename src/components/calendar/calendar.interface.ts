import dayjs from 'dayjs'
import { BaseEntity } from '../../apis/common/common.interface'

export interface CalendarEvent extends BaseEntity {
    title: string
    date: string // 'YYYY-MM-DD'
    startTime?: string
    endTime?: string
    status?: string
    color?: string
}

export interface CalendarProps {
    events: CalendarEvent[]
    onEventClick?: (event: CalendarEvent) => void
    onDateClick?: (date: dayjs.Dayjs) => void
    currentMonth?: dayjs.Dayjs
    onMonthChange?: (date: dayjs.Dayjs) => void
    onAddEventClick?: (date: dayjs.Dayjs) => void
}
