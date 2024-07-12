import React, { FC, useState } from 'react';
import SettingsDialog, { SettingsDialogProps } from "./SettingsDialog";
import { sendPasswordResetEmail, Auth } from "@firebase/auth";

import { Button, DialogContentText } from "@mui/material";

interface PasswordResetDialogProps extends SettingsDialogProps { auth: Auth; email: string | null; }

const PasswordResetDialog: FC<PasswordResetDialogProps> = ({ auth, email, toggle, open, ...rest }: PasswordResetDialogProps) => {
    const [message, setMessage] = useState(`An email will be sent to the address we have on file.`);
    const handleSubmit = async () => {
        if (!email) return setMessage('Error: No email address found!');
        setMessage('Sending Password Reset Email...');
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Password Reset Email Sent!');
        } catch (e) {
            setMessage('Error: Unable To Reset Password!');
            console.error(e);
        }
    }

    return(
        <SettingsDialog title={'Password Reset'} toggle={toggle} open={open} alert={message}
                        actions={<Button color='primary' onClick={handleSubmit}>RESET</Button>} {...rest}
        >
            <DialogContentText sx={{ color: 'grey.600', fontSize: '1rem', mb: 1 }}>
                Would you like to receive an email with steps to reset your password?
            </DialogContentText>
        </SettingsDialog>
    )
};

export default PasswordResetDialog;