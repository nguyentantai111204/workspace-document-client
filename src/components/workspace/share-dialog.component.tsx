import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography, IconButton, Stack, Chip, MenuItem, Select, FormControl, InputLabel, alpha, useTheme } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { useState } from 'react'

interface ShareDialogProps {
    open: boolean
    onClose: () => void
}

export const ShareDialog = ({ open, onClose }: ShareDialogProps) => {
    const theme = useTheme()
    const [emails, setEmails] = useState<string>('')
    const [role, setRole] = useState('viewer')

    const handleSubmit = () => {
        // Implement invite logic here
        console.log('Invite sent to:', emails, 'Role:', role)
        onClose()
        setEmails('')
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 2 }
            }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3 }}>
                <Typography variant="h6" fontWeight={700}>
                    Chia sẻ Workspace
                </Typography>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Mời thành viên mới tham gia vào workspace để cùng làm việc.
                </Typography>

                <Stack spacing={3}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                            fullWidth
                            label="Nhập địa chỉ email"
                            placeholder="user@example.com"
                            value={emails}
                            onChange={(e) => setEmails(e.target.value)}
                            size="small"
                        />
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <InputLabel>Vai trò</InputLabel>
                            <Select
                                value={role}
                                label="Vai trò"
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <MenuItem value="viewer">Viewer</MenuItem>
                                <MenuItem value="editor">Editor</MenuItem>
                                <MenuItem value="admin">Admin</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    <Box>
                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
                            Thành viên hiện tại
                        </Typography>
                        <Stack spacing={1.5}>
                            {/* Mock members */}
                            {['Admin', 'User 1'].map((user, index) => (
                                <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, borderRadius: 1, '&:hover': { bgcolor: alpha(theme.palette.grey[500], 0.08) } }}>
                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                        <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'common.white', fontSize: 14 }}>
                                            {user.charAt(0)}
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" fontWeight={500}>{user}</Typography>
                                            <Typography variant="caption" color="text.secondary">{user === 'Admin' ? 'admin@doc.com' : 'user@doc.com'}</Typography>
                                        </Box>
                                    </Stack>
                                    <Chip label={user === 'Admin' ? 'Owner' : 'Editor'} size="small" variant="outlined" />
                                </Box>
                            ))}
                        </Stack>
                    </Box>
                </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
                <Button onClick={onClose} color="inherit">Hủy</Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    startIcon={<PersonAddIcon />}
                >
                    Gửi lời mời
                </Button>
            </DialogActions>
        </Dialog>
    )
}
