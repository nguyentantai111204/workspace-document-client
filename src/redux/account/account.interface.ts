import type { UserProfile } from '../../apis/auth/auth.interface'

export type { UserProfile }

export interface AccountState {
    user: UserProfile | null
    token: string | null
    refreshToken: string | null
    isAuthenticated: boolean
    isLoading: boolean
    error: string | null
}
