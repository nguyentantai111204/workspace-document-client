export interface SnackbarState {
    open: boolean
    message: string
    severity: 'success' | 'error' | 'info' | 'warning'
}

export interface SystemState {
    mode: 'light' | 'dark'
    snackbar: SnackbarState
    sidebarOpen: boolean
}
