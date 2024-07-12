import React, { FC, useState } from 'react';
import SettingsDialog, { SettingsDialogProps } from "./SettingsDialog";
import { sendEmailVerification, User } from "firebase/auth";
import { Button, DialogContentText } from "@mui/material";

interface EmailVerificationDialogProps extends SettingsDialogProps { user: User | null; }

const EmailVerificationDialog: FC<EmailVerificationDialogProps> = ({ user, toggle, open, ...rest }: EmailVerificationDialogProps) => {
    const [message, setMessage] = useState(`Your Email is ${user?.emailVerified ? 'verified' : 'unverified'}!`)
    const handleSubmit = async () => {
        if (!user || !user.email) return setMessage('Error: No email address found!');
        setMessage('Sending Email Verification...');
        try {
            await sendEmailVerification(user);
            setMessage('Email Verification Sent!');
        } catch (e) {
            setMessage('Error: Unable to send email verification.');
            console.error(e);
        }
    }

    return(
        <SettingsDialog title={'Email Verification'} toggle={toggle} open={open} alert={message}
                        actions={<Button color='primary' onClick={handleSubmit}>VERIFY</Button>} {...rest}
        >
            <DialogContentText sx={{ color: 'grey.600', fontSize: '1rem', mb: 1 }}>
                Would you like to receive an email verification link?
            </DialogContentText>
        </SettingsDialog>
    );
};

export default EmailVerificationDialog;