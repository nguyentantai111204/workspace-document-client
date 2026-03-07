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