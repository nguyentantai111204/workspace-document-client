import axiosInstance from '../../common/config/axios.config'
import {
    CreateWorkspaceRequest,
    WorkspaceResponse,
    WorkspaceListResponse,
    WorkspaceQuery,
    MemberResponse,
    MemberQuery,
    InviteMemberRequest,
    UpdateRoleRequest,
    InviteResponse,
    AcceptInviteRequest,
    UpdateWorkSpaceRequest
} from './workspace.interface'

// Workspace CRUD
export const createWorkspaceApi = async (data: CreateWorkspaceRequest): Promise<WorkspaceResponse> => {
    const response = await axiosInstance.post<WorkspaceResponse>('/workspaces', data)
    return response.data
}

export const listWorkspacesApi = async (query?: WorkspaceQuery): Promise<WorkspaceListResponse> => {
    const response = await axiosInstance.get<WorkspaceListResponse>('/workspaces', { params: query })
    return response.data
}

export const getWorkspaceDetailApi = async (workspaceId: string): Promise<WorkspaceResponse> => {
    const response = await axiosInstance.get<WorkspaceResponse>(`/workspaces/${workspaceId}`)
    return response.data
}

// Members
export const listMembersApi = async (workspaceId: string, query?: MemberQuery) => {
    const response = await axiosInstance.get(`/workspaces/${workspaceId}/members`, { params: query })
    return response.data
}

export const updateMemberRoleApi = async (workspaceId: string, data: UpdateRoleRequest): Promise<void> => {
    await axiosInstance.patch(`/workspaces/${workspaceId}/members/role`, data)
}

// Invites
export const inviteMemberApi = async (workspaceId: string, data: InviteMemberRequest): Promise<void> => {
    await axiosInstance.post(`/workspaces/${workspaceId}/invites`, data)
}

export const listInvitesApi = async (workspaceId: string): Promise<InviteResponse[]> => {
    const response = await axiosInstance.get<InviteResponse[]>(`/workspaces/${workspaceId}/invites`)
    return response.data
}

export const revokeInviteApi = async (workspaceId: string, inviteId: string): Promise<void> => {
    await axiosInstance.delete(`/workspaces/${workspaceId}/invites/${inviteId}`)
}

export const acceptInviteApi = async (data: AcceptInviteRequest): Promise<void> => {
    await axiosInstance.post('/workspaces/invites/accept', data)
}

export const updateWorkspaceApi = async (workspaceId: string, data: UpdateWorkSpaceRequest): Promise<WorkspaceResponse> => {
    const response = await axiosInstance.patch<WorkspaceResponse>(`/workspaces/${workspaceId}`, data)
    return response.data
}