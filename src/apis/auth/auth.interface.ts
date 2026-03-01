export interface LoginRequest {
    email?: string;
    password?: string;
    deviceId?: string;
}

export interface LoginResponse {
    user: UserProfile
}

export interface UserProfile {
    id: string
    email: string
    fullName: string
    avatarUrl?: string
    status?: string
}

export interface RefreshTokenRequest { }

export interface RefreshTokenResponse { }

export interface RegisterRequest {
    email: string
    password: string
    fullName: string
    deviceId?: string;
}

export interface LogoutRequest { }
