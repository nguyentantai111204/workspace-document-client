import { Box, InputLabel } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import { Formik, Form, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { TextFieldComponent } from '../../../components/textfield/text-field.component'
import { ButtonComponent } from '../../../components/button/button.component'
import { DialogComponent } from '../../../components/dialog/dialog.component'
import { StackRowAlignCenterJustEnd } from '../../../components/mui-custom/stack/stack.mui-custom'

interface UpdateFileModalProps {
    open: boolean
    fileName: string
    onClose: () => void
    onSubmit: (name: string) => Promise<void>
}

interface FileValues {
    name: string
}

const validationSchema = Yup.object({
    name: Yup.string()
        .required('Tên file không được để trống')
        .max(255, 'Tên file không được quá 255 ký tự')
})

export const UpdateFileModal = ({ open, fileName, onClose, onSubmit }: UpdateFileModalProps) => {

    const handleSubmit = async (
        values: FileValues,
        { setSubmitting }: FormikHelpers<FileValues>
    ) => {
        try {
            if (values.name !== fileName) {
                await onSubmit(values.name)
            }
            onClose()
        } catch (err) {
            console.error(err)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Formik
            initialValues={{ name: fileName }}
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
                <DialogComponent
                    open={open}
                    onClose={onClose}
                    title="Đổi tên file"
                    maxWidth="sm"
                    fullWidth
                    renderActions={() => (
                        <StackRowAlignCenterJustEnd gap={1} width="100%">
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
                                form="update-file-form"
                                loading={isSubmitting}
                                icon={<EditIcon fontSize='small' />}
                            >
                                Lưu thay đổi
                            </ButtonComponent>
                        </StackRowAlignCenterJustEnd>
                    )}
                >
                    <Form id="update-file-form" noValidate>
                        <Box mb={3}>
                            <InputLabel
                                sx={{
                                    mb: 0.5,
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: 'text.primary'
                                }}
                            >
                                Tên File
                            </InputLabel>
                            <TextFieldComponent
                                autoFocus
                                sizeUI="sm"
                                name="name"
                                placeholder="Nhập tên file mới"
                                value={values.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.name && !!errors.name}
                                helperText={touched.name && errors.name}
                            />
                        </Box>
                    </Form>
                </DialogComponent>
            )}
        </Formik>
    )
}
