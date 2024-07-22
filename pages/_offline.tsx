import { NextPage } from "next";
import { useRouter } from "next/router";
import AuthLayout from "layouts/AuthLayout";
import { Box, Button, Container, Paper, Stack } from "@mui/material";
import TitleBar from "components/TitleBar";
import { NextLinkComposed } from "components/Link";
import { H2, H3, Paragraph } from "components/Typography";

import WifiOffIcon from "@mui/icons-material/WifiOff";
import AgaveSVG from "@public/assets/agave-graphics/dark-green/cactus3.svg";
import AgaveLayoutWithoutUser from "layouts/AgaveLayoutWithoutUser";

type OfflinePageProps = {};
const OfflinePage: NextPage<OfflinePageProps> = () => {
	const router = useRouter();

	return (
		<AgaveLayoutWithoutUser>
			<AuthLayout>
				<Container maxWidth='md' sx={{ mt: 3, mb: 6, minHeight: "50vh" }}>
					<TitleBar TitleIcon={WifiOffIcon} Title={"You are offline."} />
					<Stack
						direction='row'
						flexWrap='wrap'
						position='relative'
						width='100%'
						sx={{ gap: "1em" }}>
						<Box
							component={Paper}
							display={"flex"}
							p={3}
							alignItems={"center"}
							sx={{
								flex: "1 1 100%",
								maxWidth: { xs: "100%" },
								minHeight: "400px",
								position: "relative",

								background: `url(${AgaveSVG.src}) right bottom 10px / auto 90% no-repeat, beige`,

								outline: "2px solid white",
								outlineOffset: "-10px",
								borderRadius: "5px",
							}}>
							<Box ml={{ sm: 2 }}>
								<H2 sx={{ color: "#871A78" }} mb={2}>
									{"Reconnect to the internet and try again."}
								</H2>
								<Button
									variant='contained'
									color='secondary'
									onClick={() => router.reload()}>
									Try Again
								</Button>
							</Box>
						</Box>
					</Stack>
				</Container>
			</AuthLayout>
		</AgaveLayoutWithoutUser>
	);
};

export default OfflinePage;
