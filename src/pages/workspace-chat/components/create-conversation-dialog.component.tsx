import { useState } from 'react'
import {
    Box,
    Chip,
    Typography,
    Stack,
    FormHelperText,
    InputLabel,
    DialogActions
} from '@mui/material'
import { useWorkspace } from '../../../contexts/workspace.context'
import { useWorkspaceMembers } from '../../../hooks/use-workspace-member.hook'
import { createConversationApi } from '../../../apis/chat/chat.api'
import { ConversationType } from '../../../apis/chat/chat.interface'
import { useAppDispatch } from '../../../redux/store.redux'
import { showSnackbar } from '../../../redux/system/system.slice'
import { MemberResponse } from '../../../apis/workspace/workspace.interface'
import { PAGE_LIMIT_DEFAULT } from '../../../common/constant/page-take.constant'
import { Formik, Form, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { TextFieldComponent } from '../../../components/textfield/text-field.component'
import { DialogComponent } from '../../../components/dialog/dialog.component'
import { RadioGroupComponent } from '../../../components/radio-group/radio-group.component'
import { ButtonComponent } from '../../../components/button/button.component'

interface CreateConversationDialogProps {
    open: boolean
    onClose: () => void
    onSuccess?: (conversationId: string) => void
}

interface CreateConversationFormValues {
    type: ConversationType
    name: string
    participantIds: string[]
    selectedMembers: MemberResponse[] // Helper field for UI display
}

const validationSchema = Yup.object({
    type: Yup.string().required(),
    name: Yup.string().when('type', {
        is: 'GROUP',
        then: schema => schema.required('Vui lòng nhập tên nhóm')
            .min(3, 'Tên nhóm phải có ít nhất 3 ký tự')
            .max(50, 'Tên nhóm không được quá 50 ký tự'),
        otherwise: schema => schema.optional()
    }),
    participantIds: Yup.array()
        .min(1, 'Vui lòng chọn ít nhất một thành viên')
        .test('max-participants', 'Tin nhắn trực tiếp chỉ có thể với 1 người', function (val) {
            const type = this.parent.type
            if (type === 'DIRECT' && val && val.length > 1) {
                return false
            }
            return true
        })
})

export const CreateConversationDialog = ({
    open,
    onClose,
    onSuccess
}: CreateConversationDialogProps) => {
    const dispatch = useAppDispatch()
    const { currentWorkspace } = useWorkspace()
    const [searchQuery, setSearchQuery] = useState('')

    // Fetch workspace members
    const { members } = useWorkspaceMembers(currentWorkspace?.id, {
        search: searchQuery || undefined,
        page: 1,
        limit: PAGE_LIMIT_DEFAULT.limit
    })

    const initialValues: CreateConversationFormValues = {
        type: 'DIRECT',
        name: '',
        participantIds: [],
        selectedMembers: []
    }

    const handleSubmit = async (
        values: CreateConversationFormValues,
        { setSubmitting, resetForm }: FormikHelpers<CreateConversationFormValues>
    ) => {
        if (!currentWorkspace) return

        try {
            const response = await createConversationApi(currentWorkspace.id, {
                type: values.type,
                name: values.type === 'GROUP' ? values.name : undefined,
                participantIds: values.participantIds
            })

            dispatch(showSnackbar({
                message: 'Đã tạo cuộc trò chuyện',
                severity: 'success'
            }))

            resetForm()
            setSearchQuery('')
            onSuccess?.(response.id)
            onClose()
        } catch (error: any) {
            dispatch(showSnackbar({
                message: error.response?.data?.message || 'Không thể tạo cuộc trò chuyện',
                severity: 'error'
            }))
        } finally {
            setSubmitting(false)
        }
    }

    const handleClose = (resetForm: () => void) => {
        resetForm()
        setSearchQuery('')
        onClose()
    }

    return (
        <DialogComponent
            open={open}
            onClose={onClose}
            title="Tạo cuộc trò chuyện mới"
            showActions={false}
        >
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
                    setFieldValue,
                    isSubmitting,
                    resetForm
                }) => {
                    const handleToggleMember = (member: MemberResponse) => {
                        const currentIds = values.participantIds
                        const currentMembers = values.selectedMembers
                        const exists = currentIds.includes(member.userId)

                        let newIds: string[]
                        let newMembers: MemberResponse[]

                        if (exists) {
                            newIds = currentIds.filter(id => id !== member.userId)
                            newMembers = currentMembers.filter(m => m.userId !== member.userId)
                        } else {
                            // If DIRECT, replace selection instead of adding
                            if (values.type === 'DIRECT') {
                                newIds = [member.userId]
                                newMembers = [member]
                            } else {
                                newIds = [...currentIds, member.userId]
                                newMembers = [...currentMembers, member]
                            }
                        }

                        setFieldValue('participantIds', newIds)
                        setFieldValue('selectedMembers', newMembers)
                    }

                    const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                        const newType = event.target.value as ConversationType
                        setFieldValue('type', newType)

                        setFieldValue('participantIds', [])
                        setFieldValue('selectedMembers', [])
                    }

                    return (
                        <Form>
                            <Stack spacing={3} sx={{ mt: 1 }}>
                                <RadioGroupComponent
                                    label="Loại cuộc trò chuyện"
                                    name="type"
                                    value={values.type}
                                    onChange={handleTypeChange}
                                    options={[
                                        { value: 'DIRECT', label: 'Trực tiếp (1-1)' },
                                        { value: 'GROUP', label: 'Nhóm' }
                                    ]}
                                    error={Boolean(errors.type && touched.type)}
                                    helperText={touched.type && errors.type ? errors.type : undefined}
                                    direction="row"
                                />

                                {values.type === 'GROUP' && (
                                    <Box>
                                        <InputLabel sx={{ mb: 0.5, fontSize: 13, fontWeight: 600 }}>
                                            Tên nhóm <span style={{ color: 'red' }}>*</span>
                                        </InputLabel>
                                        <TextFieldComponent
                                            name="name"
                                            placeholder="Nhập tên nhóm..."
                                            value={values.name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.name && Boolean(errors.name)}
                                            errorMessage={touched.name ? errors.name : undefined}
                                            sizeUI="sm"
                                        />
                                    </Box>
                                )}

                                <Box>
                                    <TextFieldComponent
                                        label="Tìm thành viên"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Nhập tên hoặc email..."
                                        sizeUI="sm"
                                    />
                                </Box>

                                {values.selectedMembers.length > 0 && (
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" gutterBottom>
                                            Đã chọn ({values.selectedMembers.length})
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                                            {values.selectedMembers.map((member) => (
                                                <Chip
                                                    key={member.userId}
                                                    label={member.fullName}
                                                    onDelete={() => handleToggleMember(member)}
                                                    size="small"
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                            ))}
                                        </Box>
                                        {touched.participantIds && errors.participantIds && (
                                            <FormHelperText error sx={{ mt: 1 }}>
                                                {errors.participantIds}
                                            </FormHelperText>
                                        )}
                                    </Box>
                                )}

                                <Box>
                                    <Typography variant="caption" color="text.secondary" gutterBottom>
                                        Thành viên trong workspace
                                    </Typography>
                                    <Box
                                        sx={{
                                            maxHeight: 300,
                                            overflow: 'auto',
                                            mt: 1,
                                            border: 1,
                                            borderColor: 'divider',
                                            borderRadius: 1,
                                            p: 1
                                        }}
                                    >
                                        {members.length === 0 ? (
                                            <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
                                                Không tìm thấy thành viên
                                            </Typography>
                                        ) : (
                                            <Stack spacing={0.5}>
                                                {members.map((member) => {
                                                    const isSelected = values.participantIds.includes(member.userId)
                                                    // Disable if DIRECT mode and already selected another user
                                                    const isDisabled = values.type === 'DIRECT'
                                                        && values.participantIds.length > 0
                                                        && !isSelected

                                                    return (
                                                        <Box
                                                            key={member.userId}
                                                            onClick={() => !isDisabled && handleToggleMember(member)}
                                                            sx={{
                                                                p: 1.5,
                                                                borderRadius: 1,
                                                                cursor: isDisabled ? 'not-allowed' : 'pointer',
                                                                bgcolor: isSelected ? 'action.selected' : 'transparent',
                                                                opacity: isDisabled ? 0.5 : 1,
                                                                '&:hover': {
                                                                    bgcolor: isDisabled ? 'transparent' : isSelected ? 'action.selected' : 'action.hover'
                                                                }
                                                            }}
                                                        >
                                                            <Typography variant="body2" fontWeight={isSelected ? 600 : 400}>
                                                                {member.fullName}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {member.email}
                                                            </Typography>
                                                        </Box>
                                                    )
                                                })}
                                            </Stack>
                                        )}
                                    </Box>
                                </Box>
                            </Stack>

                            <DialogActions sx={{ px: 0, pt: 3 }}>
                                <ButtonComponent
                                    variant="ghost"
                                    onClick={() => handleClose(resetForm)}
                                    disabled={isSubmitting}
                                    sizeUI="sm"
                                >
                                    Hủy
                                </ButtonComponent>
                                <ButtonComponent
                                    variant="primary"
                                    type="submit"
                                    disabled={isSubmitting}
                                    loading={isSubmitting}
                                    sizeUI="sm"
                                >
                                    Tạo
                                </ButtonComponent>
                            </DialogActions>
                        </Form>
                    )
                }}
            </Formik>
        </DialogComponent>
    )
}
