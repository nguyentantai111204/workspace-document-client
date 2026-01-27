import { BaseEntity } from "../common/common.interface";

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
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
}

