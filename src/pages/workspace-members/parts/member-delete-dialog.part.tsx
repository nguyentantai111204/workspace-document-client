import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from '@mui/material'
import { MemberResponse } from '../../../apis/workspace/workspace.interface'

interface MemberDeleteDialogProps {
    open: boolean
    onClose: () => void
    member: MemberResponse | null
    onConfirm: () => void
}

export const MemberDeleteDialog = ({
    open,
    onClose,
    member,
    onConfirm
}: MemberDeleteDialogProps) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Xóa thành viên</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Bạn có chắc chắn muốn xóa <strong>{member?.fullName}</strong> khỏi workspace?
                    Hành động này không thể hoàn tác.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Hủy</Button>
                <Button onClick={onConfirm} color="error" variant="contained">
                    Xóa
                </Button>
            </DialogActions>
        </Dialog>
    )
}
