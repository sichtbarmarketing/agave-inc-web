import { FC } from 'react';

import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Alert, DialogProps } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import { usePosition } from "hooks/usePosition";

import SendIcon from '@mui/icons-material/Send';

interface LocationDialogProps extends DialogProps {
    open: boolean,
    toggleDialog: (toggle: boolean) => void,
    send: (text: string, lat?: number, lng?: number, acc?: number) => void
}
const LocationDialog: FC<LocationDialogProps> = ({ open, toggleDialog, send }: LocationDialogProps) => {

    const { latitude, longitude, accuracy, error } = usePosition(open, false, { enableHighAccuracy: true });

    const handleSend = () => {
        if (latitude && longitude && accuracy) send('Location sent.', latitude, longitude, accuracy);

        toggleDialog(false);
    }

    return(
        <Dialog open={open}>
            <DialogTitle>Send your current location?</DialogTitle>
            <DialogContent>
                <DialogContentText mb={2}>This will allow the browser to share your location.</DialogContentText>
                <Alert severity={ (error) ? 'error' : 'info' } color={(latitude && longitude) ? 'success' : undefined}>
                    { !(latitude && longitude) && 'Determining your location...' }
                    { (latitude && longitude) && 'Location found!' }
                    { (error) && 'Error finding location.' }
                </Alert>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => toggleDialog(false)} variant='outlined'>Cancel</Button>
                <LoadingButton onClick={handleSend} endIcon={<SendIcon />} color='primary'
                    loading={!(latitude && longitude)} loadingPosition="end" variant="contained"
                >
                    <span>Send</span>
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
}

export default LocationDialog;