import { createAction, createAsyncThunk } from '@reduxjs/toolkit'
import type { LoginRequest, LoginResponse, UserProfile, RefreshTokenRequest, RefreshTokenResponse, RegisterRequest } from '../../apis/auth/auth.interface'
import { getProfileApi, loginApi, logoutApi, refreshTokenApi, registerApi } from '../../apis/auth/auth.api'

export const logout = createAsyncThunk('account/logout', async (_, { rejectWithValue, getState }) => {
    try {
        const state = getState() as any
        const refreshToken = state.account.refreshToken
        if (refreshToken) {
            await logoutApi(refreshToken)
        }
        return true
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || error.message || 'Logout failed')
    }
}
)

export const login = createAsyncThunk<LoginResponse, LoginRequest>(
    'account/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const data = await loginApi(credentials)
            return data
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Login failed')
        }
    }
)

export const signup = createAsyncThunk<void, RegisterRequest>(
    'account/signup',
    async (data, { rejectWithValue }) => {
        try {
            await registerApi(data)
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Signup failed')
        }
    }
)

export const getProfile = createAsyncThunk<UserProfile>(
    'account/getProfile',
    async (_, { rejectWithValue }) => {
        try {
            const data = await getProfileApi()
            return data
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Get profile failed')
        }
    }
)

export const refreshToken = createAsyncThunk<RefreshTokenResponse, RefreshTokenRequest>(
    'account/refreshToken',
    async (data, { rejectWithValue }) => {
        try {
            const response = await refreshTokenApi(data)
            return response
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Refresh token failed')
        }
    }
)

export const updateProfile = createAction<Partial<UserProfile>>('account/updateProfile')
