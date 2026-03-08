import React, { useMemo } from 'react'
import { Stack, Box, InputLabel } from '@mui/material'
import { Formik, Form, FormikHelpers } from 'formik'
import dayjs from 'dayjs'
import useSWR, { mutate } from 'swr'
import { createWorkspaceAppointmentApi } from '../../../../apis/appointment/appointment.api'
import { listMembersApi } from '../../../../apis/workspace/workspace.api'
import { DialogComponent } from '../../../../components/dialog/dialog.component'
import { TextFieldComponent } from '../../../../components/textfield/text-field.component'
import { TextFieldDateTimeComponent } from '../../../../components/textfield/text-field-date-time.component'
import { MembersAutocompleteComponent } from '../../../../components/autocomplete/members-autocomplete.component'
import { validationSchema } from '../../constants/appointment-create.constant'

interface AppointmentCreatePartProps {
    open: boolean
    onClose: () => void
    workspaceId: string
    selectedDate: dayjs.Dayjs | null
}

interface AppointmentCreateFormValues {
    title: string
    description: string
    url: string
    startTime: string
    endTime: string
    participants: string[]
    reminderMinutes: number
}

const REMINDER_OPTIONS = [
    { value: 0, label: 'Đúng giờ' },
    { value: 5, label: 'Trước 5 phút' },
    { value: 15, label: 'Trước 15 phút' },
    { value: 30, label: 'Trước 30 phút' },
    { value: 60, label: 'Trước 1 giờ' },
    { value: 120, label: 'Trước 2 giờ' },
    { value: 1440, label: 'Trước 1 ngày' }
]

const FIELD_LABEL_SX = {
    mb: 0.5,
    fontSize: 13,
    fontWeight: 600,
    color: 'text.primary'
}

const getInitialValues = (selectedDate: dayjs.Dayjs | null): AppointmentCreateFormValues => {
    if (!selectedDate) {
        return {
            title: '',
            description: '',
            url: '',
            startTime: '',
            endTime: '',
            participants: [],
            reminderMinutes: 15
        }
    }

    return {
        title: '',
        description: '',
        url: '',
        startTime: selectedDate.hour(9).minute(0).second(0).format('YYYY-MM-DDTHH:mm'),
        endTime: selectedDate.hour(10).minute(0).second(0).format('YYYY-MM-DDTHH:mm'),
        participants: [],
        reminderMinutes: 15
    }
}

