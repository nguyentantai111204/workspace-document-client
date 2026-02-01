import { Typography } from '@mui/material'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/vi'
import { useNow } from '../../providers/time-ago.provider'

dayjs.extend(relativeTime)
dayjs.locale('vi')

interface TimeAgoProps {
    value: string | number | Date
}

export const TimeAgoComponent = ({ value }: TimeAgoProps) => {
    const now = useNow()

    return (
        <Typography variant="caption" color="text.secondary">
            {dayjs(value).from(now)}
        </Typography>
    )
}
