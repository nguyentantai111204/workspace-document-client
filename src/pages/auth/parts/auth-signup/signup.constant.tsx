import * as Yup from 'yup'

export const signupValidate = Yup.object({
    fullName: Yup.string().required('Tên tài khoản là bắt buộc'),
    email: Yup.string()
        .email('Email không hợp lệ')
        .required('Email là bắt buộc'),
    password: Yup.string()
        .min(6, 'Mật khẩu phải ít nhất 6 kí tự')
        .required('Mật khẩu là bắt buộc'),
})
