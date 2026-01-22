
import { createSlice } from '@reduxjs/toolkit'
import type { SystemState } from './system.interface'


const initialState: SystemState = {
    mode: 'light',
    snackbar: {
        open: false,
        message: '',
        severity: 'info',
    },
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
        }
    },
})

export const { setMode, showSnackbar, hideSnackbar } = systemSlice.actions
export default systemSlice.reducer
