import { ToggleButton, ToggleButtonGroup, Stack, Typography, Popover, Drawer, useTheme, useMediaQuery } from '@mui/material'
import GridViewIcon from '@mui/icons-material/GridView'
import ViewListIcon from '@mui/icons-material/ViewList'
import FilterListIcon from '@mui/icons-material/FilterList'
import React, { useState } from 'react'
import { ButtonComponent } from '../../../../components/button/button.component'
import { ExplorerFilter } from './explorer-filter.part'

interface ExplorerToolbarProps {
    isDisableListView?: boolean
    viewMode: 'grid' | 'list'
    onViewChange: (mode: 'grid' | 'list') => void
}

export const ExplorerToolbar = ({ viewMode, onViewChange, isDisableListView = false }: ExplorerToolbarProps) => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const [filterAnchor, setFilterAnchor] = useState<HTMLElement | null>(null)

    const handleViewChange = (
        _event: React.MouseEvent<HTMLElement>,
        newView: 'grid' | 'list' | null,
    ) => {
        if (newView !== null) {
            onViewChange(newView)
        }
    }

    const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
        setFilterAnchor(event.currentTarget)
    }

    const handleFilterClose = () => {
        setFilterAnchor(null)
    }

    const filterContent = (
        <ExplorerFilter
            onApply={(filters) => {
                console.log('Filters applied:', filters)
                handleFilterClose()
            }}
            onClose={handleFilterClose}
            onReset={() => console.log('Reset filters')}
        />
    )

    return (
        <React.Fragment>
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                alignItems={{ xs: 'stretch', sm: 'center' }}
                justifyContent="space-between"
                mb={3}
                spacing={{ xs: 2, sm: 0 }}
            >
                <Typography variant="h5" fontWeight={700}>
                    Design Assets
                </Typography>

                <Stack direction="row" spacing={2}>
                    {!isDisableListView && (
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
                    )}

                    <ButtonComponent
                        variant="secondary"
                        icon={<FilterListIcon fontSize="small" />}
                        sizeUI="sm"
                        onClick={handleFilterClick}
                    >
                        Lọc
                    </ButtonComponent>


                </Stack>
            </Stack>


            {isMobile ? (
                <Drawer
                    anchor="bottom"
                    open={Boolean(filterAnchor)}
                    onClose={handleFilterClose}
                    PaperProps={{
                        sx: {
                            borderTopLeftRadius: 16,
                            borderTopRightRadius: 16
                        }
                    }}
                >
                    {filterContent}
                </Drawer>
            ) : (
                <Popover
                    open={Boolean(filterAnchor)}
                    anchorEl={filterAnchor}
                    onClose={handleFilterClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    PaperProps={{
                        sx: {
                            mt: 1,
                            borderRadius: 2,
                            boxShadow: theme.shadows[3]
                        }
                    }}
                >
                    {filterContent}
                </Popover>
            )}
        </React.Fragment>
    )
}
