import { useAppDispatch } from '../redux/store.redux'
import { showSnackbar } from '../redux/system/system.slice'

export const useSnackbar = () => {
    const dispatch = useAppDispatch()

    const openSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'info') => {
        dispatch(showSnackbar({ message, severity }))
    }

    const showSuccess = (message: string) => {
        openSnackbar(message, 'success')
    }

    const showError = (message: string) => {
        openSnackbar(message, 'error')
    }

    const showInfo = (message: string) => {
        openSnackbar(message, 'info')
    }

    const showWarning = (message: string) => {
        openSnackbar(message, 'warning')
    }

    return {
        showSuccess,
        showError,
        showInfo,
        showWarning,
    }
}
