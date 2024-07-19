import { FC } from "react";
import { useRouter } from "next/router";
import { useUser, withUser, AuthAction } from "next-firebase-auth";
import {
	Skeleton,
	Box,
	Stack,
	Button,
	Divider,
	ImageList,
} from "@mui/material";
import useSWR from "swr";
import axios from "axios";

import { useWeeklyReport } from "hooks/useWeeklyReport";
import WeeklyReportDetails from "layouts/Templates/weekly-report/WeeklyReportDetails";
import AgaveLayout from "layouts/AgaveLayout";

import WeeklyReportTable from "layouts/Templates/weekly-report/WeeklyReportTable";
import WeeklyReportSummary from "layouts/Templates/weekly-report/WeeklyReportSummary";
import AuthLayout from "layouts/AuthLayout";
import Loader from "components/Loader";
import TitleBar from "components/TitleBar";

import WorkHistoryOutlinedIcon from "@mui/icons-material/WorkHistoryOutlined";
import IosShareOutlinedIcon from "@mui/icons-material/IosShareOutlined";

type WeeklyReportProps = {};
const WeeklyReportPage: FC<WeeklyReportProps> = () => {
	const router = useRouter();
	const AuthUser = useUser();

	const formId = router.query.formId;
	const url: string = `api/history/${formId}`; // FIXME: this fetch DOES NOT request a form PDF

	const fetcher = useSWR(AuthUser ? url : null, async () => {
		const token = await AuthUser.getIdToken();
		return await axios
			.get(url, { baseURL: "/", headers: { Authorization: token } })
			.then((res) => res.data)
			.catch((e) => {
				console.error(e);
				throw e;
			});
	});

	const { data: formData, error, isLoading, isValidating } = fetcher;

	const { info, report, details } = useWeeklyReport(formData?.fields);

	if (isLoading) return <Loader />;
	return (
		<AgaveLayout>
			<AuthLayout signedIn={!!AuthUser.id} displayName={AuthUser.displayName}>
				<Box m={1} mb={3}>
					<Stack
						direction='row'
						flexWrap='wrap'
						justifyContent='center'
						sx={{ gap: "1em" }}>
						<Box flex='1 0' maxWidth={{ xs: "100%", lg: "calc(50%)" }} minWidth={300}>
							<Stack
								direction='row'
								justifyContent='space-between'
								alignItems='center'
								px={2}>
								<TitleBar
									TitleIcon={WorkHistoryOutlinedIcon}
									Title={"Weekly Report"}
									flexGrow={0}
								/>
								<Button
									color='secondary'
									variant='outlined'
									disabled
									startIcon={<IosShareOutlinedIcon />}>
									Share
								</Button>
							</Stack>
							<Divider />
							<WeeklyReportTable items={info} />
							<WeeklyReportSummary summArr={report} />
						</Box>
						<Box
							flex='1 0'
							maxWidth={{ xs: "100%", lg: "calc(50% - 1em)" }}
							m={2}
							minWidth={300}>
							<ImageList sx={{ borderRadius: 3 }}>
								{details
									.filter(
										({ image }: WeeklyReportDetails) =>
											image && image.imageFile && image.id
									)
									.map(({ image, text }: WeeklyReportDetails) => (
										<WeeklyReportDetails
											key={image.id}
											image={image}
											text={text}
											user={AuthUser}
										/>
									))}
							</ImageList>
						</Box>
					</Stack>
				</Box>
			</AuthLayout>
		</AgaveLayout>
	);
};

export default withUser<WeeklyReportProps>({
	whenAuthed: AuthAction.RENDER, // Page is rendered, if the user is authenticated
	whenUnauthedBeforeInit: AuthAction.SHOW_LOADER, // Shows loader, if the user is not authenticated & the Firebase client JS SDK has not yet initialized.
	whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN, // Redirect to log-in page, if user is not authenticated
	LoaderComponent: Loader,
})(WeeklyReportPage);