export const AppointmentCreatePart: React.FC<AppointmentCreatePartProps> = ({
    open,
    onClose,
    workspaceId,
    selectedDate
}) => {
    const initialValues = useMemo(
        () => getInitialValues(selectedDate),
        [selectedDate]
    )

    const { data: membersResponse, isLoading: loadingMembers } = useSWR(
        open ? ['workspaceMembers', workspaceId] : null,
        () => listMembersApi(workspaceId, { limit: 100 })
    )
    const members = membersResponse?.data || []

    const handleSubmit = async (
        values: AppointmentCreateFormValues,
        { setSubmitting, resetForm }: FormikHelpers<AppointmentCreateFormValues>
    ) => {
        try {
            await createWorkspaceAppointmentApi(workspaceId, {
                title: values.title.trim(),
                description: values.description.trim(),
                url: values.url.trim(),
                startTime: dayjs(values.startTime).toISOString(),
                endTime: dayjs(values.endTime).toISOString(),
                participants: values.participants.map(id => ({ userId: id })),
                reminder: {
                    minutesBefore: values.reminderMinutes
                }
            })

            await mutate(
                (key) =>
                    Array.isArray(key) &&
                    key[0] === 'workspaceAppointments' &&
                    key[1] === workspaceId,
                undefined,
                { revalidate: true }
            )

            resetForm()
            onClose()
        } catch (error) {
            console.error('Failed to create appointment', error)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Formik<AppointmentCreateFormValues>
            initialValues={initialValues}
            enableReinitialize
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
                submitForm,
                resetForm,
                setFieldValue
            }) => {
                const handleCloseModal = () => {
                    resetForm()
                    onClose()
                }

                return (
                    <DialogComponent
                        open={open}
                        onClose={handleCloseModal}
                        title="Thêm lịch hẹn mới"
                        onConfirm={submitForm}
                        confirmText="Tạo lịch hẹn"
                        cancelText="Hủy"
                        loading={isSubmitting}
                        maxWidth="sm"
                    >
                        <Form noValidate>
                            <Stack spacing={2} sx={{ mt: 1 }}>
                                <Box>
                                    <InputLabel sx={FIELD_LABEL_SX}>
                                        Tiêu đề (*)
                                    </InputLabel>
                                    <TextFieldComponent
                                        id="title"
                                        sizeUI="sm"
                                        name="title"
                                        placeholder="Nhập tiêu đề cuộc họp..."
                                        value={values.title}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.title && Boolean(errors.title)}
                                        helperText={touched.title && errors.title}
                                    />
                                </Box>

                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                    <Box flex={1}>
                                        <InputLabel sx={FIELD_LABEL_SX}>
                                            Thời gian bắt đầu (*)
                                        </InputLabel>
                                        <TextFieldDateTimeComponent
                                            sizeUI="sm"
                                            name="startTime"
                                            value={dayjs(values.startTime)}
                                            onChange={(newValue) => setFieldValue('startTime', newValue ? newValue.toISOString() : '')}
                                            error={touched.startTime && Boolean(errors.startTime)}
                                            errorMessage={touched.startTime ? (errors.startTime as string) : undefined}
                                        />
                                    </Box>

                                    <Box flex={1}>
                                        <InputLabel sx={FIELD_LABEL_SX}>
                                            Thời gian kết thúc (*)
                                        </InputLabel>
                                        <TextFieldDateTimeComponent
                                            sizeUI="sm"
                                            name="endTime"
                                            value={dayjs(values.endTime)}
                                            onChange={(newValue) => setFieldValue('endTime', newValue ? newValue.toISOString() : '')}
                                            error={touched.endTime && Boolean(errors.endTime)}
                                            errorMessage={touched.endTime ? (errors.endTime as string) : undefined}
                                        />
                                    </Box>
                                </Stack>

                                <Box>
                                    <InputLabel sx={FIELD_LABEL_SX}>
                                        Người tham gia
                                    </InputLabel>
                                    <MembersAutocompleteComponent
                                        members={members}
                                        loading={loadingMembers}
                                        value={values.participants}
                                        onChange={(newParticipants) => setFieldValue('participants', newParticipants)}
                                        error={touched.participants && Boolean(errors.participants)}
                                        helperText={touched.participants && (errors.participants as string)}
                                    />
                                </Box>

                                <Box>
                                    <InputLabel sx={FIELD_LABEL_SX}>
                                        Nhắc nhở
                                    </InputLabel>
                                    <TextFieldComponent
                                        select
                                        sizeUI="sm"
                                        name="reminderMinutes"
                                        value={values.reminderMinutes}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        SelectProps={{
                                            native: true,
                                        }}
                                    >
                                        {REMINDER_OPTIONS.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </TextFieldComponent>
                                </Box>

                                <Box>
                                    <InputLabel sx={FIELD_LABEL_SX}>
                                        Đường dẫn cuộc họp (URL)
                                    </InputLabel>
                                    <TextFieldComponent
                                        id="url"
                                        sizeUI="sm"
                                        name="url"
                                        placeholder="https://meet.google.com/..."
                                        value={values.url}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.url && Boolean(errors.url)}
                                        helperText={touched.url && errors.url}
                                    />
                                </Box>

                                <Box>
                                    <InputLabel sx={FIELD_LABEL_SX}>
                                        Mô tả
                                    </InputLabel>
                                    <TextFieldComponent
                                        id="description"
                                        sizeUI="sm"
                                        name="description"
                                        placeholder="Nhập ghi chú cho lịch hẹn này..."
                                        multiline
                                        rows={3}
                                        value={values.description}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.description && Boolean(errors.description)}
                                        helperText={touched.description && errors.description}
                                    />
                                </Box>
                            </Stack>
                        </Form>
                    </DialogComponent>
                )
            }}
        </Formik >
    )
}