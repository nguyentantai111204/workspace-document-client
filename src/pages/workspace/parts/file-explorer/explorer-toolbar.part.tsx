import { ToggleButton, ToggleButtonGroup, Stack, Typography } from '@mui/material'
import GridViewIcon from '@mui/icons-material/GridView'
import ViewListIcon from '@mui/icons-material/ViewList'
import FilterListIcon from '@mui/icons-material/FilterList'
import React from 'react'
import { ButtonComponent } from '../../../../components/button/button.component'

interface ExplorerToolbarProps {
    viewMode: 'grid' | 'list'
    onViewChange: (mode: 'grid' | 'list') => void
}

export const ExplorerToolbar = ({ viewMode, onViewChange }: ExplorerToolbarProps) => {
    const handleViewChange = (
        _event: React.MouseEvent<HTMLElement>,
        newView: 'grid' | 'list' | null,
    ) => {
        if (newView !== null) {
            onViewChange(newView)
        }
    }

    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={3}
        >
            <Typography variant="h5" fontWeight={700}>
                Design Assets
            </Typography>

            <Stack direction="row" spacing={2}>
                <ToggleButtonGroup
                    value={viewMode}
                    exclusive
                    onChange={handleViewChange}
                    aria-label="view mode"
                    size="small"
                    color="primary"
                >
                    <ToggleButton value="grid" aria-label="grid view">
                        <GridViewIcon fontSize="small" />
                    </ToggleButton>
                    <ToggleButton value="list" aria-label="list view">
                        <ViewListIcon fontSize="small" />
                    </ToggleButton>
                </ToggleButtonGroup>

                <ButtonComponent
                    variant="secondary"
                    icon={<FilterListIcon fontSize="small" />}
                    sizeUI="sm"
                >
                    Lọc
                </ButtonComponent>
            </Stack>
        </Stack>
    )
}
