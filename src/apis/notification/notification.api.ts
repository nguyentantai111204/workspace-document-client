import axiosInstance from '../../common/config/axios.config'
import {
    NotificationListResponse,
    NotificationQuery,
    RegisterDeviceRequest
} from './notification.interface'

export const listNotificationsApi = async (query?: NotificationQuery): Promise<NotificationListResponse> => {
    const response = await axiosInstance.get<NotificationListResponse>('/notifications', { params: query })
    return response.data
}

export const getUnreadCountApi = async (): Promise<number> => {
    const response = await axiosInstance.get<number>('/notifications/unread-count')
    return response.data
}

export const markAsReadApi = async (id: string): Promise<void> => {
    await axiosInstance.patch(`/notifications/${id}/read`)
}

export const markAllAsReadApi = async (): Promise<void> => {
    await axiosInstance.patch('/notifications/read-all')
}

export const registerDeviceApi = async (data: RegisterDeviceRequest): Promise<void> => {
    await axiosInstance.post('/notifications/device', data)
}
