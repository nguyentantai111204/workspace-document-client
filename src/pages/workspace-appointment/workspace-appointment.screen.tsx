import { Box, Typography, CircularProgress, useTheme } from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import useSWR from 'swr'
import dayjs from 'dayjs'
import { CalendarComponent } from '../../components/calendar/calendar.component'
import { CalendarEvent } from '../../components/calendar/calendar.interface'
import { useMemo, useState } from 'react'
import { getWorkspaceAppointmentsApi } from '../../apis/appointment/appointment.api'
import { StackColumn } from '../../components/mui-custom/stack/stack.mui-custom'
import { AppointmentCreatePart } from './parts/appointment-create/appointment-create.part'

export const WorkspaceAppointmentPage = () => {
    const { workspaceId } = useParams()
    const navigate = useNavigate()
    const [currentMonth, setCurrentMonth] = useState(dayjs())
    const theme = useTheme()

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [selectedDateForCreation, setSelectedDateForCreation] = useState<dayjs.Dayjs | null>(null)

    const startDate = currentMonth.startOf('month').startOf('week').format('YYYY-MM-DD')
    const endDate = currentMonth.endOf('month').endOf('week').format('YYYY-MM-DD')

    const { data: appointmentRes, isLoading } = useSWR(
        workspaceId ? ['workspaceAppointments', workspaceId, startDate, endDate] : null,
        () => getWorkspaceAppointmentsApi(workspaceId as string, { startDate, endDate })
    )

    const events = useMemo<CalendarEvent[]>(() => {
        if (!appointmentRes?.data) return []

        return Object.entries(appointmentRes.data).flatMap(([dateStr, appointments]) =>
            appointments.map(appt => ({
                id: appt.id,
                title: appt.title,
                date: dateStr,
                startTime: appt.startTime,
                endTime: appt.endTime,
                status: appt.status,
                createdAt: appt.createdAt,
                updatedAt: appt.updatedAt,
                color: theme.palette.primary.main
            }))
        )
    }, [appointmentRes, theme.palette.primary.main])

    const handleAddEventClick = (date: dayjs.Dayjs) => {
        setSelectedDateForCreation(date)
        setIsCreateModalOpen(true)
    }

    return (
        <StackColumn sx={{ p: { xs: 2, md: 4 }, flex: 1, height: '100%' }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ mb: 1 }}>
                    Lịch hẹn dự án
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Quản lý các cuộc họp, lịch trình và sự kiện sắp tới.
                </Typography>
            </Box>

            <Box sx={{ flex: 1, minHeight: 600 }}>
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <CalendarComponent
                        events={events}
                        currentMonth={currentMonth}
                        onMonthChange={setCurrentMonth}
                        onEventClick={(event) => navigate(`/workspace/${workspaceId}/appointments/${event.id}`)}
                        onAddEventClick={handleAddEventClick}
                    />
                )}
            </Box>

            {workspaceId && (
                <AppointmentCreatePart
                    open={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    workspaceId={workspaceId}
                    selectedDate={selectedDateForCreation}
                />
            )}
        </StackColumn>
    )
}
