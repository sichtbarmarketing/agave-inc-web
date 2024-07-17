import { FC, ReactNode, useMemo } from 'react';
import useSWR from "swr";
import axios from "axios";
import { User } from "next-firebase-auth";
import { format } from "date-fns";
import { TemplateID } from "../../pages/work-history/[propertyId]"; // FIXME: this should be placed somewhere else
import { Box, Card, CardActionArea, CardContent, Chip, Divider, Skeleton, Stack } from '@mui/material';
import { H4, Span } from 'components/Typography';
import { NextLinkComposed } from "components/Link";
import { SvgIconComponent } from "@mui/icons-material";

import BuildCircleOutlinedIcon from '@mui/icons-material/BuildCircleOutlined';
import CircleNotificationsOutlinedIcon from '@mui/icons-material/CircleNotificationsOutlined';
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";

const swrOptions = {
    revalidateOnFocus: false,
    revalidateOnMount: true, // https://swr.vercel.app/docs/api
    revalidateOnReconnect: false,
    refreshWhenOffline: false,
    refreshWhenHidden: false,
    refreshInterval: 3600000, // one hour in milliseconds
};

interface WorkHistoryCardProps {
    formId: string, propertyId: string, lastUpdated: string, templateId: TemplateID | string,
    user: User, searchStr: string,
}

type CardTemplateProps = {
    raise?: boolean, link: string, date: string,
    Icon: SvgIconComponent, chipColor: "error" | "default" | "info" | "primary" | "secondary" | "success" | "warning",
    label: string, imgLen: number, locLen: number,
    children?: ReactNode
};

const WorkHistoryCard: FC<WorkHistoryCardProps> = ({formId, propertyId, templateId, lastUpdated, user, searchStr}: WorkHistoryCardProps) => {

    // FIXME: This currently directs to different pages based on TemplateID
    const toForm = `/work-history/${propertyId}/${templateId == TemplateID.WEEKLY_REPORT ? `weekly-report/${formId}` : formId}`

    const url: string = `api/history/${formId}`; // TODO: This does not fetch a PDF, consider decoupling
    const fetcher = useSWR(user.id ? [url, formId] : null, (async () => {
        const token = await user.getIdToken();
        return await axios.get(url, { baseURL: '/', headers: { Authorization: token } } )
            .then(res => res.data)
            .catch(e => { console.error(e); throw e });
    }), swrOptions);

    const { data, error, isLoading, isValidating } = fetcher;

    const cardText: string | null = useMemo(() => {
        if (!(data?.fields)) return null;
        let search = templateId == TemplateID.WORK_ORDER ? 'Description' : 'Text 5';
        return (data.fields[search]?.text) ? (data.fields?.[search]?.text) : null;
    }, [data, templateId]);

    const images = useMemo(() => {
        if (!(data?.fields)) return [];
        return Object.entries(data.fields)
            .filter((i: Record<string, any>) => (i[0].includes('Image')))
            .map((i: Record<string, any>) => ({imageFile: {...i[1]['imageFile']}}))
            .filter(({imageFile}) => imageFile['id']); // filters non-empty imageFile
    }, [data]);

    const locations = useMemo(() => {
        if (!(data?.fields)) return []
        return Object.entries(data.fields)
            .filter((i: Record<string, any>) => (i[0].includes('Location')))
            .map((i: Record<string, any>) => ({location: {...i[1]['location']},}))
            .filter(({location}) => location["latitude"] && location["longitude"]); // filters non-empty location
    }, [data]);

    /* FIXME: This search code is awful, refactor
     *
     * searchMatch: returns true if both a search string is given AND the description includes it
     * highlights: if searchMatch, returns the description as substrings split with matching regex, else entire description
     *
     * FIXME [highlights bug] returns single-character substrings when searchStr is empty ''. Added conditional as a Band-Aid fix
     */
    const searchMatch = ((searchStr.length > 0) && (cardText?.toLowerCase().includes(searchStr.toLowerCase())));
    const highlights = searchMatch ? cardText?.split(new RegExp(`(${searchStr})`, 'gi')) : [cardText as string];

    if (isLoading)return(<Skeleton variant='rectangular' height={200} sx={{ flex: '1 1 auto', borderRadius: 6, width: '100%' }} />);
    return(
        <CardTemplate raise={searchMatch} link={toForm} imgLen={images.length} locLen={locations.length}
                      date={lastUpdated ? format(new Date(lastUpdated), 'MM/dd/yyyy') : '---'}
                      chipColor={(templateId == TemplateID.WEEKLY_REPORT) ? 'info' : 'warning'}
                      Icon={(templateId == TemplateID.WEEKLY_REPORT) ? CircleNotificationsOutlinedIcon : BuildCircleOutlinedIcon}
                      label={(templateId == TemplateID.WEEKLY_REPORT) ? 'Weekly Report' : 'Work Order'}
        >
            <Box maxWidth='70ch'>
                {highlights?.map((sub, i) =>
                    <Span bgcolor={(sub?.toLowerCase() === searchStr?.toLowerCase()) ? 'warning.main' : 'inherit'}
                          key={i} >
                        { sub }
                    </Span>
                )}
            </Box>
        </CardTemplate>
    );
}

const CardTemplate: FC<CardTemplateProps> = ({ raise, link, date, Icon, chipColor, label, imgLen, locLen, children }: CardTemplateProps) => {
    return(
        <Card raised={raise}
              sx={{ borderRadius: 6, flex: '0 1 auto', width: {xs: '100%', md: '100%'}, order: `${(raise) ? -1 : 0}` }}
        >
            <CardActionArea component={NextLinkComposed} to={link}>
                <Stack direction='row' justifyContent='space-between' alignItems='flex-end' px={2} pt={2} pb={1}>
                    <H4 fontWeight={400}>{date}</H4>
                    <Chip variant='filled' icon={<Icon />} color={chipColor} label={label}/>
                </Stack>
                <Divider sx={{ mx: 2 }}/>
                <CardContent>
                    {children}
                </CardContent>
                <Stack direction='row' flexWrap='wrap' justifyContent='flex-end' p={2} pt={0} sx={{ gap: '1em' }}>
                    <Chip icon={<LocationOnOutlinedIcon />} variant="outlined"
                          label={`${locLen} Location${locLen == 1 ? '' : 's'}`}
                          sx={{ display: locLen ? 'flex' : 'none' }}
                    />
                    <Chip icon={<ImageOutlinedIcon />} variant="outlined"
                          label={`${imgLen} Image${imgLen == 1 ? '' : 's'}`}
                          sx={{ display: imgLen ? 'flex' : 'none' }}
                    />
                </Stack>
            </CardActionArea>
        </Card>
    );
}

export default WorkHistoryCard;