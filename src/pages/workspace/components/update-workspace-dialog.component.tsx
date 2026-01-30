import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Box, InputLabel, alpha, useTheme, Avatar, useMediaQuery } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import SaveIcon from '@mui/icons-material/Save'
import { useWorkspace } from '../../../contexts/workspace.context'
import { Formik, Form, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { TextFieldComponent } from '../../../components/textfield/text-field.component'
import { ButtonComponent } from '../../../components/button/button.component'
import { WorkspaceResponse } from '../../../apis/workspace/workspace.interface'
import { StackColumnAlignStart } from '../../../components/mui-custom/stack/stack.mui-custom'

interface UpdateWorkspaceDialogProps {
    open: boolean
    onClose: () => void
    workspace: WorkspaceResponse
}

interface WorkspaceValues {
    name: string
}

const validationSchema = Yup.object({
    name: Yup.string()
        .required('Tên workspace không được để trống')
        .min(3, 'Tên workspace phải có ít nhất 3 ký tự')
        .max(50, 'Tên workspace không được quá 50 ký tự')
})

export const UpdateWorkspaceDialog = ({ open, onClose, workspace }: UpdateWorkspaceDialogProps) => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const { updateWorkspace } = useWorkspace()

    const initialValues: WorkspaceValues = {
        name: workspace.name
    }

    const handleSubmit = async (
        values: WorkspaceValues,
        { setSubmitting }: FormikHelpers<WorkspaceValues>
    ) => {
        try {
            await updateWorkspace(workspace.id, { name: values.name })
            onClose()
        } catch (err) {
            console.error(err)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: isMobile ? 3 : 4,
                    backgroundImage: 'none',
                    boxShadow: theme.shadows[10],
                    m: isMobile ? 2 : 'auto',
                }
            }}
        >
            <IconButton
                onClick={onClose}
                size="small"
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: 'text.disabled',
                    '&:hover': { color: 'text.primary' },
                    zIndex: 1
                }}
            >
                <CloseIcon fontSize="small" />
            </IconButton>

            <DialogTitle sx={{ pt: isMobile ? 4 : 5, pb: 1, px: isMobile ? 2 : 3, textAlign: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: isMobile ? 1.5 : 2 }}>
                    <Box
                        sx={{
                            p: 1,
                            borderRadius: '50%',
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: `0 0 15px ${alpha(theme.palette.primary.main, 0.15)}`,
                        }}
                    >
                        <Avatar
                            sx={{
                                width: isMobile ? 48 : 64,
                                height: isMobile ? 48 : 64,
                                bgcolor: 'primary.main',
                                fontSize: isMobile ? '1.25rem' : '1.5rem',
                                fontWeight: 700,
                            }}
                        >
                            {(workspace.name || '').substring(0, 1).toUpperCase()}
                        </Avatar>
                    </Box>

                    <StackColumnAlignStart sx={{ alignItems: 'center', textAlign: 'center', width: '100%', gap: 0.25 }}>
                        <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight={800} sx={{ letterSpacing: '-0.02em' }}>
                            Cập nhật Workspace
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: '90%', lineHeight: 1.5, fontSize: isMobile ? 13 : 14 }}>
                            {isMobile ? 'Cập nhật tên dự án theo sở thích của bạn' : 'Tùy chỉnh tên workspace để giúp bạn và đồng đội dễ dàng nhận diện dự án hơn.'}
                        </Typography>
                    </StackColumnAlignStart>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ p: isMobile ? 3 : 4, pt: isMobile ? 2 : 3, mt: isMobile ? 2 : 3 }}>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize
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
                            <Box sx={{ mb: isMobile ? 3 : 4 }}>
                                <InputLabel
                                    sx={{
                                        mb: 0.75,
                                        fontSize: isMobile ? 13 : 14,
                                        fontWeight: 700,
                                        color: 'text.primary',
                                        ml: 0.5
                                    }}
                                >
                                    Tên Workspace
                                </InputLabel>
                                <TextFieldComponent
                                    autoFocus
                                    sizeUI={isMobile ? 'sm' : 'md'}
                                    name="name"
                                    placeholder="VD: Dự án Marketing..."
                                    value={values.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.name && !!errors.name}
                                    helperText={touched.name && errors.name}
                                    fullWidth
                                />
                            </Box>

                            <Box sx={{ display: 'flex', gap: isMobile ? 1.5 : 2 }}>
                                <ButtonComponent
                                    sizeUI={isMobile ? 'sm' : 'md'}
                                    variant="ghost"
                                    onClick={onClose}
                                    disabled={isSubmitting}
                                    fullWidth
                                    sx={{ borderRadius: 2 }}
                                >
                                    Hủy
                                </ButtonComponent>
                                <ButtonComponent
                                    sizeUI={isMobile ? 'sm' : 'md'}
                                    variant="primary"
                                    type="submit"
                                    loading={isSubmitting}
                                    icon={<SaveIcon sx={{ fontSize: isMobile ? 18 : 20 }} />}
                                    fullWidth
                                    sx={{
                                        borderRadius: 2,
                                        boxShadow: `0 4px 12px 0 ${alpha(theme.palette.primary.main, 0.3)}`,
                                    }}
                                >
                                    {isMobile ? 'Lưu' : 'Lưu thay đổi'}
                                </ButtonComponent>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    )
}
