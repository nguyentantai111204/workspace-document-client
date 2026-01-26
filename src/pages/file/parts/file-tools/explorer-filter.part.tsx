import { Box, Typography, Stack, Divider, RadioGroup, FormControlLabel, Radio } from '@mui/material'
import { useState } from 'react'
import { CheckboxComponent } from '../../../../components/checkbox/checkbox.component'
import { ButtonComponent } from '../../../../components/button/button.component'

interface ExplorerFilterProps {
    onApply: (filters: any) => void
    onClose: () => void
    onReset: () => void
}

export const ExplorerFilter = ({ onApply, onClose, onReset }: ExplorerFilterProps) => {
    const [fileTypes, setFileTypes] = useState({
        folder: true,
        image: true,
        document: true,
    })
    const [dateSort, setDateSort] = useState('newest')

    const handleChangeType = (type: keyof typeof fileTypes) => {
        setFileTypes(prev => ({ ...prev, [type]: !prev[type] }))
    }

    const handleApply = () => {
        onApply({ fileTypes, dateSort })
        onClose()
    }

    return (
        <Box sx={{ p: 3, width: { xs: '100%', sm: 320 } }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
                Bộ lọc
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Loại tệp
            </Typography>
            <Stack spacing={1.5} mb={3}>
                <CheckboxComponent
                    label="Thư mục"
                    checked={fileTypes.folder}
                    onChange={() => handleChangeType('folder')}
                    sizeUI="sm"
                />
                <CheckboxComponent
                    label="Hình ảnh"
                    checked={fileTypes.image}
                    onChange={() => handleChangeType('image')}
                    sizeUI="sm"
                />
                <CheckboxComponent
                    label="Tài liệu"
                    checked={fileTypes.document}
                    onChange={() => handleChangeType('document')}
                    sizeUI="sm"
                />
            </Stack>

            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Thời gian
            </Typography>
            <RadioGroup
                value={dateSort}
                onChange={(e) => setDateSort(e.target.value)}
                sx={{ mb: 4 }}
            >
                <FormControlLabel
                    value="newest"
                    control={<Radio size="small" />}
                    label={<Typography variant="body2">Mới nhất</Typography>}
                />
                <FormControlLabel
                    value="oldest"
                    control={<Radio size="small" />}
                    label={<Typography variant="body2">Cũ nhất</Typography>}
                />
            </RadioGroup>

            <Stack direction="row" spacing={1.5}>
                <ButtonComponent
                    variant="secondary"
                    fullWidth
                    onClick={onReset}
                >
                    Đặt lại
                </ButtonComponent>
                <ButtonComponent
                    variant="primary"
                    fullWidth
                    onClick={handleApply}
                >
                    Áp dụng
                </ButtonComponent>
            </Stack>
        </Box>
    )
}
