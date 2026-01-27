import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Box, InputLabel } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'
import { useWorkspace } from '../../contexts/workspace.context'
import { Formik, Form, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { TextFieldComponent } from '../textfield/text-field.component'
import { ButtonComponent } from '../button/button.component'

interface CreateWorkspaceDialogProps {
    open: boolean
    onClose: () => void
}

interface WorkspaceValues {
    name: string
}

const initialValues: WorkspaceValues = {
    name: ''
}

const validationSchema = Yup.object({
    name: Yup.string()
        .required('Tên workspace không được để trống')
        .min(3, 'Tên workspace phải có ít nhất 3 ký tự')
        .max(50, 'Tên workspace không được quá 50 ký tự')
})

export const CreateWorkspaceDialog = ({ open, onClose }: CreateWorkspaceDialogProps) => {
    const { createWorkspace } = useWorkspace()

    const handleSubmit = async (
        values: WorkspaceValues,
        { setSubmitting, resetForm }: FormikHelpers<WorkspaceValues>
    ) => {
        try {
            await createWorkspace({ name: values.name })
            resetForm()
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
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 2 }
            }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3 }}>
                <Typography component="span" variant="h6" fontWeight={700}>
                    Tạo Workspace mới
                </Typography>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Workspace là nơi bạn và team lưu trữ, sắp xếp tài liệu.
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
                            <Box mb={3}>
                                <InputLabel
                                    sx={{
                                        mb: 0.5,
                                        fontSize: 13,
                                        fontWeight: 600,
                                        color: 'text.primary'
                                    }}
                                >
                                    Tên Workspace
                                </InputLabel>
                                <TextFieldComponent
                                    autoFocus
                                    sizeUI="sm"
                                    name="name"
                                    placeholder="VD: Dự án Marketing, Tài liệu cá nhân..."
                                    value={values.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.name && !!errors.name}
                                    helperText={touched.name && errors.name}
                                />
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
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
                                    icon={<AddIcon />}
                                >
                                    Tạo Workspace
                                </ButtonComponent>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    )
}
