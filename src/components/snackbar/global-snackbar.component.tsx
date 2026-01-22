import React from 'react'
import { Snackbar, Alert } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../redux/store.redux'
import { hideSnackbar } from '../../redux/system/system.slice'
import { RootState } from '../../redux/store.interface'

export const GlobalSnackbar: React.FC = () => {
    const dispatch = useAppDispatch()
    const snackbar = useAppSelector((state: RootState) => state.system.snackbar)

    if (!snackbar) return null

    const { open, message, severity } = snackbar

    const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return
        }
        dispatch(hideSnackbar())
    }

    return (
        <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            <Alert onClose={handleClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    )
}
