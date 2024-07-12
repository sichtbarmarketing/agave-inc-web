import React, { FC, Fragment } from 'react';
import {useRouter} from "next/router";
import { Paper, Button } from '@mui/material'

import ErrorOutline from "@mui/icons-material/ErrorOutline";
import { H3, Paragraph } from "components/Typography"

type ErrorMessageProps = { message?: string, code: string };
const ErrorMessage: FC<ErrorMessageProps> = ({ message = 'Unknown Error', code }) => {

    const router = useRouter();

    return(
        <Fragment>
            <Paper variant="outlined"
                   sx={{
                       display: 'flex',
                       flexDirection: 'column',
                       alignItems: 'center',
                       justifyContent: 'center',
                       backgroundColor: 'grey.300',
                       padding: `2em`,
                }}
            >
                <ErrorOutline/>
                <H3>{message}</H3>
                <Paragraph>Code: {code}</Paragraph>

                <Button fullWidth color="primary" variant="contained"
                        sx={{ mt: "1.65rem", height: 44 }}
                        onClick={() => router.push("/")}
                >
                    Go to Home Page
                </Button>
            </Paper>
        </Fragment>
    );
};

export default ErrorMessage;