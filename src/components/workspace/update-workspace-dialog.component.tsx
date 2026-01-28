import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Box, InputLabel, alpha, useTheme, Avatar } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import SaveIcon from '@mui/icons-material/Save'
import { useWorkspace } from '../../contexts/workspace.context'
import { Formik, Form, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { TextFieldComponent } from '../textfield/text-field.component'
import { ButtonComponent } from '../button/button.component'
import { WorkspaceResponse } from '../../apis/workspace/workspace.interface'
import { StackColumnAlignStart } from '../mui-custom/stack/stack.mui-custom'

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
                    borderRadius: 3,
                    backgroundImage: 'none',
                    boxShadow: theme.shadows[10],
                }
            }}
        >
            <IconButton
                onClick={onClose}
                size="small"
                sx={{
                    position: 'absolute',
                    right: 16,
                    top: 16,
                    color: 'text.disabled',
                    '&:hover': { color: 'text.primary' }
                }}
            >
                <CloseIcon />
            </IconButton>

            <DialogTitle sx={{ pt: 5, pb: 2, px: 3, textAlign: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <Box
                        sx={{
                            p: 1.5,
                            borderRadius: '50%',
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.2)}`,
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 64,
                                height: 64,
                                bgcolor: 'primary.main',
                                fontSize: '1.5rem',
                                fontWeight: 700,
                            }}
                        >
                            {workspace.name.substring(0, 1).toUpperCase()}
                        </Avatar>
                    </Box>

                    <StackColumnAlignStart sx={{ alignItems: 'center', textAlign: 'center', width: '100%', gap: 0.5 }}>
                        <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: '-0.02em' }}>
                            Cập nhật Workspace
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: '80%', lineHeight: 1.6 }}>
                            Tùy chỉnh tên workspace để giúp bạn và đồng đội dễ dàng nhận diện dự án hơn.
                        </Typography>
                    </StackColumnAlignStart>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ p: 4 }}>
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
                            <Box sx={{ mb: 4 }}>
                                <InputLabel
                                    sx={{
                                        mb: 1,
                                        fontSize: 14,
                                        fontWeight: 700,
                                        color: 'text.primary',
                                        ml: 0.5
                                    }}
                                >
                                    Tên Workspace
                                </InputLabel>
                                <TextFieldComponent
                                    autoFocus
                                    sizeUI="md"
                                    name="name"
                                    placeholder="VD: Dự án Marketing, Tài liệu cá nhân..."
                                    value={values.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.name && !!errors.name}
                                    helperText={touched.name && errors.name}
                                    fullWidth
                                />
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <ButtonComponent
                                    sizeUI="md"
                                    variant="ghost"
                                    onClick={onClose}
                                    disabled={isSubmitting}
                                    fullWidth
                                    sx={{ borderRadius: 2 }}
                                >
                                    Hủy
                                </ButtonComponent>
                                <ButtonComponent
                                    sizeUI="md"
                                    variant="primary"
                                    type="submit"
                                    loading={isSubmitting}
                                    icon={<SaveIcon />}
                                    fullWidth
                                    sx={{
                                        borderRadius: 2,
                                        boxShadow: `0 4px 14px 0 ${alpha(theme.palette.primary.main, 0.39)}`,
                                    }}
                                >
                                    Lưu thay đổi
                                </ButtonComponent>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    )
}
