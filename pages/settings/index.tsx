import React from "react";
import { NextPage } from "next";
import { getAuth } from "firebase/auth";
import AuthLayout from "layouts/AuthLayout";
import { useUser, withUser, AuthAction } from "next-firebase-auth";
import { useToggle } from "hooks/useToggle";
import { Box, Stack, List, Button } from "@mui/material";

import TitleBar from "components/TitleBar";
import Loader from "components/Loader";
import UserProfile, { UserProfileItem } from "components/UserProfile";
import UserSettingsItem from "components/UserSettingsItem";
import { NextLinkComposed } from "components/Link";

/* SETTINGS DIALOG BOXES */
import UpdateAvatarDialog from "components/SettingsDialogs/UpdateAvatarDialog";
import UpdateNameDialog from "components/SettingsDialogs/UpdateNameDialog";
import UpdateEmailDialog from "components/SettingsDialogs/UpdateEmailDialog";
import UpdatePhoneDialog from "components/SettingsDialogs/UpdatePhoneDialog";
import EmailVerificationDialog from "components/SettingsDialogs/EmailVerificationDialog";
import PasswordResetDialog from "components/SettingsDialogs/PasswordResetDialog";
import PushNotificationsDialog from "components/SettingsDialogs/PushNotificationsDialog";
import InstallAppDialog from "components/SettingsDialogs/InstallAppDialog";

/* MUI ICONS */
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PortraitOutlinedIcon from "@mui/icons-material/PortraitOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import PasswordIcon from "@mui/icons-material/Password";
import AddToHomeScreenOutlinedIcon from "@mui/icons-material/AddToHomeScreenOutlined";
import SecurityUpdateWarningOutlinedIcon from "@mui/icons-material/SecurityUpdateWarningOutlined";

const auth = getAuth();
type SettingsPageProps = {};
const SettingsPage: NextPage<SettingsPageProps> = () => {
	const AuthUser = useUser();

    // Console log the AuthUser object when in development mode
    if (process.env.NODE_ENV === "development") {
        console.log(AuthUser);
    }

	const [updateAvatar, toggleAvatar] = useToggle(false);
	const [updateName, toggleName] = useToggle(false);
	const [updateEmail, toggleEmail] = useToggle(false);
	const [updatePhone, togglePhone] = useToggle(false);

	const [emailVerify, toggleEmailVerify] = useToggle(false);
	const [resetPass, toggleResetPass] = useToggle(false);
	const [pushNotifs, togglePushNotifs] = useToggle(false);
	const [pwa, togglePwa] = useToggle(false);

	return (
		<AuthLayout signedIn={!!AuthUser.id} displayName={AuthUser.displayName}>
			<Box m={1} mb={3}>
				<TitleBar
					TitleIcon={SettingsOutlinedIcon}
					Title={"My Profile"}
					sx={{ mx: 1 }}
				/>

				<Stack
					direction='row'
					flexWrap='wrap'
					justifyContent='center'
					sx={{ gap: "1em" }}>
					<UserProfile
						displayName={AuthUser.displayName}
						photoURL={AuthUser.photoURL}
						toggle={toggleAvatar}
						flex='1 0'
						maxWidth={{ xs: "100%", md: "calc(50% - 1em)" }}
						minWidth={300}>
						<UserProfileItem
							primary={"Display Name"}
							secondary={AuthUser.displayName ?? "Add a display name."}
							Icon={PortraitOutlinedIcon}
							action={toggleName}
						/>
						<UserProfileItem
							primary={"Email"}
							secondary={AuthUser.email ?? "Add an email."}
							Icon={EmailOutlinedIcon}
							action={toggleEmail}
						/>
						<UserProfileItem
							primary={"Phone"}
							secondary={AuthUser.phoneNumber ?? "Add a phone number."}
							Icon={LocalPhoneOutlinedIcon}
							action={togglePhone}
						/>
					</UserProfile>

					<Box
						flex='1 0'
						minWidth={300}
						maxWidth={{ xs: "100%", md: "calc(50% - 1em)" }}>
						<List
							disablePadding
							sx={{ "& .MuiListItemButton-root:not(:last-child)": { mb: "1em" } }}>
							<UserSettingsItem
								primary={"Email Verification"}
								secondary={"Verify your email address."}
								Icon={<MarkEmailReadOutlinedIcon />}
								onClick={() => toggleEmailVerify(true)}
							/>
							<UserSettingsItem
								primary={"Password Reset"}
								secondary={"Change your password."}
								Icon={<PasswordIcon />}
								onClick={() => toggleResetPass(true)}
							/>
							<UserSettingsItem
								primary={"Push Notifications"}
								secondary={"Receive notifications in compatible devices."}
								Icon={<SecurityUpdateWarningOutlinedIcon />}
								onClick={() => togglePushNotifs(true)}
							/>
							<UserSettingsItem
								primary={"Add To Home Screen"}
								secondary={"Add Agave to your home screen!"}
								Icon={<AddToHomeScreenOutlinedIcon />}
								onClick={() => togglePwa(true)}
							/>
							<Box
								component='li'
								display='flex'
								justifyContent='center'
								color='grey.600'>
								<a href='#'>View our privacy policy.</a>
							</Box>
						</List>
					</Box>
				</Stack>
			</Box>
			<UpdateAvatarDialog auth={auth} toggle={toggleAvatar} open={updateAvatar} />
			<UpdateNameDialog
				auth={auth}
				prev={AuthUser.displayName ?? ""}
				user={AuthUser.firebaseUser}
				open={updateName}
				toggle={toggleName}
			/>
			<UpdateEmailDialog auth={auth} open={updateEmail} toggle={toggleEmail} />
			<UpdatePhoneDialog
				user={AuthUser.firebaseUser}
				auth={auth}
				toggle={togglePhone}
				open={updatePhone}
			/>
			<EmailVerificationDialog
				user={AuthUser.firebaseUser}
				toggle={toggleEmailVerify}
				open={emailVerify}
			/>
			<PasswordResetDialog
				auth={auth}
				email={AuthUser.email}
				toggle={toggleResetPass}
				open={resetPass}
			/>
			<PushNotificationsDialog
				toggle={togglePushNotifs}
				open={pushNotifs}
				uid={AuthUser.id}
				togglePwa={togglePwa}
			/>
			<InstallAppDialog toggle={togglePwa} open={pwa} />
		</AuthLayout>
	);
};

export default withUser<SettingsPageProps>({
	whenAuthed: AuthAction.RENDER, // Page is rendered, if the user is authenticated
	whenUnauthedBeforeInit: AuthAction.SHOW_LOADER, // Shows loader, if the user is not authenticated & the Firebase client JS SDK has not yet initialized.
	whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN, // Redirect to log-in page, if user is not authenticated
	LoaderComponent: Loader,
})(SettingsPage);
