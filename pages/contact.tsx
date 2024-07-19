import { NextPage } from "next";
import { AuthAction, useUser, withUser } from "next-firebase-auth";
import AuthLayout from "layouts/AuthLayout";

import { Container, Stack, Paper, Box, Divider } from "@mui/material";
import Phone from "@mui/icons-material/Phone";
import { H2, H3, Paragraph } from "components/Typography";
import TitleBar from "components/TitleBar";
import React from "react";
import AgaveLayout from "layouts/AgaveLayout";

const embed: any = {
	key: process.env.NEXT_PUBLIC_MAPS_EMBED_API_KEY,
	width: "100%",
	height: "100%",
	style: { border: 0, borderRadius: 5, minHeight: 350 },
	url: "https://www.google.com/maps/embed/v1/place?q=place_id:ChIJL65L8rIUK4cRXJs0pP4C3Qo&key=",
};

type ContactPageProps = {};
const ContactPage: NextPage<ContactPageProps> = () => {
	const AuthUser = useUser();

	return (
		<AgaveLayout>
			<AuthLayout signedIn={!!AuthUser.id} displayName={AuthUser.displayName}>
				<Container maxWidth='md' sx={{ mt: 3, mb: 6, minHeight: "50vh" }}>
					<TitleBar TitleIcon={Phone} Title={"Contact Us"} />
					<Stack
						direction='row'
						flexWrap='wrap'
						position='relative'
						width='100%'
						sx={{ gap: "1em" }}>
						<Stack
							direction='column'
							spacing={2}
							flex={"1 1 100%"}
							maxWidth={{ xs: "100%", sm: "calc(50% - 1em)" }}>
							<Box component={Paper} p={3}>
								<H2 fontWeight={400}>Get In Touch</H2>
								<Divider sx={{ mb: 2 }} />
								<Box sx={{ mb: 2 }}>
									<H3 fontWeight={300}>Email</H3>
									<Paragraph>info@agave-inc.com</Paragraph>
								</Box>
								<Box sx={{ mb: 2 }}>
									<H3 fontWeight={300}>Phone</H3>
									<Paragraph>602-254-1464</Paragraph>
								</Box>
								<Box sx={{ mb: 2 }}>
									<H3 fontWeight={300}>Corporate Office</H3>
									<Paragraph>1634 N. 19th Ave.</Paragraph>
									<Paragraph> Phoenix, AZ 85009</Paragraph>
								</Box>
							</Box>

							<Box component={Paper} p={3}>
								<H2 fontWeight={400}>How Are We Doing?</H2>
								<Divider sx={{ mb: 2 }} />
								<Paragraph>Sign up or Log In to give us feedback!</Paragraph>
							</Box>
						</Stack>
						<Stack
							direction='column'
							spacing={2}
							flex={"1 1 100%"}
							maxWidth={{ xs: "100%", sm: "calc(50% - 1em)" }}>
							<iframe
								width={embed.width}
								height={embed.height}
								style={embed.style}
								loading='lazy'
								src={`${embed.url}${embed.key}`}
								allowFullScreen></iframe>
						</Stack>
					</Stack>
				</Container>
			</AuthLayout>
		</AgaveLayout>
	);
};

export default withUser<ContactPageProps>({
	whenAuthed: AuthAction.RENDER, // Page is rendered, if the user is authenticated
	whenUnauthedBeforeInit: AuthAction.RENDER, // Page is rendered, even if the user is not authenticated & the Firebase client JS SDK has not yet initialized.
	whenUnauthedAfterInit: AuthAction.RENDER, // page is rendered, even if the user is not authenticated
})(ContactPage);
