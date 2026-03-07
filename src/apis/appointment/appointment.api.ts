import axiosInstance from '../../common/config/axios.config'
import { AppointmentListResponse, AppointmentQuery, CreateAppointmentDto, AppointmentResponse } from './appointment.interface'

export const getWorkspaceAppointmentsApi = async (workspaceId: string, query?: AppointmentQuery): Promise<AppointmentListResponse> => {
    const response = await axiosInstance.get<AppointmentListResponse>(`/workspace/${workspaceId}/appointments`, { params: query })
    return response.data
}

export const createWorkspaceAppointmentApi = async (workspaceId: string, payload: CreateAppointmentDto): Promise<AppointmentResponse> => {
    const response = await axiosInstance.post<AppointmentResponse>(`/workspace/${workspaceId}/appointments`, payload)
    return response.data
}
