import * as Yup from 'yup'

export const loginValidate = Yup.object({
    email: Yup.string()
        .email('Email không hợp lệ')
        .required('Email là bắt buộc'),

    password: Yup.string()
        .required('Mật khẩu là bắt buộc'),
})
