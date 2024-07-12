import { AuthAction, withAuthUser } from "next-firebase-auth";
import Loader from "components/Loader";
import { NextPage } from "next";
import React, { useState } from "react";
import { Alert, AlertColor, Box, Button, Collapse, Container } from "@mui/material";
import { useFormik } from "formik";
import AuthLayout from "layouts/AuthLayout";
import Wrapper from "components/Forms/Wrapper";
import { H2, Small } from "components/Typography";
import BazarTextField from "components/Forms/BazarTextField";
import Link from "components/Link";
import * as yup from 'yup';
import { getAuth, sendPasswordResetEmail } from "@firebase/auth";

const auth = getAuth();

const LogIn: NextPage = () => {

    // Alert States
    const [alert, setAlert] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState<AlertColor>('error');
    const [alertContent, setAlertContent] = useState('');

    // handling form submissions
    const handleFormSubmit = async (values: {email: string }) => {

        try {
            await sendPasswordResetEmail(auth, values.email);
        } catch (e: any) {
            setAlert(true);
            setAlertSeverity('error');
            setAlertContent(e?.message ? e.message : 'Unable to reset your password.');

            return;
        }

        setAlert(true);
        setAlertSeverity('success');
        setAlertContent("Password reset link sent.");
    };

    // Initializing variables to use within form, provided by useFormik
    const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
        useFormik({
                initialValues, onSubmit: handleFormSubmit, validationSchema: formSchema,
        }
    );

    return(
        <AuthLayout>
            <Box position='relative' py={4}>
                <Container maxWidth='sm'>
                    <Wrapper elevation={0} sx={{m: 'auto'}}>
                        <form onSubmit={handleSubmit}>
                            <H2 textAlign="center" mb={1}>Forgot Your Agave Password?</H2>

                            <Small mb={4.5} display="block" fontSize="12px" fontWeight="600" color="grey.800" textAlign="center">
                                Enter the email address associated with your account.
                            </Small>

                            <BazarTextField mb={1.5} fullWidth size="small" variant="outlined" name="email" type="email"
                                            onBlur={handleBlur} value={values.email} onChange={handleChange}
                                            label="Email Address" placeholder="example@mail.com"
                                            error={!!touched.email && !!errors.email} helperText={touched.email && errors.email}
                            />

                            <Button fullWidth type="submit" color="primary" variant="contained" sx={{ mb: "1.65rem", height: 44 }}>
                                Reset Password
                            </Button>
                            <Small mb={4.5} display="block" fontSize="12px" fontWeight="600" color="grey.800" textAlign="center">
                                Dont have an account?
                                {/* TODO: [CODE SMELL] hard-coded value */}
                                <Link href="/sign-up" color="secondary" sx={{ textDecoration: 'none' }}>
                                    &nbsp;Sign Up Here.
                                </Link>
                            </Small>
                            <Collapse in={alert}>
                                <Alert onClose={() => setAlert(false)} severity={alertSeverity}>{alertContent}</Alert>
                            </Collapse>
                        </form>
                    </Wrapper>
                </Container>
            </Box>
        </AuthLayout>
    );
}

// Initial values for formik
const initialValues = { email: "" };

// Form Schema by yup
const formSchema = yup.object().shape({
    email: yup.string().email("invalid email").required("Email is required"),
});

export default withAuthUser({
    whenAuthed: AuthAction.REDIRECT_TO_APP,
    whenAuthedBeforeRedirect: AuthAction.SHOW_LOADER,
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
    whenUnauthedAfterInit: AuthAction.RENDER,
    LoaderComponent: Loader,
})(LogIn as any);