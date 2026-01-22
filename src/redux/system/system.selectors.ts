import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '../store.interface'

const selectSystemState = (state: RootState) => state.system

export const selectSystemMode = createSelector(
    selectSystemState,
    (system) => system.mode
)
