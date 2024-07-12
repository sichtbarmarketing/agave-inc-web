import { FC, ReactNode } from 'react';
import { Dialog, DialogProps, DialogTitle, IconButton, DialogContent, DialogActions, Alert, Box } from "@mui/material";
import { Close } from "@mui/icons-material";

export interface SettingsDialogProps extends DialogProps {
    toggle: (value?: boolean) => void;
    title?: string;
    children?: ReactNode;
    actions?: ReactNode;
    alert?: string;
}

const SettingsDialog: FC<SettingsDialogProps> = ({toggle, title, children, actions, alert, ...rest}: SettingsDialogProps) => {

    const handleClose = () => toggle(false);

    return(
        <Dialog onClose={handleClose} fullWidth maxWidth='xs' {...rest}>
            <DialogTitle sx={{ fontWeight: 700, mt: 1, position: 'relative' }}>
                {title ?? 'Settings Dialog'}
                <IconButton onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 0 }}>
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                {children}
            </DialogContent>
            <Box px={3} minHeight={(theme) => theme.spacing(4)}>
                <Alert severity={'info'} sx={{ py: 0, pl: 1 }}>
                    {alert ?? 'Got questions? Contact Agave for more information.'}
                </Alert>
            </Box>
            <DialogActions>
                {actions}
            </DialogActions>
        </Dialog>
    );
};

export default SettingsDialog;