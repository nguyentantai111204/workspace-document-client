import * as Yup from 'yup'

export const validationSchema = Yup.object({
    title: Yup.string().required('Vui lòng nhập tiêu đề'),
    description: Yup.string(),
    url: Yup.string().url('URL không hợp lệ'),
    participants: Yup.array().of(Yup.string()),
    startTime: Yup.date().required('Vui lòng chọn thời gian bắt đầu'),
    endTime: Yup.date()
        .required('Vui lòng chọn thời gian kết thúc')
        .min(Yup.ref('startTime'), 'Thời gian kết thúc phải sau thời gian bắt đầu')
})

export const REMINDER_OPTIONS = [
    { value: 5, label: 'Lúc bắt đầu / Trước 5 phút' },
    { value: 10, label: 'Trước 10 phút' },
    { value: 15, label: 'Trước 15 phút' },
    { value: 30, label: 'Trước 30 phút' },
    { value: 60, label: 'Trước 1 giờ' }
]

export const FIELD_LABEL_SX = {
    mb: 0.5,
    fontSize: 13,
    fontWeight: 600,
    color: 'text.primary'
}

export const DEFAULT_REMINDER_MINUTES = 5

export const getAvailableReminderOptions = (startTime: string | null | undefined, dayjsInstance: any) => {
    if (!startTime) return { availableOptions: [], isReminderDisabled: true }

    const parsedStart = dayjsInstance(startTime)
    if (!parsedStart.isValid()) return { availableOptions: [], isReminderDisabled: true }

    const minutesRemaining = parsedStart.diff(dayjsInstance(), 'minute')
    const availableOptions = REMINDER_OPTIONS.filter(opt => minutesRemaining > opt.value)

    return {
        availableOptions,
        isReminderDisabled: availableOptions.length === 0
    }
}