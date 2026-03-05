import axiosInstance from '../../common/config/axios.config'
import { ChangePasswordRequest, UpdateProfileRequest, UserResponse, UserSearchQuery } from './user.interface'
import { UserProfile } from '../auth/auth.interface'

export const changePasswordApi = async (data: ChangePasswordRequest): Promise<void> => {
    await axiosInstance.patch('/users/change-password', data)
}

export const updateProfileApi = async (data: UpdateProfileRequest): Promise<UserProfile> => {
    const formData = new FormData()
    if (data.fullName !== undefined) formData.append('fullName', data.fullName)
    if (data.phoneNumber !== undefined) formData.append('phoneNumber', data.phoneNumber)
    if (data.address !== undefined) formData.append('address', data.address)
    if (data.avatar) formData.append('avatar', data.avatar)

    const response = await axiosInstance.patch<UserProfile>('/users/me', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
}

export const searchUsersApi = async (query: UserSearchQuery): Promise<UserResponse[]> => {
    const response = await axiosInstance.get('/users/search', { params: query })

    const resData = response.data?.data || response.data
    const items = resData?.items || resData

    return Array.isArray(items) ? items : []
}

