import { Formik, Form, FormikHelpers } from 'formik'
import { Box, Typography, Link, InputLabel } from '@mui/material'
import { signupValidate } from './signup.constant'
import { TextFieldComponent } from '../../../../components/textfield/text-field.component'
import { TextFieldPasswordComponent } from '../../../../components/textfield/text-field-password.component'
import { ButtonComponent } from '../../../../components/button/button.component'
import { AuthHeader } from '../auth-header.part'
import { SignUpPayload } from '../../auth.interface'
import { useAppDispatch } from '../../../../redux/store.redux'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from '../../../../hooks/use-snackbar.hook'
import { signup } from '../../../../redux/account/account.action'

const initialValues: SignUpPayload = {
    fullName: '',
    email: '',
    password: '',
}


export const SignUpForm = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { showSuccess, showError } = useSnackbar()


    const onSubmit = async (values: SignUpPayload,
        { setSubmitting }: FormikHelpers<SignUpPayload>
    ) => {
        try {
            const result = await dispatch(signup(values))
            if (signup.fulfilled.match(result)) {
                showSuccess('Đăng ký thành công!')
                navigate('/login')
            } else if (signup.rejected.match(result)) {
                const errorMsg = typeof result.payload === 'string' ? result.payload : 'Đăng ký thất bại'
                showError(errorMsg)
            }
        } catch (error) {
            console.log(error)
            showError('Đã có lỗi xảy ra')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={signupValidate}
            onSubmit={onSubmit}
        >
            {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
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
                                Họ và tên
                            </InputLabel>
                            <TextFieldComponent
                                sizeUI="sm"
                                name="fullName"
                                placeholder="Nhập họ và tên"
                                value={values.fullName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.fullName && !!errors.fullName}
                                helperText={touched.fullName && errors.fullName}
                                fullWidth
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
                                Địa chỉ Email
                            </InputLabel>
                            <TextFieldComponent
                                sizeUI="sm"
                                placeholder="Nhập địa chỉ email"
                                name="email"
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.email && !!errors.email}
                                helperText={touched.email && errors.email}
                                fullWidth
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
                                placeholder="Nhập mật khẩu"
                                name="password"
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.password && !!errors.password}
                                helperText={touched.password && errors.password}
                                fullWidth
                            />
                        </Box>

                        <ButtonComponent
                            sizeUI="sm"
                            type="submit"
                            fullWidth
                            loading={isSubmitting}
                            sx={{ mt: 3, mb: 3 }}
                        >
                            Đăng ký
                        </ButtonComponent>

                        <Box textAlign="center">
                            <Typography
                                variant="body2"
                                component="span"
                                fontSize={13}
                            >
                                Đã có tài khoản?{' '}
                            </Typography>
                            <Link href="/login" underline="hover" fontWeight={500} fontSize={13}>
                                Đăng nhập
                            </Link>
                        </Box>
                    </Box>
                </Form>
            )}
        </Formik>
    )
}
