import axiosInstance from '../../common/config/axios.config'
import { LoginRequest, LoginResponse, RefreshTokenRequest, RefreshTokenResponse, UserProfile, RegisterRequest } from './auth.interface'

export const loginApi = async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>('/auth/login', data)
    return response.data
}

export const logoutApi = async (refreshToken: string): Promise<void> => {
    await axiosInstance.post('/auth/logout', { refreshToken })
}

export const refreshTokenApi = async (data: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
    const response = await axiosInstance.post<RefreshTokenResponse>('/auth/refresh', data)
    return response.data
}

export const getProfileApi = async (): Promise<UserProfile> => {
    const response = await axiosInstance.get<UserProfile>('/users/me')
    return response.data
}

export const registerApi = async (data: RegisterRequest): Promise<void> => {
    await axiosInstance.post('/auth/register', data)
}

export const logoutAllApi = async (): Promise<void> => {
    await axiosInstance.post('/auth/logout-all')
}
