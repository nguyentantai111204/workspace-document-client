import axiosInstance from '../../common/config/axios.config'
import { ChangePasswordRequest } from './user.interface'

export const changePasswordApi = async (data: ChangePasswordRequest): Promise<void> => {
    await axiosInstance.patch('/users/change-password', data)
}
