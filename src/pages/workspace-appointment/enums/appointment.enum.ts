export const AppointmentReminderTargetMode = {
    SELECTED_PARTICIPANTS: 'selected_participants',
    ALL_PARTICIPANTS: 'all_participants'
} as const

export type AppointmentReminderTargetMode =
    (typeof AppointmentReminderTargetMode)[keyof typeof AppointmentReminderTargetMode]