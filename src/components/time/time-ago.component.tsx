import { Typography } from '@mui/material'
import dayjs from 'dayjs'
import { useNow } from '../../providers/time-ago.provider'

interface TimeAgoProps {
    value: string | number | Date
}

export const TimeAgo = ({ value }: TimeAgoProps) => {
    const now = useNow()

    return (
        <Typography variant="caption" color="text.secondary">
            {dayjs(value).from(now)}
        </Typography>
    )
}
