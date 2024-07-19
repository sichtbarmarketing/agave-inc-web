import { NextPage } from "next";
import { useRouter } from "next/router";
import { AuthAction, useUser, withUser } from "next-firebase-auth";
import axios from "axios";
import useSWR from "swr";
import { format } from "date-fns";

import AuthLayout from "layouts/AuthLayout";
import {
	Box,
	Container,
	Paper,
	Breadcrumbs,
	Typography,
	Button,
	styled,
} from "@mui/material";
import Link from "components/Link";
import Loader from "components/Loader";
import TitleBar from "components/TitleBar";
import { H2, H4, H6 } from "components/Typography";

import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import AgaveLayout from "layouts/AgaveLayout";

const StyledBreadcrumbs = styled(Breadcrumbs)`
	.MuiBreadcrumbs-li {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		flex: 1;
		max-width: max-content;
	}
`;

type HistoryIdProps = {};
const ViewHistoryPage: NextPage<HistoryIdProps> = ({}) => {
	const router = useRouter();
	const { formId, exportId } = router.query;
	const url: string = `api/history/${formId}`;

	const AuthUser = useUser(); // according to next-firebase-auth, the user is guaranteed to be authenticated
	const fetcher = useSWR(AuthUser ? url : null, async () => {
		const token = await AuthUser.getIdToken();
		return await axios
			.get(url, {
				baseURL: "/",
				headers: { Authorization: token },
				params: { exportId: exportId },
			})
			.then((res) => res.data)
			.catch((e) => {
				console.error(e);
				throw e;
			});
	});

	const { data, error, isLoading, isValidating } = fetcher;

	if (isLoading) return <Loader />;

	return (
		<AgaveLayout>
			<AuthLayout signedIn={!!AuthUser.id} displayName={AuthUser.displayName}>
				<Container maxWidth='md' sx={{ mt: 3, mb: 6, minHeight: "60vh" }}>
					<TitleBar TitleIcon={WorkHistoryIcon} Title={"Work History"} />

					<StyledBreadcrumbs
						separator='›'
						aria-label='breadcrumb'
						sx={{ my: "1rem" }}>
						<Link href={"/work-history"} color='inherit' underline='hover'>
							Work History
						</Link>
						<Typography color='text.primary' noWrap>
							{data?.name ? data.name : "Current File"}
						</Typography>
					</StyledBreadcrumbs>

					<Box component={Paper}>
						<Box sx={{ p: 1, display: "flex", justifyContent: "space-between" }}>
							<Box
								sx={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0 }}>
								<FileOpenIcon fontSize={"small"} sx={{ mr: 1 }} />
								<H4
									sx={{
										whiteSpace: "nowrap",
										textOverflow: "ellipsis",
										overflow: "hidden",
									}}>
									{data?.name ? data.name : "File Name Not Found."}
								</H4>
							</Box>

							<Button
								disabled={!data?.pdfLink}
								color='primary'
								variant='text'
								sx={{ flexShrink: 1 }}>
								<a href={data?.pdfLink} target='_blank' download>
									DOWNLOAD
								</a>
							</Button>
						</Box>
						<Box sx={{ p: 1, display: "flex", justifyContent: "space-between" }}>
							<H6>Last Updated</H6>
							<H6>
								{data?.lastUpdated
									? format(new Date(data.lastUpdated), "MM/dd/yyyy")
									: null}
							</H6>
						</Box>
						<Box sx={{ height: { xs: "60vh", md: "75vh" } }}>
							<iframe
								width={"100%"}
								height={"100%"}
								allow='fullscreen'
								title='PDF Preview'
								src={data?.pdfLink ? `${data?.pdfLink}` : undefined}
							/>
						</Box>
					</Box>
				</Container>
			</AuthLayout>
		</AgaveLayout>
	);
};

export default withUser<HistoryIdProps>({
	whenAuthed: AuthAction.RENDER, // Page is rendered, if the user is authenticated
	whenUnauthedBeforeInit: AuthAction.SHOW_LOADER, // Shows loader, if the user is not authenticated & the Firebase client JS SDK has not yet initialized.
	whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN, // Redirect to log-in page, if user is not authenticated
	LoaderComponent: Loader,
})(ViewHistoryPage);
