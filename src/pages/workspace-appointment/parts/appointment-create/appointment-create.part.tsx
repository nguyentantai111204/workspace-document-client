import React, { useMemo } from 'react'
import { Stack, Box, InputLabel, Autocomplete, Chip, Avatar } from '@mui/material'
import { Formik, Form, FormikHelpers } from 'formik'
import dayjs from 'dayjs'
import useSWR, { mutate } from 'swr'
import { createWorkspaceAppointmentApi } from '../../../../apis/appointment/appointment.api'
import { listMembersApi } from '../../../../apis/workspace/workspace.api'
import { DialogComponent } from '../../../../components/dialog/dialog.component'
import { TextFieldComponent } from '../../../../components/textfield/text-field.component'
import { TextFieldDateTimeComponent } from '../../../../components/textfield/text-field-date-time.component'
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
}

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
            participants: []
        }
    }

    return {
        title: '',
        description: '',
        url: '',
        startTime: selectedDate.hour(9).minute(0).second(0).format('YYYY-MM-DDTHH:mm'),
        endTime: selectedDate.hour(10).minute(0).second(0).format('YYYY-MM-DDTHH:mm'),
        participants: []
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
                participants: values.participants.map(id => ({ userId: id }))
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
                                    <Autocomplete
                                        multiple
                                        size="small"
                                        options={members}
                                        loading={loadingMembers}
                                        getOptionLabel={(option) => option.fullName || option.email}
                                        isOptionEqualToValue={(option, value) => option.userId === value.userId}
                                        value={members.filter((m: any) => values.participants.includes(m.userId))}
                                        onChange={(_, newValue) => {
                                            setFieldValue('participants', newValue.map(v => v.userId))
                                        }}
                                        renderOption={(props, option) => {
                                            const { key, ...liProps } = props as any
                                            return (
                                                <Box component="li" key={key} {...liProps}>
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <Avatar src={option.avatarUrl || undefined} sx={{ width: 24, height: 24 }} />
                                                        <Box>
                                                            <Box sx={{ fontSize: 13, fontWeight: 500 }}>{option.fullName}</Box>
                                                            <Box sx={{ fontSize: 11, color: 'text.secondary', lineHeight: 1 }}>{option.email}</Box>
                                                        </Box>
                                                    </Stack>
                                                </Box>
                                            )
                                        }}
                                        renderTags={(value, getTagProps) =>
                                            value.map((option, index) => {
                                                const { key, ...tagProps } = getTagProps({ index })
                                                return (
                                                    <Chip
                                                        key={key}
                                                        avatar={<Avatar src={option.avatarUrl || undefined} />}
                                                        label={option.fullName || option.email}
                                                        size="small"
                                                        {...tagProps}
                                                    />
                                                )
                                            })
                                        }
                                        renderInput={(params) => (
                                            <TextFieldComponent
                                                {...params}
                                                sizeUI="sm"
                                                placeholder="Chọn người tham gia..."
                                                error={touched.participants && Boolean(errors.participants)}
                                                helperText={touched.participants && (errors.participants as string)}
                                            />
                                        )}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                minHeight: 40,
                                                padding: '3px 8px',
                                            },
                                        }}
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