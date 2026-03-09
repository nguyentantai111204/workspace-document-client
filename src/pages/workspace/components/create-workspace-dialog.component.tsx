import { Typography, InputLabel } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useWorkspace } from '../../../contexts/workspace.context'
import { Formik, Form, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { TextFieldComponent } from '../../../components/textfield/text-field.component'
import { ButtonComponent } from '../../../components/button/button.component'
import { DialogComponent } from '../../../components/dialog/dialog.component'
import { StackColumnAlignStart, StackRowAlignCenterJustEnd } from '../../../components/mui-custom/stack/stack.mui-custom'

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
                <Form id="create-workspace-form" noValidate>
                    <DialogComponent
                        open={open}
                        onClose={onClose}
                        title={<StackColumnAlignStart>
                            <Typography variant="h6" fontWeight={600} component="div">
                                Tạo Workspace mới
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Workspace là nơi bạn và team lưu trữ, sắp xếp tài liệu.
                            </Typography>
                        </StackColumnAlignStart>}
                        maxWidth="sm"
                        fullWidth
                        renderActions={() => (
                            <StackRowAlignCenterJustEnd width="100%">
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
                                    form="create-workspace-form"
                                    loading={isSubmitting}
                                    icon={<AddIcon />}
                                >
                                    Tạo Workspace
                                </ButtonComponent>
                            </StackRowAlignCenterJustEnd>
                        )}
                    >
                        <StackColumnAlignStart sx={{ pt: 2, pb: 2 }}>
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
                        </StackColumnAlignStart>
                    </DialogComponent>
                </Form>
            )}
        </Formik>
    )
}
