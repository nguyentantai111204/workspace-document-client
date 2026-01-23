import { Breadcrumbs, Link, Typography, useTheme } from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'

export interface BreadcrumbItem {
    label: string
    href?: string
    onClick?: () => void
}

interface BreadcrumbComponentProps {
    items: BreadcrumbItem[]
    separator?: React.ReactNode
    maxItems?: number
}

export const BreadcrumbComponent = ({
    items,
    separator = <NavigateNextIcon fontSize="small" />,
    maxItems,
}: BreadcrumbComponentProps) => {
    const theme = useTheme()

    return (
        <Breadcrumbs
            separator={separator}
            maxItems={maxItems}
            sx={{
                '& .MuiBreadcrumbs-separator': {
                    color: 'text.secondary',
                },
            }}
        >
            {items.map((item, index) => {
                const isLast = index === items.length - 1

                if (isLast) {
                    return (
                        <Typography
                            key={index}
                            variant="body2"
                            color="text.primary"
                            fontWeight={600}
                            noWrap
                        >
                            {item.label}
                        </Typography>
                    )
                }

                return (
                    <Link
                        key={index}
                        href={item.href}
                        onClick={item.onClick}
                        underline="hover"
                        color="text.secondary"
                        sx={{
                            cursor: item.href || item.onClick ? 'pointer' : 'default',
                            fontSize: '0.875rem',
                            transition: theme.transitions.create(['color']),
                            '&:hover': {
                                color: 'primary.main',
                            },
                        }}
                    >
                        {item.label}
                    </Link>
                )
            })}
        </Breadcrumbs>
    )
}
