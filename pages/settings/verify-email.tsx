import { NextPage } from "next";
import React, { useState, Fragment } from "react";

import { getAuth, sendEmailVerification } from "firebase/auth";
import { AuthAction, withUser } from "next-firebase-auth";
import firebaseClient from "@firebaseUtils/firebaseClient";

import Loader from "components/Loader";

import {
	Alert,
	AlertColor,
	Box,
	Button,
	Collapse,
	Container,
	Divider,
} from "@mui/material";
import { Settings } from "@mui/icons-material";
import { H2, H4 } from "components/Typography";
import AgaveLayout from "layouts/AgaveLayout";

type VerifyEmailProps = {};

const VerifyEmail: NextPage<VerifyEmailProps> = () => {
	const auth = getAuth(firebaseClient);

	// Alert States
	const [alert, setAlert] = useState(false);
	const [alertSeverity, setAlertSeverity] = useState<AlertColor>("error");
	const [alertContent, setAlertContent] = useState("");

	// Button States
	const [buttonDisabled, setDisabled] = useState(false);

	const sendEmail: any = async () => {
		try {
			if (!auth.currentUser) {
				setAlert(true);
				setAlertSeverity("error");
				setAlertContent("Current User not found!");

				return console.error("Current User not found!");
			}

			sendEmailVerification(auth.currentUser).then(() => {
				setDisabled(true);

				setAlert(true);
				setAlertSeverity("success");
				setAlertContent("Success! Sent you an activation E-mail.");
			});
		} catch (e: unknown) {
			setAlert(true);
			setAlertSeverity("error");
			setAlertContent(e instanceof Error ? e.message : "Unknown Error occurred!");

			return console.error(
				e instanceof Error ? e.message : "Unknown Error occurred!"
			);
		}
	};

	return (
		<AgaveLayout>
			<Box height='100%' display='flex' flexDirection='column'>
				<Container sx={{ mt: "3rem" }}>
					<Box display='flex' alignItems='center' my={2}>
						<Settings color='primary' />
						<H2 ml={1.5} my='0px' lineHeight='1' whiteSpace='pre'>
							Verify Email
						</H2>
					</Box>

					<Divider sx={{ mb: 1, borderColor: "grey.300" }} />
					<Container>
						<Box mb={4}>
							<H4>Please verify your email address.</H4>
							<Button
								disabled={buttonDisabled}
								fullWidth
								onClick={sendEmail}
								color='primary'
								variant='contained'
								sx={{ mb: "1.65rem", height: 44 }}>
								Send Activation Email
							</Button>
							<Collapse in={alert}>
								<Alert onClose={() => setAlert(false)} severity={alertSeverity}>
									{alertContent}
								</Alert>
							</Collapse>
						</Box>
					</Container>
				</Container>
			</Box>
		</AgaveLayout>
	);
};

export default withUser<VerifyEmailProps>({
	whenAuthed: AuthAction.RENDER, // Page is rendered, if the user is authenticated
	whenUnauthedBeforeInit: AuthAction.SHOW_LOADER, // Shows loader, if the user is not authenticated & the Firebase client JS SDK has not yet initialized.
	whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN, // Redirect to log-in page, if user is not authenticated
	LoaderComponent: Loader,
})(VerifyEmail);
