import { createSlice } from '@reduxjs/toolkit'
import type { AccountState } from './account.interface'
import { getProfile, login, logout, refreshToken, signup, updateProfile } from './account.action'

const initialState: AccountState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
}

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        clearAccountError: (state) => {
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.user = null
                state.isAuthenticated = false
                state.isLoading = false
                state.error = null
            })

            // Login
            .addCase(login.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false
                state.isAuthenticated = true
                state.user = action.payload.user
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false
                state.isAuthenticated = false
                state.user = null
                if (typeof action.payload === 'string') {
                    state.error = action.payload
                } else if (typeof action.payload === 'object' && action.payload !== null && 'message' in action.payload) {
                    state.error = (action.payload as any).message
                } else {
                    state.error = 'Login failed'
                }
            })

            // Signup
            .addCase(signup.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(signup.fulfilled, (state) => {
                state.isLoading = false
            })
            .addCase(signup.rejected, (state, action) => {
                state.isLoading = false
                if (typeof action.payload === 'string') {
                    state.error = action.payload
                } else if (typeof action.payload === 'object' && action.payload !== null && 'message' in action.payload) {
                    state.error = (action.payload as any).message
                } else {
                    state.error = 'Signup failed'
                }
            })

            // Get Profile
            .addCase(getProfile.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(getProfile.fulfilled, (state, action) => {
                state.isLoading = false
                state.user = action.payload
            })
            .addCase(getProfile.rejected, (state, action) => {
                state.isLoading = false
                if (typeof action.payload === 'string') {
                    state.error = action.payload
                } else if (typeof action.payload === 'object' && action.payload !== null && 'message' in action.payload) {
                    state.error = (action.payload as any).message
                } else {
                    state.error = 'Failed to fetch profile'
                }
            })

            // Refresh Token
            .addCase(refreshToken.fulfilled, () => {
                // No token to update, just success
            })
            .addCase(refreshToken.rejected, (state, action) => {
                if (typeof action.payload === 'string') {
                    state.error = action.payload
                } else if (typeof action.payload === 'object' && action.payload !== null && 'message' in action.payload) {
                    state.error = (action.payload as any).message
                } else {
                    state.error = 'Failed to refresh token'
                }
            })

            .addCase(updateProfile, (state, action) => {
                if (state.user) {
                    state.user = { ...state.user, ...action.payload }
                }
            })
    },
})

export const { clearAccountError } = accountSlice.actions
export default accountSlice.reducer
