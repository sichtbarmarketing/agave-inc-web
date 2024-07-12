import React, { ChangeEvent, FC, useState } from 'react';
import { updateEmail, Auth, reload } from 'firebase/auth';
import SettingsDialog, { SettingsDialogProps } from "./SettingsDialog";
import { Button, DialogContentText, TextField } from "@mui/material";

interface UpdateEmailProps extends SettingsDialogProps { auth: Auth }

const UpdateEmailDialog: FC<UpdateEmailProps> = ({ toggle, open, auth, ...rest }) => {

    const [message, setMessage] = useState('An email will be sent to the original address.');
    const [value, setValue] = useState('');

    const handleSubmit = async () => {
        if (!auth || !auth.currentUser) return setMessage('Error: No user found!');
        if (!value) return setMessage('Error: New email address cannot be empty.');

        setMessage('Updating your email...');
        try {
            await updateEmail(auth.currentUser, value);
            setMessage('Email address updated successfully.');
            await reload(auth.currentUser);
        } catch (e: any) {
            if (e?.code && e.code === 'auth/email-already-in-use') setMessage('Error: Invalid email address.');
            if (e?.code && e.code === 'auth/requires-recent-login') setMessage('Error: This action requires recent login.');
            else {
                setMessage('Error: Unable to update your email address.');
                console.error(e);
            }
        }
    }

    return (
        <SettingsDialog title="Update Your Email Address" toggle={toggle} open={open} alert={message}
                        actions={
                            <>
                                <Button color='primary' onClick={handleSubmit} disabled={!value}>UPDATE</Button>
                            </>
                        }
        >
            <DialogContentText sx={{ color: 'grey.600', fontSize: '1rem', mb: 1 }}>
                Please enter your new email address here.
            </DialogContentText>
            <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Email"
                type="email"
                autoComplete="off"
                fullWidth
                placeholder="john@agave.com"
                variant="standard"
                color="primary"
                value={value}
                onChange={(event: ChangeEvent<HTMLInputElement>) => { setValue(event.target.value); }}
            />
        </SettingsDialog>
    );
};

export default UpdateEmailDialog;