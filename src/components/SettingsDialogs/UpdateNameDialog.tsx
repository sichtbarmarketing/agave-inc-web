import { FC, useState, ChangeEvent } from 'react';
import { updateProfile, Auth, User, reload } from 'firebase/auth';
import SettingsDialog, { SettingsDialogProps } from "./SettingsDialog";
import { Button, DialogContentText, TextField } from "@mui/material";

interface UpdateNameDialogProps extends SettingsDialogProps {
    prev?: string;
    user: User | null;
    auth: Auth;
}

const UpdateNameDialog: FC<UpdateNameDialogProps> = ({ prev, user, auth, open, toggle, ...rest }: UpdateNameDialogProps) => {

    const [value, setValue] = useState(prev ?? '');
    const [message, setMessage] = useState("Some changes might take effect upon reloading.");

    const handleSubmit = async () => {
        if (!user) return setMessage('Error: No user found!');
        if (!value) return setMessage('Error: New name cannot be empty');
        setMessage('Updating display name...')
        try {
            await updateProfile(user, {displayName: value});
            setMessage('Display name updated successfully.');
            await reload(user);
        } catch (e) {
            setMessage('Error: Unable to update display name.');
            console.error(e);
        }
    }

    return(
        <SettingsDialog title='Update Your Display Name' toggle={toggle} open={open} alert={message}
                        actions={<Button color='primary' onClick={handleSubmit}>UPDATE</Button>} {...rest}
        >
            <DialogContentText sx={{ color: 'grey.600', fontSize: '1rem', mb: 1 }}>
                Please enter your new display name here.
            </DialogContentText>
            <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Display Name"
                type="text"
                fullWidth
                variant="standard"
                color="primary"
                value={value}
                onChange={(event: ChangeEvent<HTMLInputElement>) => { setValue(event.target.value); }}
            />
        </SettingsDialog>
    );
}

export default UpdateNameDialog;