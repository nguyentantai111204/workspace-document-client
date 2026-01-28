import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Box, InputLabel } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import { Formik, Form, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { TextFieldComponent } from '../../../components/textfield/text-field.component'
import { ButtonComponent } from '../../../components/button/button.component'

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
                    Đổi tên file
                </Typography>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 3 }}>
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
                                    icon={<EditIcon fontSize='small' />}
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
