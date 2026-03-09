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
    CircularProgress,
    List,
    ListItem,
    ListItemText,
} from '@mui/material'
import Grid from '@mui/material/Grid'
import { Formik, Form, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import EmailIcon from '@mui/icons-material/Email'
import PersonIcon from '@mui/icons-material/Person'
import PhoneIcon from '@mui/icons-material/Phone'
import PlaceIcon from '@mui/icons-material/Place'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../redux/store.redux'
import { useSnackbar } from '../../hooks/use-snackbar.hook'
import { ChangePasswordRequest } from '../../apis/user/user.interface'
import { changePasswordApi } from '../../apis/user/user.api'
import { TextFieldComponent } from '../../components/textfield/text-field.component'
import { TextFieldPasswordComponent } from '../../components/textfield/text-field-password.component'
import { TextFieldUploadComponent } from '../../components/textfield/text-field-upload.component'
import { ButtonComponent } from '../../components/button/button.component'
import { updateProfileThunk } from '../../redux/account/account.action'
import { StackRowAlignCenterJustEnd } from '../../components/mui-custom/stack/stack.mui-custom'


const passwordValidationSchema = Yup.object({
    currentPassword: Yup.string().required('Vui lòng nhập mật khẩu hiện tại'),
    newPassword: Yup.string()
        .min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự')
        .required('Vui lòng nhập mật khẩu mới'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Mật khẩu xác nhận không khớp')
        .required('Vui lòng xác nhận mật khẩu mới'),
})

interface ProfileFormValues {
    fullName: string
    phoneNumber: string
    address: string
}

export const ProfilePage = () => {
    const dispatch = useAppDispatch()
    const { user } = useAppSelector(state => state.account)
    const { showSuccess, showError } = useSnackbar()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

    const handleFile = (files: File[]) => {
        const file = files[0]
        if (!file) return

        if (file.size > 5 * 1024 * 1024) {
            showError('Ảnh không được vượt quá 5MB')
            return
        }
        if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
            showError('Chỉ chấp nhận định dạng JPG, PNG, GIF hoặc WebP')
            return
        }

        setAvatarFile(file)
        setAvatarPreview(URL.createObjectURL(file))
    }

    const handleUploadAvatar = async () => {
        if (!avatarFile) return
        setIsUploadingAvatar(true)
        try {
            await dispatch(updateProfileThunk({ avatar: avatarFile })).unwrap()
            showSuccess('Cập nhật ảnh đại diện thành công!')
            setAvatarFile(null)
        } catch (error: any) {
            const message = Array.isArray(error) ? error[0] : error
            showError(message || 'Cập nhật ảnh thất bại')
        } finally {
            setIsUploadingAvatar(false)
        }
    }

    const handleRemoveAvatar = () => {
        setAvatarPreview(null)
        setAvatarFile(null)
    }

    const profileInitialValues: ProfileFormValues = {
        fullName: user?.fullName || '',
        phoneNumber: user?.phoneNumber || '',
        address: user?.address || '',
    }

    const handleProfileSubmit = async (
        values: ProfileFormValues,
        { setSubmitting }: FormikHelpers<ProfileFormValues>
    ) => {
        try {
            await dispatch(updateProfileThunk({
                fullName: values.fullName,
                phoneNumber: values.phoneNumber,
                address: values.address,
            })).unwrap()
            showSuccess('Cập nhật thông tin thành công!')
        } catch (error: any) {
            const message = Array.isArray(error) ? error[0] : error
            showError(message || 'Cập nhật thất bại')
        } finally {
            setSubmitting(false)
        }
    }

    const passwordInitialValues: ChangePasswordRequest = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    }

    const handlePasswordSubmit = async (
        values: ChangePasswordRequest,
        { setSubmitting, resetForm }: FormikHelpers<ChangePasswordRequest>
    ) => {
        try {
            await changePasswordApi(values)
            showSuccess('Đổi mật khẩu thành công!')
            resetForm()
        } catch (error: any) {
            const message = error.response?.data?.message || 'Đổi mật khẩu thất bại'
            showError(Array.isArray(message) ? message[0] : message)
        } finally {
            setSubmitting(false)
        }
    }

    const currentAvatarSrc = avatarPreview || user?.avatarUrl || '/assets/images/avatar/avatar-25.webp'

    return (
        <Box sx={{ p: 3, maxWidth: 1000, mx: 'auto' }}>
            <Paper sx={{ p: 4, mb: 4, borderRadius: 2 }}>
                <Typography variant={isMobile ? 'subtitle1' : 'h6'} fontWeight="bold" mb={3}>
                    Ảnh đại diện
                </Typography>

                <Stack direction={isMobile ? 'column' : 'row'} spacing={4} alignItems="center">
                    <Box position="relative" sx={{ flexShrink: 0 }}>
                        <Avatar
                            src={currentAvatarSrc}
                            sx={{
                                width: 120,
                                height: 120,
                                border: '4px solid #fff',
                                boxShadow: 1,
                            }}
                        />
                    </Box>

                    <Box flex={1} width="100%">
                        <TextFieldUploadComponent
                            icon={<PhotoCameraIcon sx={{ fontSize: 32 }} />}
                            title="Chọn ảnh đại diện hoặc kéo thả vào đây"
                            subTitle="Chấp nhận định dạng JPG, PNG, GIF hoặc WebP. Tối đa 5MB."
                            orientation={isMobile ? 'vertical' : 'horizontal'}
                            accept="image/jpeg,image/png,image/gif,image/webp"
                            onChange={handleFile}
                        />
                    </Box>
                </Stack>

                {avatarFile && (
                    <StackRowAlignCenterJustEnd gap={2} mt={3}>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={handleUploadAvatar}
                            disabled={isUploadingAvatar}
                            startIcon={isUploadingAvatar ? <CircularProgress size={14} color="inherit" /> : undefined}
                        >
                            {isUploadingAvatar ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </Button>
                        <Button
                            color="error"
                            variant="outlined"
                            size="small"
                            onClick={handleRemoveAvatar}
                            disabled={isUploadingAvatar}
                        >
                            Hủy bỏ
                        </Button>
                    </StackRowAlignCenterJustEnd>
                )}
            </Paper>

            <Paper sx={{ p: 4, mb: 4, borderRadius: 2 }}>
                <Typography variant={isMobile ? 'subtitle1' : 'h6'} fontWeight="bold" mb={3}>
                    Thông tin cá nhân
                </Typography>

                <Formik
                    initialValues={profileInitialValues}
                    enableReinitialize
                    onSubmit={handleProfileSubmit}
                >
                    {({ values, handleChange, handleBlur, isSubmitting }) => (
                        <Form>
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextFieldComponent
                                        label="Họ và tên"
                                        name="fullName"
                                        value={values.fullName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
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
                                        name="phoneNumber"
                                        value={values.phoneNumber}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="Chưa cập nhật"
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
                                        name="address"
                                        value={values.address}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="Chưa cập nhật"
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

                            <Box display="flex" justifyContent="flex-end" mt={3}>
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

            <Paper sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant={isMobile ? 'subtitle1' : 'h6'} fontWeight="bold" mb={3}>
                    Đổi mật khẩu
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Formik
                    initialValues={passwordInitialValues}
                    validationSchema={passwordValidationSchema}
                    onSubmit={handlePasswordSubmit}
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
                                    error={touched.currentPassword && !!errors.currentPassword}
                                    helperText={touched.currentPassword && errors.currentPassword}
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
                                    error={touched.newPassword && !!errors.newPassword}
                                    helperText={touched.newPassword && errors.newPassword}
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
                                    error={touched.confirmPassword && !!errors.confirmPassword}
                                    helperText={touched.confirmPassword && errors.confirmPassword}
                                    fullWidth
                                    placeholder="Nhập lại mật khẩu mới"
                                />
                            </Box>

                            <Alert severity="info" sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" fontWeight="bold">
                                    Yêu cầu mật khẩu:
                                </Typography>
                                <List dense disablePadding sx={{ mt: 0.5 }}>
                                    {['Tối thiểu 6 ký tự', 'Bao gồm chữ hoa và ký tự đặc biệt (Khuyến nghị)'].map((text) => (
                                        <ListItem key={text} disableGutters sx={{ py: 0 }}>
                                            <ListItemText
                                                primary={text}
                                                primaryTypographyProps={{ variant: 'caption' }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Alert>

                            <Box display="flex" justifyContent="flex-end">
                                <ButtonComponent
                                    type="submit"
                                    loading={isSubmitting}
                                >
                                    Đổi mật khẩu
                                </ButtonComponent>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </Paper>
        </Box>
    )
}
