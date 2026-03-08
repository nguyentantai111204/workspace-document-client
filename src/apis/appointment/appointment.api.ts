import axiosInstance from '../../common/config/axios.config'
import { AppointmentListResponse, AppointmentQuery, CreateAppointmentDto, AppointmentResponse, UpdateAppointmentDto } from './appointment.interface'

export const getWorkspaceAppointmentsApi = async (workspaceId: string, query?: AppointmentQuery): Promise<AppointmentListResponse> => {
    const response = await axiosInstance.get<AppointmentListResponse>(`/workspace/${workspaceId}/appointments`, { params: query })
    return response.data
}

export const createWorkspaceAppointmentApi = async (workspaceId: string, payload: CreateAppointmentDto): Promise<AppointmentResponse> => {
    const response = await axiosInstance.post<{ data: AppointmentResponse }>(`/workspace/${workspaceId}/appointments`, payload)
    return response.data.data
}

export const getAppointmentDetailApi = async (workspaceId: string, appointmentId: string): Promise<AppointmentResponse> => {
    const response = await axiosInstance.get<{ data: AppointmentResponse }>(`/workspace/${workspaceId}/appointments/${appointmentId}`)
    return response.data.data
}

export const updateAppointmentApi = async (workspaceId: string, appointmentId: string, payload: UpdateAppointmentDto): Promise<AppointmentResponse> => {
    const response = await axiosInstance.patch<{ data: AppointmentResponse }>(`/workspace/${workspaceId}/appointments/${appointmentId}`, payload)
    return response.data.data
}

export const deleteAppointmentApi = async (workspaceId: string, appointmentId: string): Promise<void> => {
    await axiosInstance.delete(`/workspace/${workspaceId}/appointments/${appointmentId}`)
}

export const acceptAppointmentApi = async (workspaceId: string, appointmentId: string): Promise<void> => {
    await axiosInstance.post(`/workspace/${workspaceId}/appointments/${appointmentId}/accept`)
}

export const rejectAppointmentApi = async (workspaceId: string, appointmentId: string): Promise<void> => {
    await axiosInstance.post(`/workspace/${workspaceId}/appointments/${appointmentId}/reject`)
}
