import dayjs from 'dayjs'

export const getTimeAgo = (
    value: string | number | Date
): string => {
    if (!value) return ''

    const date = dayjs(value)
    if (!date.isValid()) return ''

    return date.fromNow()
}
