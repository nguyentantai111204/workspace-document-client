import axiosInstance from '../../common/config/axios.config'
import { ChangePasswordRequest, UserResponse, UserSearchQuery } from './user.interface'

export const changePasswordApi = async (data: ChangePasswordRequest): Promise<void> => {
    await axiosInstance.patch('/users/change-password', data)
}

export const searchUsersApi = async (query: UserSearchQuery): Promise<UserResponse[]> => {
    const response = await axiosInstance.get('/users/search', { params: query })

    // Kiểm tra tất cả các trường hợp có thể xảy ra của response structure
    // Backend return { items: [], meta: {} } bọc trong response wrapper { status, message, data }
    const resData = response.data?.data || response.data
    const items = resData?.items || resData

    return Array.isArray(items) ? items : []
}

