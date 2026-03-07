import axiosInstance from '../../common/config/axios.config'
import { AppointmentListResponse, AppointmentQuery } from './appointment.interface'

export const getWorkspaceAppointmentsApi = async (workspaceId: string, query?: AppointmentQuery): Promise<AppointmentListResponse> => {
    const response = await axiosInstance.get<AppointmentListResponse>(`/workspace/${workspaceId}/appointments`, { params: query })
    return response.data
}
