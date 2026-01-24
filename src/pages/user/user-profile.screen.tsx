import {
    Box,
    Typography,
    Paper,
    Avatar,
    Button,
    Stack,
    Divider,
    Alert,
    useTheme,
    useMediaQuery,
} from '@mui/material'
import Grid from '@mui/material/Grid'
import { Formik, Form, FormikHelpers } from 'formik'
import EmailIcon from '@mui/icons-material/Email'
import PersonIcon from '@mui/icons-material/Person'
import PhoneIcon from '@mui/icons-material/Phone'
import PlaceIcon from '@mui/icons-material/Place'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import { useAppSelector } from '../../redux/store.redux'
import { useSnackbar } from '../../hooks/use-snackbar.hook'
import { ChangePasswordRequest } from '../../apis/user/user.interface'
import { changePasswordApi } from '../../apis/user/user.api'
import { TextFieldComponent } from '../../components/textfield/text-field.component'
import { TextFieldPasswordComponent } from '../../components/textfield/text-field-password.component'
import { validationSchema } from './user-profile.constant'
import { ButtonComponent } from '../../components/button/button.component'

export const ProfilePage = () => {
    const { user } = useAppSelector(state => state.account)
    const { showSuccess, showError } = useSnackbar()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    const initialValues: ChangePasswordRequest = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    }

    const handleSubmit = async (
        values: ChangePasswordRequest,
        { setSubmitting, resetForm }: FormikHelpers<ChangePasswordRequest>
    ) => {
        try {
            await changePasswordApi(values)
            showSuccess('Đổi mật khẩu thành công!')
            resetForm()
        } catch (error: any) {
            const message =
                error.response?.data?.message || 'Đổi mật khẩu thất bại'
            showError(Array.isArray(message) ? message[0] : message)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Box sx={{ p: 3, maxWidth: 1000, mx: 'auto' }}>
            <Paper sx={{ p: 4, mb: 4, borderRadius: 2 }}>
                <Typography variant={isMobile ? 'subtitle1' : 'h6'} fontWeight="bold" mb={3}>
                    Thông tin cá nhân
                </Typography>

                <Grid container spacing={4} alignItems="center" mb={4}>
                    <Grid>
                        <Box position="relative">
                            <Avatar
                                src={
                                    user?.avatarUrl ||
                                    '/assets/images/avatar/avatar-25.webp'
                                }
                                sx={{
                                    width: 100,
                                    height: 100,
                                    border: '4px solid #fff',
                                    boxShadow: 1,
                                }}
                            />
                            <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    right: 0,
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: 32,
                                    height: 32,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '2px solid white',
                                }}
                            >
                                <PhotoCameraIcon sx={{ fontSize: 18 }} />
                            </Box>
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Stack direction="row" spacing={2} mb={1}>
                            <Typography
                                variant="subtitle1"
                                fontWeight="bold"
                            >
                                Ảnh đại diện
                            </Typography>
                        </Stack>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            mb={2}
                        >
                            Chấp nhận định dạng JPG, PNG hoặc GIF. Tối đa 5MB.
                        </Typography>
                        <Stack direction="row" spacing={2}>
                            <Button
                                variant="outlined"
                                size="small"
                                disabled
                            >
                                Tải ảnh lên
                            </Button>
                            <Button
                                color="error"
                                size="small"
                                disabled
                            >
                                Xóa ảnh
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextFieldComponent
                            label="Họ và tên"
                            value={user?.fullName || ''}
                            disabled
                            fullWidth
                            sizeUI={isMobile ? 'sm' : 'md'}
                            InputProps={{
                                startAdornment: (
                                    <PersonIcon
                                        sx={{
                                            color: 'text.secondary',
                                            mr: 1,
                                            fontSize: isMobile ? 20 : 24
                                        }}
                                    />
                                ),
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextFieldComponent
                            label="Email"
                            value={user?.email || ''}
                            disabled
                            fullWidth
                            sizeUI={isMobile ? 'sm' : 'md'}
                            InputProps={{
                                startAdornment: (
                                    <EmailIcon
                                        sx={{
                                            color: 'text.secondary',
                                            mr: 1,
                                            fontSize: isMobile ? 20 : 24
                                        }}
                                    />
                                ),
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextFieldComponent
                            label="Số điện thoại"
                            value=""
                            placeholder="Chưa cập nhật"
                            disabled
                            fullWidth
                            sizeUI={isMobile ? 'sm' : 'md'}
                            InputProps={{
                                startAdornment: (
                                    <PhoneIcon
                                        sx={{
                                            color: 'text.secondary',
                                            mr: 1,
                                            fontSize: isMobile ? 20 : 24
                                        }}
                                    />
                                ),
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextFieldComponent
                            label="Địa chỉ"
                            value=""
                            placeholder="Chưa cập nhật"
                            disabled
                            fullWidth
                            sizeUI={isMobile ? 'sm' : 'md'}
                            InputProps={{
                                startAdornment: (
                                    <PlaceIcon
                                        sx={{
                                            color: 'text.secondary',
                                            mr: 1,
                                            fontSize: isMobile ? 20 : 24
                                        }}
                                    />
                                ),
                            }}
                        />
                    </Grid>
                </Grid>
            </Paper>

            <Paper sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant={isMobile ? 'subtitle1' : 'h6'} fontWeight="bold" mb={3}>
                    Đổi mật khẩu
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        isSubmitting,
                    }) => (
                        <Form>
                            <Box mb={3}>
                                <TextFieldPasswordComponent
                                    label="Mật khẩu hiện tại"
                                    name="currentPassword"
                                    value={values.currentPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sizeUI={isMobile ? 'sm' : 'md'}
                                    error={
                                        touched.currentPassword &&
                                        !!errors.currentPassword
                                    }
                                    helperText={
                                        touched.currentPassword &&
                                        errors.currentPassword
                                    }
                                    fullWidth
                                    placeholder="Nhập mật khẩu hiện tại"
                                />
                            </Box>

                            <Box mb={3}>
                                <TextFieldPasswordComponent
                                    label="Mật khẩu mới"
                                    name="newPassword"
                                    value={values.newPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sizeUI={isMobile ? 'sm' : 'md'}
                                    error={
                                        touched.newPassword &&
                                        !!errors.newPassword
                                    }
                                    helperText={
                                        touched.newPassword &&
                                        errors.newPassword
                                    }
                                    fullWidth
                                    placeholder="Nhập mật khẩu mới"
                                />
                            </Box>

                            <Box mb={3}>
                                <TextFieldPasswordComponent
                                    label="Xác nhận mật khẩu mới"
                                    name="confirmPassword"
                                    value={values.confirmPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sizeUI={isMobile ? 'sm' : 'md'}
                                    error={
                                        touched.confirmPassword &&
                                        !!errors.confirmPassword
                                    }
                                    helperText={
                                        touched.confirmPassword &&
                                        errors.confirmPassword
                                    }
                                    fullWidth
                                    placeholder="Nhập lại mật khẩu mới"
                                />
                            </Box>

                            <Alert severity="info" sx={{ mb: 3 }}>
                                <Typography
                                    variant="subtitle2"
                                    fontWeight="bold"
                                >
                                    Yêu cầu mật khẩu:
                                </Typography>
                                <ul style={{ margin: 0, paddingLeft: 20 }}>
                                    <li>
                                        <Typography variant="caption">
                                            Tối thiểu 6 ký tự
                                        </Typography>
                                    </li>
                                    <li>
                                        <Typography variant="caption">
                                            Bao gồm chữ hoa và ký tự đặc biệt
                                            (Khuyến nghị)
                                        </Typography>
                                    </li>
                                </ul>
                            </Alert>

                            <Box
                                display="flex"
                                justifyContent="flex-end"
                            >
                                <ButtonComponent
                                    type="submit"
                                    loading={isSubmitting}
                                >
                                    Lưu thay đổi
                                </ButtonComponent>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </Paper>
        </Box>
    )
}
