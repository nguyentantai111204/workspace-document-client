
import { Formik, Form, type FormikHelpers } from 'formik'
import { Typography, Link, Box, InputLabel } from '@mui/material'

import { loginValidate } from './login.constant'

import { TextFieldComponent } from '../../../../components/textfield/text-field.component'
import { TextFieldPasswordComponent } from '../../../../components/textfield/text-field-password.component'
import { CheckboxComponent } from '../../../../components/checkbox/checkbox.component'
import { ButtonComponent } from '../../../../components/button/button.component'

import {
    StackRowAlignCenterJustBetween,
} from '../../../../components/mui-custom/stack/stack.mui-custom'

import { AuthHeader } from '../auth-header.part'
import { getDeviceId } from '../../../../common/utils/device.utils'

import { useAppDispatch } from '../../../../redux/store.redux'
import { login } from '../../../../redux/account/account.action'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from '../../../../hooks/use-snackbar.hook'
import { LoginPayload } from '../../auth.interface'

const initialValues: LoginPayload = {
    email: '',
    password: '',
    remember: false,
}

export const LoginForm = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { showSuccess, showError } = useSnackbar()

    const handleSubmit = async (
        values: LoginPayload,
        { setSubmitting }: FormikHelpers<LoginPayload>,
    ) => {
        try {
            const deviceId = getDeviceId()
            // Exclude 'remember' because it's not in LoginRequest (API)
            const { remember, ...loginData } = values
            const result = await dispatch(login({ ...loginData, deviceId }))
            if (login.fulfilled.match(result)) {
                showSuccess('Đăng nhập thành công!')
                navigate('/workspace')
            } else if (login.rejected.match(result)) {
                const errorMsg = typeof result.payload === 'string' ? result.payload : 'Đăng nhập thất bại'
                showError(errorMsg)
            }
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={loginValidate}
            onSubmit={handleSubmit}
        >
            {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                setFieldValue,
                isSubmitting,
            }) => (
                <Form noValidate>
                    <Box width="100%">
                        <AuthHeader />
                        <Box mb={2}>
                            <InputLabel
                                sx={{
                                    mb: 0.5,
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: 'text.primary'
                                }}
                            >
                                Tên đăng nhập
                            </InputLabel>
                            <TextFieldComponent
                                sizeUI="sm"
                                name="email"
                                placeholder="Nhập tên đăng nhập"
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.email && !!errors.email}
                                helperText={touched.email && errors.email}
                            />
                        </Box>

                        <Box mb={2}>
                            <InputLabel
                                sx={{
                                    mb: 0.5,
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: 'text.primary'
                                }}
                            >
                                Mật khẩu
                            </InputLabel>
                            <TextFieldPasswordComponent
                                sizeUI="sm"
                                name="password"
                                placeholder="Nhập mật khẩu"
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.password && !!errors.password}
                                helperText={touched.password && errors.password}
                                fullWidth
                            />
                        </Box>

                        <StackRowAlignCenterJustBetween mt={1}>
                            <CheckboxComponent
                                sizeUI="sm"
                                label="Ghi nhớ thiết bị này"
                                checked={values.remember}
                                shape="square"
                                variant="outlined"
                                onChange={(e) =>
                                    setFieldValue(
                                        'remember',
                                        e.target.checked,
                                    )
                                }
                            />
                            <Link
                                href="/forgot-password"
                                underline="hover"
                                fontSize={13}
                                fontWeight={500}
                                color="primary.main"
                            >
                                Quên mật khẩu?
                            </Link>

                        </StackRowAlignCenterJustBetween>

                        <ButtonComponent
                            sizeUI="sm"
                            type="submit"
                            fullWidth
                            loading={isSubmitting}
                            sx={{ mt: 3, mb: 3 }}
                        >
                            Đăng nhập
                        </ButtonComponent>

                        <Box textAlign="center">
                            <Typography
                                variant="body2"
                                component="span"
                                fontSize={13}
                            >
                                Chưa có tài khoản?{' '}
                            </Typography>
                            <Link href="/register" underline="hover" fontWeight={500} fontSize={13}>
                                Tạo tài khoản ngay
                            </Link>
                        </Box>
                    </Box>
                </Form>
            )}
        </Formik >
    )
}
