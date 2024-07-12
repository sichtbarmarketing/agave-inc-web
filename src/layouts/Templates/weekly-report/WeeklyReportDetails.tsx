import { FC } from 'react';
import useSWR from "swr";
import axios from "axios";
import { useToggle } from "hooks/useToggle";
import { AuthUserContext } from "next-firebase-auth";
import Loading from "@public/assets/images/loading.gif";
import { ImageListItem, IconButton } from "@mui/material";
import { WeeklyReportDetails } from "hooks/useWeeklyReport";
import SmsIcon from '@mui/icons-material/Sms';
import SettingsDialog from "components/SettingsDialogs/SettingsDialog";

type WeeklyReportDetailsProps = {
    image: WeeklyReportDetails['image']
    text: WeeklyReportDetails['text']
    user: AuthUserContext
}
const WeeklyReportDetails: FC<WeeklyReportDetailsProps> = ({ image, text, user }: WeeklyReportDetailsProps) => {

    const [open, toggleOpen] = useToggle(false);
    const url = `api/history/image`;

    const swrOptions = {
        revalidateOnFocus: false,
        revalidateOnMount: true, // https://swr.vercel.app/docs/api
        revalidateOnReconnect: false,
        refreshWhenOffline: false,
        refreshWhenHidden: false,
        refreshInterval: 3600000, // one hour in milliseconds
    }

    const fetcher = useSWR((user.id && image?.imageFile) ? [url, image.imageFile.id] : null, (async ([url, fileId]) => {
        const token = await user.getIdToken();
        return await axios.get(url, { baseURL: '/', headers: { Authorization: token }, params: { imgId: fileId } } )
            .then(res => res.data['imgLink'])
            .catch(e => { console.error(e); throw e });
    }), swrOptions);

    const { data, error, isLoading, isValidating } = fetcher;

    if (!image || !image?.imageFile) return null;
    return(
        <ImageListItem>
            <img src={data ? data : Loading.src} alt={`Weekly Report Image ID: ${image.name}`} />
            <IconButton color='primary' disabled={!text} onClick={() => toggleOpen(true)} sx={{
                bgcolor: 'grey.200', position: 'absolute',
                "&:hover, &.Mui-focusVisible": { bgcolor: "grey.500" },
                inset: '10px 10px auto auto'
            }}>
                <SmsIcon color='secondary' />
            </IconButton>
            <SettingsDialog open={open} toggle={toggleOpen} title={'Image Details'}>
                {text?.text ?? 'No details provided!'}
            </SettingsDialog>
        </ImageListItem>
    );
};

export default WeeklyReportDetails;