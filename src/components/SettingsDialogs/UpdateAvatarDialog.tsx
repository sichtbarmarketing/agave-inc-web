import React, { ChangeEvent, FC, useState } from 'react';
import SettingsDialog, { SettingsDialogProps } from "./SettingsDialog";
import { Button, DialogContentText, TextField } from "@mui/material";
import { Auth, reload } from "firebase/auth";

interface UpdateAvatarProps extends SettingsDialogProps { auth: Auth }

const UpdateAvatarDialog: FC<UpdateAvatarProps> = ({ toggle, open, auth, ...rest }) => {

    const [message, setMessage] = useState(
        'This feature is in development. Check back later!'
    );

    const handleSubmit = async () => {
        console.log('boop!')
    }

    return (
        <SettingsDialog title="Update Your Profile Avatar" toggle={toggle} open={open} alert={message}
                        actions={
                            <>
                                <Button color='primary' onClick={handleSubmit} disabled={true}>UPDATE</Button>
                            </>
                        }
        >
            <DialogContentText sx={{ color: 'grey.600', fontSize: '1rem', mb: 1 }}>
                Please upload a new profile image below.
            </DialogContentText>
        </SettingsDialog>
    );
};

export default UpdateAvatarDialog;