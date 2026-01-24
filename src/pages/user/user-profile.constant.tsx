import * as Yup from 'yup'

export const validationSchema = Yup.object().shape({
    currentPassword: Yup.string()
        .required('Vui lòng nhập mật khẩu hiện tại'),
    newPassword: Yup.string()
        .required('Vui lòng nhập mật khẩu mới'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), undefined], 'Mật khẩu không khớp')
        .required('Vui lòng xác nhận mật khẩu mới'),
})