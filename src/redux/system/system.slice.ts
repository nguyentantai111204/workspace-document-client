
import { createSlice } from '@reduxjs/toolkit'
import type { SystemState } from './system.interface'


const initialState: SystemState = {
    mode: 'light',
    snackbar: {
        open: false,
        message: '',
        severity: 'info',
    },
    sidebarOpen: true,
}

export const systemSlice = createSlice({
    name: 'system',
    initialState,

    reducers: {
        setMode: (state, action) => {
            state.mode = action.payload
        },
        showSnackbar: (state, action: { payload: { message: string, severity?: 'success' | 'error' | 'info' | 'warning' } }) => {
            state.snackbar.open = true
            state.snackbar.message = action.payload.message
            state.snackbar.severity = action.payload.severity || 'info'
        },
        hideSnackbar: (state) => {
            state.snackbar.open = false
        },
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen
        },
        setSidebarOpen: (state, action: { payload: boolean }) => {
            state.sidebarOpen = action.payload
        }
    },
})

export const { setMode, showSnackbar, hideSnackbar, toggleSidebar, setSidebarOpen } = systemSlice.actions
export default systemSlice.reducer
