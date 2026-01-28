export interface SnackbarState {
    open: boolean
    message: string
    severity: 'success' | 'error' | 'info' | 'warning'
}

export interface SystemState {
    snackbar: SnackbarState
    sidebarOpen: boolean
}
