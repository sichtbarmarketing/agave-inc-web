import React, { FC } from 'react';

import { Stack, Button, IconButton, Box, BoxProps } from '@mui/material';
import BazarTextField from "components/Forms/BazarTextField";

import { useFormik } from "formik";
import * as yup from "yup";

import SendIcon from "@mui/icons-material/Send"
import NearMe from "@mui/icons-material/NearMe";

type ChatInputProps = { send: (text: string) => void , toggleDialog: (toggle: boolean) => void } // FIXME: temporary

// Initial Values for Formik
const initialValues = { text: "" };

// Message Schema by yup TODO: add user, location?
const messageSchema = yup.object().shape({
    text: yup.string()
        .required("0/200 characters")
        .max(200, "Character limit reached."),
});

const ChatInput: FC<ChatInputProps & BoxProps> = ({ send, toggleDialog }) => {

    const handleSend = async (values: { text: string }) => {
        await send(values.text);

        values.text = '';
        return('message sent!');
    }

    // Initializing variables to use within form, provided by useFormik
    const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
        useFormik({
                initialValues, onSubmit: handleSend, validationSchema: messageSchema,
            }
        );


    return(
        <form onSubmit={handleSubmit}>
            <Stack direction='row' alignItems='start' sx={{ gap: '1em', my: 1 }}>
                <Box flex={'0 1 auto'}>
                    <IconButton aria-label="Send Your Location" onClick={() => toggleDialog(true)}>
                        <NearMe/>
                    </IconButton>
                </Box>
                <Box flex={'4 1 auto'} minHeight={75}>
                    <BazarTextField fullWidth size="small" variant="outlined" multiline
                                    aria-label="Message" placeholder="Message" name="text" type="text"
                                    onBlur={handleBlur} value={values.text} onChange={handleChange}
                                    error={!!touched.text && !!errors.text} helperText={touched.text && errors.text}
                    />
                </Box>
                <Box flex={'0 1 auto'}>
                    <Button variant='contained' color='primary' type='submit' endIcon={<SendIcon/>} sx={{ minHeight: 44 }}>
                        SEND
                    </Button>
                </Box>
            </Stack>
        </form>
    )
}

export default ChatInput;