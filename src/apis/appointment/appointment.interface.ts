import { BaseEntity } from "../common/common.interface"

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

