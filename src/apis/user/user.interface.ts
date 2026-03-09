import { BaseEntity } from '../common/common.interface';

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface UpdateProfileRequest {
    fullName?: string;
    phoneNumber?: string;
    address?: string;
    avatar?: File;
}

export interface UserSearchQuery {
    email?: string;
    page?: number;
    limit?: number;
}

export interface UserResponse extends BaseEntity {
    id: string;
    email: string;
    fullName: string;
    avatarUrl: string | null;
    phoneNumber?: string;
    address?: string;
}

