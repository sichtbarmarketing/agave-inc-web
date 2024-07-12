import { FC, useState } from 'react';
import { FirestoreError, DocumentReference } from "firebase/firestore";
import { Profile } from "@firebaseUtils/client/profileConverter";
import {
    Dialog, DialogProps, DialogTitle, DialogContent, DialogActions,
    List, ListItem, ListItemButton, ListItemAvatar, Avatar, ListItemText,
    Alert, AlertColor, Snackbar, Stack, CircularProgress, Fade,
    IconButton, Button,
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';

interface CreateDialogProps extends DialogProps {
    list?: Profile[], load: boolean, err?: FirestoreError,
    toggle: (toggle: boolean) => void,
    handleAdd: (prof: Profile) => Promise<{ref?: DocumentReference, err?: Error }>,
    limit: boolean, handleLimit: () => void,
}

const CreateDialog: FC<CreateDialogProps> = ({ list = [], load, err, toggle, handleAdd, limit, handleLimit, ...props }: CreateDialogProps) => {

    const [profile, setProfile] = useState<null | Profile>(null);
    const [alert, setAlert] = useState<{sev: AlertColor, title: string, vis: boolean}>(
        { sev: 'info', title: '', vis: false }
    );
    const selectProfile = (p: Profile | null) => { setProfile(p) };

    /** handleNext: once called, invokes the 'handleAdd function and displays returned information **/
    const handleNext = async () => {

        if (!profile?.id) return setAlert({ sev: 'error', title: 'Please select a user.', vis: true });

        const resObj = await handleAdd(profile);

        if (resObj.err) setAlert({ sev: (resObj.ref) ? 'warning' : 'error', title: resObj.err.message, vis: true });
        if (resObj.ref && !resObj.err) toggle(false);
    };

    return(
        <Dialog {...props} scroll='paper' maxWidth='xs' fullWidth onClose={() => toggle(false)}>
            <DialogTitle title='New Conversation' >
                { 'New Conversation' }
                <IconButton onClick={() => toggle(false)} aria-label="close"
                            sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500], }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ p: 0, height: '50vh' }}>

                <ProfilesList list={list} currProf={profile} handler={selectProfile} />

                <Stack direction='column' justifyContent='center' alignItems='center' my={2}>
                    <Fade in={load} style={{ transitionDelay: load ? '50ms' : '0ms' }} unmountOnExit >
                        <CircularProgress sx={{ my: 2 }}/>
                    </Fade>
                    <Button onClick={handleLimit} disabled={!limit} variant='outlined'>Load All</Button>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant='outlined' color='secondary' disabled={(!profile)} onClick={handleNext}>
                    Next
                </Button>
            </DialogActions>
            <Snackbar open={alert.vis} autoHideDuration={6000} onClose={() => setAlert({...alert, vis: false})}>
                <Alert severity={alert.sev} sx={{ minWidth: 250 }}>{alert.title}</Alert>
            </Snackbar>
        </Dialog>
    )
};

/** ProfilesList: renders list of type Profile[] FIXME: should probably put this in a separate file  */

type ProfilesListProps = { list?: Profile[], handler: (p: Profile | null) => void, currProf?: Profile | null; }
const ProfilesList: FC<ProfilesListProps> = ({list = [], currProf = null, handler}: ProfilesListProps) => {

    const handleAction = (value: Profile) => () => { (currProf?.id !== value.id) ? handler(value) : handler(null) }

    return(
        <List disablePadding>
            {
                list.map((p: Profile) =>
                    <ListItem key={p.id} disablePadding>
                        <ListItemButton defaultValue={p.id} onClick={handleAction(p)} selected={currProf?.id === p.id}>
                            <ListItemAvatar>
                                <Avatar alt={`${p.displayName} avatar`} src="" >
                                    { (p.displayName) ? p.displayName.charAt(0) : undefined }
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={p.displayName} secondary={(p.admin) ? 'Admin' : 'Client'} />
                        </ListItemButton>
                    </ListItem>
                )
            }
        </List>
    );
}

export default CreateDialog;
