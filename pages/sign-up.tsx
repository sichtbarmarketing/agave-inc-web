import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
// import { verifyIdToken } from "next-firebase-auth";
import { useFormik } from "formik";
import axios, { AxiosError } from "axios";
import { postUserSchema as Schema } from "utils/api/yup";

import {
	Button,
	Alert,
	AlertColor,
	Collapse,
	Box,
	Container,
} from "@mui/material";
import { H2, Small } from "components/Typography";
import Wrapper from "components/Forms/Wrapper";
import BazarTextField from "components/Forms/BazarTextField";
import EyeToggleButton from "components/Forms/EyeToggleButton";
import Link from "components/Link";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import firebaseClient from "@firebaseUtils/firebaseClient";

import AuthLayout from "layouts/AuthLayout";
import AgaveLayout from "layouts/AgaveLayout";

// Formik Initial Values
const initialValues = {
	displayName: "",
	email: "",
	password: "",
	re_password: "",
};
type SignUpPageProps = {};

const SignUpPage: NextPage<SignUpPageProps> = () => {
	const router = useRouter();
	const auth = getAuth(firebaseClient);

	// passwordVisibility Hooks
	const [passwordVisibility, setPasswordVisibility] = useState(false);
	const togglePasswordVisibility = useCallback(() => {
		setPasswordVisibility((visible) => !visible);
	}, []);

	// Alert States
	const [alert, setAlert] = useState(false);
	const [alertSeverity, setAlertSeverity] = useState<AlertColor>("error");
	const [alertContent, setAlertContent] = useState("");

	// handling form submissions
	const handleFormSubmit = async (values: {
		displayName: string;
		email: string;
		password: string;
		re_password: string;
	}) => {
		try {
			const result = await axios.post("/api/sign-up", { values });

			// eslint-disable-next-line no-console
			console.log(result);

			signInWithCustomToken(auth, result.data.uid).then(() => {
				setAlert(true);
				setAlertSeverity("success");
				setAlertContent("Success! Redirecting to email verification...");

				router.push("/settings");
			});
		} catch (e: unknown) {
			setAlert(true);
			setAlertSeverity("error");
			setAlertContent("An error occurred.");

			// eslint-disable-next-line no-console
			console.error(e);

			if (e instanceof AxiosError && e.response) {
				setAlertContent(e.response.data.error.message);
			}
		}
	};

	// Initializing variables to use within form, provided by useFormik
	const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
		useFormik({
			initialValues,
			onSubmit: handleFormSubmit,
			validationSchema: Schema,
		});

	return (
		<AgaveLayout>
			<AuthLayout>
				<Box position='relative' py={4}>
					<Container maxWidth='sm'>
						<Wrapper elevation={0} passwordVisibility={passwordVisibility}>
							<form onSubmit={handleSubmit}>
								<H2 textAlign='center' mb={1}>
									Create an Account
								</H2>
								<Small
									mb={4.5}
									display='block'
									fontSize='12px'
									fontWeight='600'
									color='grey.800'
									textAlign='center'>
									Sign up with email & password.
								</Small>

								<BazarTextField
									mb={1.5}
									fullWidth
									size='small'
									variant='outlined'
									name='displayName'
									label='Full Name'
									placeholder='Your Name'
									onBlur={handleBlur}
									value={values.displayName}
									onChange={handleChange}
									error={!!touched.displayName && !!errors.displayName}
									helperText={touched.displayName && errors.displayName}
								/>

								<BazarTextField
									mb={1.5}
									fullWidth
									size='small'
									variant='outlined'
									name='email'
									type='email'
									label='Email'
									placeholder='example@mail.com'
									onBlur={handleBlur}
									value={values.email}
									onChange={handleChange}
									error={!!touched.email && !!errors.email}
									helperText={touched.email && errors.email}
								/>

								<BazarTextField
									mb={2}
									fullWidth
									size='small'
									variant='outlined'
									name='password'
									label='Password'
									autoComplete='on'
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.password}
									placeholder='*********'
									type={passwordVisibility ? "text" : "password"}
									error={!!touched.password && !!errors.password}
									helperText={touched.password && errors.password}
									InputProps={{
										endAdornment: (
											<EyeToggleButton
												show={passwordVisibility}
												click={togglePasswordVisibility}
											/>
										),
									}}
								/>

								<BazarTextField
									mb={2}
									fullWidth
									size='small'
									variant='outlined'
									name='re_password'
									label='Confirm Password'
									autoComplete='on'
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.re_password}
									placeholder='*********'
									type={passwordVisibility ? "text" : "password"}
									error={!!touched.re_password && !!errors.re_password}
									helperText={touched.re_password && errors.re_password}
									InputProps={{
										endAdornment: (
											<EyeToggleButton
												show={passwordVisibility}
												click={togglePasswordVisibility}
											/>
										),
									}}
								/>

								<Button
									fullWidth
									type='submit'
									color='primary'
									variant='contained'
									sx={{ mb: "1.65rem", height: 44 }}>
									Create Account
								</Button>

								<Small
									mb={4.5}
									display='block'
									fontSize='12px'
									fontWeight='600'
									color='grey.800'
									textAlign='center'>
									Already have an account?
									{/* TODO: [CODE SMELL] hard-coded value */}
									<Link href='/log-in' color='secondary' sx={{ textDecoration: "none" }}>
										&nbsp;Log In Here.
									</Link>
								</Small>

								<Collapse in={alert}>
									<Alert onClose={() => setAlert(false)} severity={alertSeverity}>
										{alertContent}
									</Alert>
								</Collapse>
							</form>
						</Wrapper>
					</Container>
				</Box>
			</AuthLayout>
		</AgaveLayout>
	);
};

export default SignUpPage;
