import { BaseEntity } from "../common/common.interface"

export interface AppointmentParticipant {
    id: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
    appointmentId: string
    userId: string
    role: string // e.g. 'host', 'participant'
    reminderEnabled: boolean
    responseStatus: string // e.g. 'pending', 'accepted', 'declined'
    fullName?: string
    email?: string
    avatarUrl?: string
}

export interface AppointmentResponse extends BaseEntity {
    workspaceId: string
    title: string
    description: string | null
    url: string | null
    startTime: string
    endTime: string
    status: string
    createdBy: string
    updatedBy: string
    participants?: AppointmentParticipant[]
    reminders?: any[]
}

export interface AppointmentListResponse {
    success: boolean
    data: Record<string, AppointmentResponse[]>
    meta: any
    message: string
}

export interface AppointmentQuery {
    startDate?: string
    endDate?: string
}

export interface CreateAppointmentDto {
    title: string
    description?: string
    url?: string
    startTime: string // ISO string
    endTime: string // ISO string
    participants: { userId: string }[]
    reminder?: {
        minutesBefore: number
    }
}

export interface UpdateAppointmentDto extends Partial<CreateAppointmentDto> {
    status?: string
}
