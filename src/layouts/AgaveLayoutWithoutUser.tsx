import { FC, ReactNode } from "react";
import { usePathname } from "next/navigation";

import { User } from "next-firebase-auth";
import {
	Box,
	BoxProps,
	Stack,
	Button,
	ButtonProps,
	styled,
} from "@mui/material";
import { Span } from "components/Typography";
import { NextLinkComposed } from "components/Link";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import WorkHistoryOutlinedIcon from "@mui/icons-material/WorkHistoryOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import useChatData from "hooks/useChatData";

// FIXME: 'lWidth' seems unnecessary, either remove it or replace hard-coded 'width' value in the media query
const NavigationRail = styled(Stack, {
	shouldForwardProp: (prop) => prop !== "lWidth",
})<{ lWidth: number }>(({ theme, lWidth }) => ({
	width: "auto",
	height: `auto`,
	flexShrink: 0,
	padding: theme.spacing(1),
	paddingBottom: `max(safe-area-inset-bottom, ${theme.spacing(1)})`,
	display: "flex",
	flexDirection: "row",
	alignItems: "center",
	justifyContent: "center",
	transitionProperty: "width",
	transitionDuration: "200ms",
	transitionTimingFunction: "ease",
	overflowX: "auto",
	overflowY: "hidden",

	[theme.breakpoints.up("md")]: {
		height: "100%",
		width: 80, // FIXME: hard-coded value
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(2),
		paddingLeft: theme.spacing(2),
		flexDirection: "column",
		justifyContent: "space-between",
		overflowX: "hidden",
		overflowY: "auto",
		"&:hover": { width: lWidth },
	},
}));

const RailButton = styled(Button, {
	shouldForwardProp: (prop) => prop !== "emphasis",
})<{ emphasis: boolean }>(({ theme, emphasis }) => ({
	display: "inline-flex",
	flexDirection: "column",
	justifyContent: "center",
	px: 2,
	...(emphasis && {
		// the overrides added when 'emphasis' == true
		color: "#871a78",
		"& svg": { color: "#871a78" /* fontSize: '1.9rem' */ },
	}),
}));

const MainBox = styled(
	Box,
	{}
)(({ theme }) => ({
	position: "relative",
	flexGrow: 1,
	overflow: "auto",
	borderRadius: `0 0 ${theme.spacing(3)} ${theme.spacing(3)}`,

	[theme.breakpoints.up("md")]: {
		borderRadius: `${theme.spacing(3)} 0 0 ${theme.spacing(3)}`,
	},
}));

interface AgaveLayoutWithoutUserProps {
	user?: User;
	children?: ReactNode;
	bgMain?: BoxProps["bgcolor"];
}
const AgaveLayoutWithoutUser: FC<AgaveLayoutWithoutUserProps> = ({
	bgMain = "grey.300",
	user,
	children,
}: AgaveLayoutWithoutUserProps) => {
	const pathname = usePathname();
	const drawerWidth = 80,
		lWidth = 100;

	return (
		<Stack
			height='100dvh'
			flexDirection={{ xs: "column-reverse", md: "row" }}
			bgcolor={"primary.600"}
			sx={{ gap: (theme) => theme.spacing(1) }}>
			<NavigationRail width={drawerWidth} lWidth={lWidth}>
				<Stack
					flexDirection={{ xs: "row", md: "column" }}
					alignItems='center'
					justifyContent='flex-start'
					sx={{ gap: (theme) => theme.spacing(1) }}>
					<NavButton
						icon={<HomeOutlinedIcon fontSize='large' />}
						label="Home"
						curr={"/" === pathname}
						href="/"
					/>
					<NavButton
						icon={<MailOutlineOutlinedIcon fontSize='large' />}
						label="Chat"
						curr={"/chat" === pathname}
						href="/chat"
					/>
					<NavButton
						icon={<SettingsOutlinedIcon fontSize='large' />}
						label="Settings"
						curr={"/settings" === pathname}
						href="/settings"
					/>
				</Stack>

				<Stack
					flexDirection='column'
					alignItems='center'
					justifyContent='flex-start'
					sx={{ gap: (theme) => theme.spacing(1) }}>
					<NavButton
						icon={<AccountCircleOutlinedIcon fontSize='large' />}
						label="Dashboard"
						curr={"/dashboard" === pathname}
						href="/dashboard"
					/>
				</Stack>
			</NavigationRail>

			<MainBox component='main' p={2} bgcolor={bgMain}>
				{children}
			</MainBox>
		</Stack>
	);
};

const NavButton: FC<
	{ icon: any; label: string; curr: boolean; href: string; showNotification?: boolean } & ButtonProps
> = ({ icon, label, curr, href, showNotification = false, ...props }) => {
	return (
		<NextLinkComposed to={href} style={{ width: "100%", position: "relative" }}>
			<RailButton emphasis={curr} fullWidth {...props}>
				{icon}
				<Span fontWeight={400} fontSize={"0.7rem"}>
					{label}
				</Span>
				{showNotification && (
					<Box
						component="span"
						sx={{
							position: "absolute",
							top: 0,
							right: 0,
							width: 12,
							height: 12,
							bgcolor: "red",
							borderRadius: "50%",
                            border: "2px solid white",
						}}
					/>
				)}
			</RailButton>
		</NextLinkComposed>
	);
};

export default AgaveLayoutWithoutUser;
