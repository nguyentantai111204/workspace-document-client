// pages/auth/parts/login-form/LoginForm.tsx

import { Formik, Form, type FormikHelpers } from 'formik'
import { Typography, Link } from '@mui/material'

import { loginValidate } from './login.constant'

import { TextFieldComponent } from '../../../../components/textfield/text-field.component'
import { TextFieldPasswordComponent } from '../../../../components/textfield/text-field-password.component'
import { CheckboxComponent } from '../../../../components/checkbox/checkbox.component'
import { ButtonComponent } from '../../../../components/elements/button/button.component'

import {
    StackColumn,
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
                    <StackColumn
                        sx={{
                            gap: { xs: 1.25, sm: 2 },
                            width: '100%',
                        }}
                    >
                        <StackColumn spacing={0.5} mb={1.5}>
                            <Typography
                                variant="h4"
                                fontWeight={600}
                                fontSize={{ xs: 20, sm: 22 }}
                            >
                                Sign in
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                fontSize={13}
                            >
                                Welcome back 👋
                            </Typography>
                        </StackColumn>

                        <TextFieldComponent
                            sizeUI="sm"
                            name="email"
                            label="Email address"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.email && !!errors.email}
                            helperText={touched.email && errors.email}
                        />

                        <StackColumn gap={1} alignItems="flex-end">
                            <Link
                                href="/forgot-password"
                                underline="hover"
                                fontSize={13}
                            >
                                Forgot password?
                            </Link>

                            <TextFieldPasswordComponent
                                sizeUI="sm"
                                name="password"
                                label="Password"
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.password && !!errors.password}
                                helperText={touched.password && errors.password}
                                fullWidth
                            />
                        </StackColumn>

                        <StackRowAlignCenterJustBetween mt={0.5}>
                            <CheckboxComponent
                                sizeUI="sm"
                                label="Remember me"
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
                        </StackRowAlignCenterJustBetween>

                        <ButtonComponent
                            sizeUI="sm"
                            type="submit"
                            fullWidth
                            loading={isSubmitting}
                            sx={{ mt: 1.5 }}
                        >
                            Sign in
                        </ButtonComponent>

                        <Typography
                            variant="body2"
                            align="center"
                            fontSize={13}
                            sx={{ mt: 1 }}
                        >
                            Don&apos;t have an account?{' '}
                            <Link href="/register" underline="hover">
                                Sign up
                            </Link>
                        </Typography>
                    </StackColumn>
                </Form>
            )}
        </Formik>
    )
}
