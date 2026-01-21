import { Formik } from 'formik'
import { Box, Typography, Link, Stack, InputLabel } from '@mui/material'
import { signupValidate } from './signup.constant'
import { TextFieldComponent } from '../../../../components/textfield/text-field.component'
import { CheckboxComponent } from '../../../../components/checkbox/checkbox.component'
import { ButtonComponent } from '../../../../components/elements/button/button.component'

const initialValues = {
    fullName: '',
    email: '',
    password: '',
    acceptTerms: false,
}

export const SignUpForm = () => {
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={signupValidate}
            onSubmit={(values, { setSubmitting }) => {
                console.log(values)
                setSubmitting(false)
            }}
        >
            {({
                values,
                errors,
                touched,
                handleChange,
                handleSubmit,
                setFieldValue,
                isSubmitting,
            }) => (
                <Box component="form" onSubmit={handleSubmit}>
                    <Stack alignItems="center" mb={3} spacing={1}>
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
                            Họ và tên
                        </InputLabel>
                        <TextFieldComponent
                            sizeUI="sm"
                            name="fullName"
                            placeholder="Nhập họ và tên"
                            value={values.fullName}
                            onChange={handleChange}
                            error={!!errors.fullName && touched.fullName}
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
                            error={!!errors.email && touched.email}
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
                        <TextFieldComponent
                            sizeUI="sm"
                            placeholder="Nhập mật khẩu"
                            name="password"
                            type="password"
                            value={values.password}
                            onChange={handleChange}
                            error={!!errors.password && touched.password}
                            helperText={touched.password && errors.password}
                            fullWidth
                        />
                    </Box>

                    <Box mt={2}>
                        <CheckboxComponent
                            sizeUI="sm"
                            label={
                                <Box component="span">
                                    Đồng ý với <Link href="#" underline="hover">Điều khoản & Điều kiện.</Link>
                                </Box>
                            }
                            checked={values.acceptTerms}
                            variant="outlined"
                            onChange={(e) =>
                                setFieldValue(
                                    'acceptTerms',
                                    e.target.checked,
                                )
                            }
                        />

                        {touched.acceptTerms &&
                            errors.acceptTerms && (
                                <Typography
                                    variant="caption"
                                    color="error.main"
                                    sx={{ ml: 4, fontSize: 11 }}
                                >
                                    {errors.acceptTerms}
                                </Typography>
                            )}
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

                    <Stack direction="row" justifyContent="center" spacing={0.5}>
                        <Typography variant="body2">Đã có tài khoản?</Typography>
                        <Link href="/login" underline="hover" fontWeight={500}>Đăng nhập</Link>
                    </Stack>
                </Box>
            )}
        </Formik>
    )
}
