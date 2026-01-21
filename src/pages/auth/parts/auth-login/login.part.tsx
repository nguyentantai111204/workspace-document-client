// pages/auth/parts/login-form/LoginForm.tsx

import { Formik, Form, type FormikHelpers } from 'formik'
import { Typography, Link, Box, Stack, InputLabel } from '@mui/material'

import { loginValidate } from './login.constant'

import { TextFieldComponent } from '../../../../components/textfield/text-field.component'
import { TextFieldPasswordComponent } from '../../../../components/textfield/text-field-password.component'
import { CheckboxComponent } from '../../../../components/checkbox/checkbox.component'
import { ButtonComponent } from '../../../../components/elements/button/button.component'

import {
    StackRowAlignCenterJustBetween,
} from '../../../../components/mui-custom/stack/stack.mui-custom'

interface LoginValues {
    email: string
    password: string
    remember: boolean
}


const initialValues: LoginValues = {
    email: '',
    password: '',
    remember: false,
}

export const LoginForm = () => {
    const handleSubmit = async (
        values: LoginValues,
        { setSubmitting }: FormikHelpers<LoginValues>,
    ) => {
        try {
            console.log('LOGIN:', values)
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
                        <Stack alignItems="center" mb={4} spacing={1}>
                            <Box display="flex" alignItems="center" gap={1}>
                                <Box
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        background: theme => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontWeight: 'bold'
                                    }}
                                >M</Box>
                                <Typography variant="h4" fontWeight={700} color="text.primary">
                                    Modernize
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                Không gian làm việc hiện đại
                            </Typography>
                        </Stack>

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
        </Formik>
    )
}
