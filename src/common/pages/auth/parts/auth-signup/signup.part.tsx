import { Formik } from 'formik'
import { Box, Stack, Typography, Link } from '@mui/material'
import { signupValidate } from './signup.constant'
import { TextFieldComponent } from '../../../../components/textfield/text-field.component'
import { CheckboxComponent } from '../../../../components/checkbox/checkbox.component'
import { ButtonComponent } from '../../../../components/elements/button/button.component'

const initialValues = {
    firstName: '',
    lastName: '',
    company: '',
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
                    {/* Header */}
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={3}
                    >
                        <Typography variant="h4" fontWeight={600}>
                            Sign up
                        </Typography>
                        <Link href="/login" fontSize={13}>
                            Already have an account?
                        </Link>
                    </Stack>

                    <Stack direction="row" spacing={2}>
                        <TextFieldComponent
                            sizeUI="sm"
                            name="firstName"
                            label="First Name"
                            value={values.firstName}
                            onChange={handleChange}
                            error={!!errors.firstName && touched.firstName}
                            helperText={
                                touched.firstName && errors.firstName
                            }
                            fullWidth
                        />

                        <TextFieldComponent
                            sizeUI="sm"
                            name="lastName"
                            label="Last Name"
                            value={values.lastName}
                            onChange={handleChange}
                            error={!!errors.lastName && touched.lastName}
                            helperText={
                                touched.lastName && errors.lastName
                            }
                            fullWidth
                        />
                    </Stack>

                    <TextFieldComponent
                        sizeUI="sm"
                        label="Company"
                        name="company"
                        value={values.company}
                        onChange={handleChange}
                        fullWidth
                        sx={{ mt: 2 }}
                    />

                    <TextFieldComponent
                        sizeUI="sm"
                        label="Email Address"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        error={!!errors.email && touched.email}
                        helperText={touched.email && errors.email}
                        fullWidth
                        sx={{ mt: 2 }}
                    />

                    <TextFieldComponent
                        sizeUI="sm"
                        label="Password"
                        name="password"
                        type="password"
                        value={values.password}
                        onChange={handleChange}
                        error={!!errors.password && touched.password}
                        helperText={touched.password && errors.password}
                        fullWidth
                        sx={{ mt: 2 }}
                    />

                    {/* Terms */}
                    <Box mt={2}>
                        <CheckboxComponent
                            sizeUI="sm"
                            label="I agree to the Terms & Privacy"
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

                    {/* Submit */}
                    <ButtonComponent
                        sizeUI="sm"
                        type="submit"
                        fullWidth
                        loading={isSubmitting}
                        sx={{ mt: 3 }}
                    >
                        Create account
                    </ButtonComponent>
                </Box>
            )}
        </Formik>
    )
}
