import React, { useMemo, useState } from 'react'
import { Box, Typography, IconButton, Stack, alpha, useTheme } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import AddIcon from '@mui/icons-material/Add'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import { StackColumn, StackRowAlignCenterJustBetween } from '../mui-custom/stack/stack.mui-custom'
import { CalendarProps } from './calendar.interface'
import { getCalendarWeeks, groupEventsByDate, WEEK_DAYS } from './calendar.utils'

dayjs.locale('vi')

export const CalendarComponent: React.FC<CalendarProps> = ({
    events,
    onEventClick,
    onDateClick,
    currentMonth: externalCurrentMonth,
    onMonthChange,
    onAddEventClick
}) => {
    const theme = useTheme()
    const [internalCurrentMonth, setInternalCurrentMonth] = useState(dayjs())

    const currentMonth = externalCurrentMonth || internalCurrentMonth

    const handlePrevMonth = () => {
        const newMonth = currentMonth.subtract(1, 'month')
        if (onMonthChange) onMonthChange(newMonth)
        else setInternalCurrentMonth(newMonth)
    }

    const handleNextMonth = () => {
        const newMonth = currentMonth.add(1, 'month')
        if (onMonthChange) onMonthChange(newMonth)
        else setInternalCurrentMonth(newMonth)
    }

    const { weeks } = useMemo(() => getCalendarWeeks(currentMonth), [currentMonth])

    const weekDays = WEEK_DAYS

    const eventsByDate = useMemo(() => groupEventsByDate(events), [events])

    return (
        <StackColumn
            sx={{
                height: '100%',
            }}
        >
            <StackRowAlignCenterJustBetween sx={{ mb: 3 }}>
                <Typography variant="h4" sx={{ textTransform: 'capitalize' }}>
                    Tháng {currentMonth.format('M, YYYY')}
                </Typography>
                <StackRowAlignCenterJustBetween gap={1}>
                    <IconButton onClick={handlePrevMonth} sx={{ border: `1px solid ${theme.palette.divider}` }} size="small">
                        <ChevronLeftIcon />
                    </IconButton>
                    <IconButton onClick={handleNextMonth} sx={{ border: `1px solid ${theme.palette.divider}` }} size="small">
                        <ChevronRightIcon />
                    </IconButton>
                </StackRowAlignCenterJustBetween>
            </StackRowAlignCenterJustBetween>

            <StackColumn sx={{ flex: 1, overflowX: 'auto' }}>
                <StackColumn sx={{ flex: 1, borderTop: `1px solid ${theme.palette.divider}` }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                        {weekDays.map(day => (
                            <Box key={day} sx={{ py: { xs: 1, sm: 2 }, px: { xs: 0.5, sm: 1 }, textAlign: 'center', fontWeight: 600, color: 'text.secondary', fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                                {day}
                            </Box>
                        ))}
                    </Box>

                    <StackColumn sx={{ flex: 1 }}>
                        {weeks.map((week, weekIndex) => (
                            <Box key={weekIndex} sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', flex: 1, borderBottom: `1px solid ${theme.palette.divider}` }}>
                                {week.map((day, dayIndex) => {
                                    const isCurrentMonth = day.month() === currentMonth.month()
                                    const isToday = day.isSame(dayjs(), 'day')
                                    const dateStr = day.format('YYYY-MM-DD')
                                    const dayEvents = eventsByDate[dateStr] || []

                                    return (
                                        <Box
                                            key={dayIndex}
                                            onClick={() => {
                                                if (onDateClick) onDateClick(day)
                                                else if (onAddEventClick) onAddEventClick(day)
                                            }}
                                            sx={{
                                                p: { xs: 0.5, sm: 1.5 },
                                                borderRight: dayIndex === 6 ? 'none' : `1px solid ${theme.palette.divider}`,
                                                bgcolor: isCurrentMonth ? 'transparent' : alpha(theme.palette.action.hover, 0.03),
                                                minHeight: { xs: 80, sm: 120 },
                                                minWidth: 0,
                                                overflow: 'hidden',
                                                transition: 'background-color 0.2s',
                                                cursor: (onDateClick || onAddEventClick) ? 'pointer' : 'default',
                                                '&:hover': {
                                                    bgcolor: alpha(theme.palette.action.hover, 0.1)
                                                },
                                                '&:hover .add-event-btn': {
                                                    opacity: 1
                                                }
                                            }}
                                        >
                                            <StackRowAlignCenterJustBetween sx={{ mb: { xs: 0.5, sm: 1 } }}>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        width: { xs: 20, sm: 28 },
                                                        height: { xs: 20, sm: 28 },
                                                        fontSize: { xs: '0.7rem', sm: '0.875rem' },
                                                        borderRadius: '50%',
                                                        color: isToday ? 'primary.contrastText' : (isCurrentMonth ? 'text.primary' : 'text.disabled'),
                                                        bgcolor: isToday ? 'primary.main' : 'transparent',
                                                        fontWeight: isToday ? 'bold' : 'normal'
                                                    }}
                                                >
                                                    {day.date()}
                                                </Typography>
                                                {onAddEventClick && (
                                                    <IconButton
                                                        className="add-event-btn"
                                                        size="small"
                                                        sx={{
                                                            opacity: 0,
                                                            display: { xs: 'none', sm: 'inline-flex' },
                                                            transition: 'opacity 0.2s',
                                                            color: 'text.secondary',
                                                            p: 0.5,
                                                            '&:hover': { color: 'primary.main' }
                                                        }}
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            onAddEventClick(day)
                                                        }}
                                                    >
                                                        <AddIcon fontSize="small" />
                                                    </IconButton>
                                                )}
                                            </StackRowAlignCenterJustBetween>

                                            <Stack spacing={0.5}>
                                                {dayEvents.slice(0, 3).map(event => (
                                                    <Box
                                                        key={event.id}
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            onEventClick?.(event)
                                                        }}
                                                        sx={{
                                                            px: { xs: 0.5, sm: 1 },
                                                            py: { xs: 0.25, sm: 0.5 },
                                                            borderRadius: 1,
                                                            bgcolor: event.color ? alpha(event.color, 0.15) : alpha(theme.palette.primary.main, 0.15),
                                                            color: event.color ? event.color : 'primary.dark',
                                                            fontSize: { xs: '0.625rem', sm: '0.75rem' },
                                                            fontWeight: 600,
                                                            cursor: 'pointer',
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            borderLeft: `2px solid ${event.color || theme.palette.primary.main}`,
                                                        }}
                                                    >
                                                        <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>
                                                            {event.startTime ? dayjs(event.startTime).format('HH:mm') + ' - ' : ''}
                                                        </Box>
                                                        {event.title}
                                                    </Box>
                                                ))}
                                                {dayEvents.length > 3 && (
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            pl: 1,
                                                            color: 'text.secondary',
                                                            fontWeight: 600,
                                                            fontSize: { xs: '0.625rem', sm: '0.75rem' },
                                                            cursor: 'pointer',
                                                            '&:hover': {
                                                                color: 'primary.main'
                                                            }
                                                        }}
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            onDateClick?.(day)
                                                        }}
                                                    >
                                                        + {dayEvents.length - 3} nữa
                                                    </Typography>
                                                )}
                                            </Stack>
                                        </Box>
                                    )
                                })}
                            </Box>
                        ))}
                    </StackColumn>
                </StackColumn>
            </StackColumn>
        </StackColumn>
    )
}
