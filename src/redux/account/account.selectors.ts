import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '../store.interface'

// Base selector
const selectAccountState = (state: RootState) => state.account

export const selectCurrentUser = createSelector(
    selectAccountState,
    (account) => account.user
)

export const selectAuthToken = createSelector(
    selectAccountState,
    (account) => account.token
)

export const selectIsAuthenticated = createSelector(
    selectAccountState,
    (account) => account.isAuthenticated
)

export const selectAccountLoading = createSelector(
    selectAccountState,
    (account) => account.isLoading
)

export const selectAccountError = createSelector(
    selectAccountState,
    (account) => account.error
)
