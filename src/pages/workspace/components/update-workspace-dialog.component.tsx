import { Typography, Box, InputLabel } from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import { useWorkspace } from '../../../contexts/workspace.context'
import { Formik, Form, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { TextFieldComponent } from '../../../components/textfield/text-field.component'
import { ButtonComponent } from '../../../components/button/button.component'
import { WorkspaceResponse } from '../../../apis/workspace/workspace.interface'
import { DialogComponent } from '../../../components/dialog/dialog.component'
import { StackRowAlignCenterJustEnd } from '../../../components/mui-custom/stack/stack.mui-custom'

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
                <Form id="update-workspace-form" noValidate>
                    <DialogComponent
                        open={open}
                        onClose={onClose}
                        title="Cập nhật Workspace"
                        maxWidth="sm"
                        fullWidth
                        renderActions={() => (
                            <StackRowAlignCenterJustEnd sx={{ width: '100%' }}>
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
                                    form="update-workspace-form"
                                    loading={isSubmitting}
                                    icon={<SaveIcon />}
                                >
                                    Lưu thay đổi
                                </ButtonComponent>
                            </StackRowAlignCenterJustEnd>
                        )}
                    >
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Tùy chỉnh tên workspace để giúp bạn và đồng đội dễ dàng nhận diện dự án hơn.
                        </Typography>

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
                                placeholder="VD: Dự án Marketing..."
                                value={values.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.name && !!errors.name}
                                helperText={touched.name && errors.name}
                                fullWidth
                            />
                        </Box>
                    </DialogComponent>
                </Form>
            )}
        </Formik>
    )
}
