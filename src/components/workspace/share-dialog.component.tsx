import { Dialog, DialogTitle, DialogContent, Box, Typography, IconButton, Stack, Chip, MenuItem, Select, FormControl, InputLabel, alpha, useTheme } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { Formik, Form, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { TextFieldComponent } from '../textfield/text-field.component'
import { ButtonComponent } from '../button/button.component'

interface ShareDialogProps {
    open: boolean
    onClose: () => void
}

interface ShareValues {
    email: string
    role: string
}

const initialValues: ShareValues = {
    email: '',
    role: 'viewer'
}

const validationSchema = Yup.object({
    email: Yup.string()
        .required('Email không được để trống')
        .email('Email không hợp lệ'),
    role: Yup.string().required()
})

export const ShareDialog = ({ open, onClose }: ShareDialogProps) => {
    const theme = useTheme()

    const handleSubmit = (
        values: ShareValues,
        { setSubmitting, resetForm }: FormikHelpers<ShareValues>
    ) => {
        // Implement invite logic here
        console.log('Invite sent to:', values.email, 'Role:', values.role)
        resetForm()
        onClose()
        setSubmitting(false)
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 2 }
            }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3 }}>
                <Typography variant="h6" fontWeight={700}>
                    Chia sẻ Workspace
                </Typography>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Mời thành viên mới tham gia vào workspace để cùng làm việc.
                </Typography>

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
                        <Form noValidate>
                            <Stack spacing={3}>
                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                                    <Box sx={{ flex: 1 }}>
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
                                            name="email"
                                            placeholder="user@example.com"
                                            value={values.email}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.email && !!errors.email}
                                            helperText={touched.email && errors.email}
                                        />
                                    </Box>
                                    <Box>
                                        <InputLabel
                                            sx={{
                                                mb: 0.5,
                                                fontSize: 13,
                                                fontWeight: 600,
                                                color: 'text.primary'
                                            }}
                                        >
                                            Vai trò
                                        </InputLabel>
                                        <FormControl size="small" sx={{ minWidth: 120 }}>
                                            <Select
                                                name="role"
                                                value={values.role}
                                                onChange={handleChange}
                                            >
                                                <MenuItem value="viewer">Viewer</MenuItem>
                                                <MenuItem value="editor">Editor</MenuItem>
                                                <MenuItem value="admin">Admin</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Box>
                                </Box>

                                <Box>
                                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
                                        Thành viên hiện tại
                                    </Typography>
                                    <Stack spacing={1.5}>
                                        {/* Mock members */}
                                        {['Admin', 'User 1'].map((user, index) => (
                                            <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, borderRadius: 1, '&:hover': { bgcolor: alpha(theme.palette.grey[500], 0.08) } }}>
                                                <Stack direction="row" spacing={1.5} alignItems="center">
                                                    <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'common.white', fontSize: 14 }}>
                                                        {user.charAt(0)}
                                                    </Box>
                                                    <Box>
                                                        <Typography variant="body2" fontWeight={500}>{user}</Typography>
                                                        <Typography variant="caption" color="text.secondary">{user === 'Admin' ? 'admin@doc.com' : 'user@doc.com'}</Typography>
                                                    </Box>
                                                </Stack>
                                                <Chip label={user === 'Admin' ? 'Owner' : 'Editor'} size="small" variant="outlined" />
                                            </Box>
                                        ))}
                                    </Stack>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                                    <ButtonComponent
                                        sizeUI="sm"
                                        variant="ghost"
                                        onClick={onClose}
                                        disabled={isSubmitting}
                                    >
                                        Hủy
                                    </ButtonComponent>
                                    <ButtonComponent
                                        sizeUI="sm"
                                        variant="primary"
                                        type="submit"
                                        loading={isSubmitting}
                                        icon={<PersonAddIcon />}
                                    >
                                        Gửi lời mời
                                    </ButtonComponent>
                                </Box>
                            </Stack>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    )
}
