import axiosInstance from '../../common/config/axios.config'
import { LoginRequest, LoginResponse, RefreshTokenRequest, RefreshTokenResponse, UserProfile } from './auth.interface'

export const loginApi = async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>('/auth/login', data)
    return response.data
}

export const logoutApi = async (): Promise<void> => {
    await axiosInstance.post('/auth/logout')
}

export const refreshTokenApi = async (data: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
    const response = await axiosInstance.post<RefreshTokenResponse>('/auth/refresh-token', data)
    return response.data
}

export const getProfileApi = async (): Promise<UserProfile> => {
    const response = await axiosInstance.get<UserProfile>('/auth/profile')
    return response.data
}
