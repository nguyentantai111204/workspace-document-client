import React, { useMemo } from 'react'
import { Stack, Box, InputLabel } from '@mui/material'
import { Formik, Form, FormikHelpers } from 'formik'
import dayjs from 'dayjs'
import useSWR, { mutate } from 'swr'
import { createWorkspaceAppointmentApi } from '../../../../apis/appointment/appointment.api'
import { CreateAppointmentDto } from '../../../../apis/appointment/appointment.interface'
import { listMembersApi } from '../../../../apis/workspace/workspace.api'
import { DialogComponent } from '../../../../components/dialog/dialog.component'
import { TextFieldComponent } from '../../../../components/textfield/text-field.component'
import { TextFieldSelectComponent } from '../../../../components/textfield/text-field-select.component'
import { TextFieldDateTimeComponent } from '../../../../components/textfield/text-field-date-time.component'
import { MembersAutocompleteComponent } from '../../../../components/autocomplete/members-autocomplete.component'
import { validationSchema, FIELD_LABEL_SX, getAvailableReminderOptions, DEFAULT_REMINDER_MINUTES } from '../../constants/appointment.constant'
import { AppointmentReminderTargetMode } from '../../enums/appointment.enum'

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
    reminderMinutes: number | ''
}

const DEFAULT_VALUES: AppointmentCreateFormValues = {
    title: '',
    description: '',
    url: '',
    startTime: '',
    endTime: '',
    participants: [],
    reminderMinutes: DEFAULT_REMINDER_MINUTES
}

const getInitialValues = (
    selectedDate: dayjs.Dayjs | null
): AppointmentCreateFormValues => {
    if (!selectedDate) return DEFAULT_VALUES

    return {
        ...DEFAULT_VALUES,
        startTime: selectedDate.hour(9).minute(0).second(0).toISOString(),
        endTime: selectedDate.hour(10).minute(0).second(0).toISOString()
    }
}

const buildAppointmentPayload = (values: AppointmentCreateFormValues): CreateAppointmentDto => {
    const { isReminderDisabled } = getAvailableReminderOptions(values.startTime, dayjs)

    const payload: CreateAppointmentDto = {
        title: values.title.trim(),
        description: values.description.trim(),
        url: values.url.trim(),
        startTime: values.startTime ? dayjs(values.startTime).toISOString() : '',
        endTime: values.endTime ? dayjs(values.endTime).toISOString() : '',
        participants: values.participants.map(id => ({ userId: id }))
    }

    if (!isReminderDisabled && values.reminderMinutes !== '') {
        payload.reminder = {
            minutesBefore: Number(values.reminderMinutes),
            targetMode: AppointmentReminderTargetMode.SELECTED_PARTICIPANTS
        }
    }

    return payload
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
            const appointmentPayload = buildAppointmentPayload(values)
            await createWorkspaceAppointmentApi(workspaceId, appointmentPayload)

            await mutate(
                (key) =>
                    Array.isArray(key) &&
                    key[0] === 'workspaceAppointments' &&
                    key[1] === workspaceId,
                undefined,
                { revalidate: true }
            )

            resetForm({ values: initialValues })
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
                    resetForm({ values: initialValues })
                    onClose()
                }

                const { availableOptions, isReminderDisabled } = getAvailableReminderOptions(values.startTime, dayjs)

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
                                            value={values.startTime ? dayjs(values.startTime) : null}
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
                                            value={values.endTime ? dayjs(values.endTime) : null}
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
                                    <TextFieldSelectComponent
                                        sizeUI="sm"
                                        name="reminderMinutes"
                                        value={isReminderDisabled ? '' : values.reminderMinutes}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        disabled={isReminderDisabled}
                                        options={isReminderDisabled ? [
                                            { value: '', label: 'Thời gian sát giờ, không thể nhắc nhở' }
                                        ] : availableOptions}
                                    />
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