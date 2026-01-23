export interface LoginRequest {
    email?: string;
    password?: string;
}

export interface LoginResponse {
    accessToken: string
    refreshToken: string
    user: UserProfile
}

export interface UserProfile {
    id: string
    email: string
    fullName: string
    avatarUrl: string | null
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface RefreshTokenResponse {
    accessToken: string
    refreshToken: string
}

export interface RegisterRequest {
    email: string
    password: string
    fullName: string
}

export interface LogoutRequest {
    refreshToken: string
}
