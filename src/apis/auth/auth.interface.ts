export interface LoginRequest {
    email?: string;
    password?: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: UserProfile;
}

export interface UserProfile {
    id: string;
    email: string;
    fullName: string;
    avatar?: string;
    role?: string;
    [key: string]: any;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
}
