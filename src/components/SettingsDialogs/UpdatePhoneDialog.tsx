import React, { FC, useState, useRef, ChangeEvent } from 'react';
import { updatePhoneNumber, Auth, User, reload, RecaptchaVerifier, PhoneAuthProvider } from 'firebase/auth';
import SettingsDialog, { SettingsDialogProps } from "./SettingsDialog";
import { Button, DialogContentText, TextField } from "@mui/material";

interface UpdatePhoneDialogProps extends SettingsDialogProps { prev?: string; user: User | null; auth: Auth; }

const UpdatePhoneDialog: FC<UpdatePhoneDialogProps> = ({ user, auth, toggle, open }) => {

    // State for the items needed for phone update
    const [verificationId, setVerificationId] = useState<string | null>(null);
    const [verificationCode, setVerificationCode] = useState<string>('');
    const [value, setValue] = useState<string>('');
    const [message, setMessage] = useState("We will send you an SMS code to verify. Rates may apply.");

    // The Recaptcha Verifier item and a ref to its HTML div wrapper
    let appVerifier: RecaptchaVerifier | null = null;
    const recaptchaContainerRef = useRef<HTMLDivElement>(null);

    // Helper function used to return a RecaptchaVerifier object
    const generateRecaptcha = (auth: Auth) => (
        new RecaptchaVerifier("recaptcha-container", { size: "invisible" }, auth)
    );

    const handleVerify = async () => {
        if (!user) return setMessage('Error: No user found!');
        if (!value) return setMessage('Error: New phone number cannot be empty.');

        // reset both the appVerifier object if not null AND the HTML div ref if current
        if (recaptchaContainerRef.current) recaptchaContainerRef.current.innerHTML = `<div id="recaptcha-container"></div>`;
        if (appVerifier) appVerifier.clear();

        appVerifier = generateRecaptcha(auth);

        setMessage('Verifying your phone number...');
        try {
            const provider = new PhoneAuthProvider(auth);
            const verificationId = await provider.verifyPhoneNumber(value, appVerifier);

            setVerificationId(verificationId);
            setMessage('Please enter the SMS code we sent you. Do not share it.');
        } catch (e) {
            setMessage('Error: Unable to verify your phone number.');
            console.error(e);
        }
    }

    const handleSubmit = async () => {
        if (!user) return setMessage('Error: No user found!');
        if (!verificationId) return setMessage('Error: please verify your phone number first.');
        if (!verificationCode) return setMessage('Error: please enter your verification code.');

        setMessage('Updating your phone number...');
        try {
            const phoneCredential = PhoneAuthProvider.credential(verificationId, verificationCode);
            await updatePhoneNumber(user, phoneCredential);
            setMessage('Phone number verified and updated successfully.');
            await reload(user);
        } catch (e) {
            setMessage('Error: Unable to update your phone number.');
            console.error(e);
        }

    }

    return (
        <SettingsDialog title="Update Phone" toggle={toggle} open={open} alert={message}
                        actions={
                            <>
                                <Button color='primary' onClick={handleVerify}>VERIFY</Button>
                                <Button color='primary' onClick={handleSubmit} disabled={!verificationId}>UPDATE</Button>
                            </>
                        }
        >
            <DialogContentText sx={{ color: 'grey.600', fontSize: '1rem', mb: 1 }}>
                Please enter your new phone here.
            </DialogContentText>
            <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Phone Number"
                type="text"
                autoComplete="off"
                fullWidth
                placeholder="+1 (602) 254-1464"
                variant="standard"
                color="primary"
                value={value}
                onChange={(event: ChangeEvent<HTMLInputElement>) => { setValue(event.target.value); }}
            />
            <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Verification Code"
                type="text"
                autoComplete="off"
                fullWidth
                variant="standard"
                disabled={!verificationId}
                color="primary"
                value={verificationCode}
                onChange={(event: ChangeEvent<HTMLInputElement>) => { setVerificationCode(event.target.value); }}
            />
            <div ref={recaptchaContainerRef} />
        </SettingsDialog>
    );
};

export default UpdatePhoneDialog;