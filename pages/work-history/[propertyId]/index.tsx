import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState, SyntheticEvent, ChangeEvent, createContext, useContext } from "react";
import { useUser, withUser, AuthAction, AuthUserContext } from 'next-firebase-auth';

import { getStorage } from "firebase/storage";
import { subDays, formatISO } from "date-fns";
import { PropertySchema } from "utils/api/yup";
import * as yup from "yup";

import { Divider, Stack, Box, List, Tabs, Tab, Skeleton, CircularProgress } from "@mui/material";

import AuthLayout from "layouts/AuthLayout";
import Loader from "components/Loader";
import TitleBar from "components/TitleBar";
import { H2, H3 } from 'components/Typography';
import WorkHistoryCard from "components/WorkHistoryCard";
import WorkHistoryFilters from "components/WorkHistoryFilters";

import AgaveContacts from "components/AgaveContacts";
import AgaveDetails from "components/AgaveDetails";
import FirebaseImage from "components/FirebaseImage";

import useSWR from "swr";
import axios from "axios";
import { useToggle } from "hooks/useToggle";
import Calendar from "components/Calendar";

import { swrOnceOptions } from "utils/client/fetcher";

/** ICONS **/
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
// import CircleNotificationsOutlinedIcon from '@mui/icons-material/CircleNotificationsOutlined';
// import BuildCircleOutlinedIcon from '@mui/icons-material/BuildCircleOutlined';
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import NumbersOutlinedIcon from "@mui/icons-material/NumbersOutlined";
import ErrorIcon from '@mui/icons-material/Error';

type PropertyPageProps = { };
type DateRange = { start: Date, end: Date };
type WorkHistoryListProps = { propertyId?: string, AuthUser: AuthUserContext };

/** FIXME: this should not be static **/
export enum TemplateID {
    WEEKLY_REPORT = 'f9b58d1a-0101-400c-ab2c-f4f2b1532bb2',
    UNUSED = '6efc08b0-8942-42f0-a7d0-2c19981e1684',
    WORK_ORDER = '68dac9d2-20d9-4ca8-9156-c7158bd85fbe',
}

export type Filters = { template: TemplateID, dateRange: DateRange, search: string }

export const FilterContext = createContext<Filters>({
    template: TemplateID.WORK_ORDER,
    dateRange: { start: subDays(new Date(), 30), end: new Date() },
    search: '',
});

const PropertiesPage: NextPage<PropertyPageProps> = () => {

    const storage = getStorage();

    const router = useRouter();
    const AuthUser = useUser();
    const propertyId = router.query.propertyId;
    const url: string = `api/properties/${propertyId}`;

    if (!propertyId) router.push('/work-history'); // FIXME: this might be unnecessary

    const [template, setTemplate] = useState<TemplateID>(TemplateID.WORK_ORDER);
    const [dateRange, setRange] = useState<DateRange>({ start: subDays(new Date(), 30), end: new Date() });
    const [search, setSearch] = useState<string>('');
    const [calendar, toggleCalendar] = useToggle(false);

    // FIXME: MOVE TO CONTEXT
    const handleTemplate = (e: SyntheticEvent, value: TemplateID) => { setTemplate(value) }
    const searchControl = (event: ChangeEvent<HTMLInputElement>) => { setSearch(event.target.value) };
    const rangeControl = (nRange: DateRange) => {
        setRange({ start: nRange.start, end: nRange.end });
        toggleCalendar(false);
    };
    // FIXME: MOVE TO CONTEXT ^

    const fetcher = useSWR(AuthUser ? url : null, (async () => {
        const token = await AuthUser.getIdToken();
        return await axios.get(url, { baseURL: '/', headers: { Authorization: token } } )
            .then(res => res.data)
            .catch(e => { console.error(e); throw e });
    }), swrOnceOptions);

    const { data, error, isLoading, isValidating } = fetcher;
    let property: undefined | null | yup.InferType<typeof PropertySchema> = data?.property;

    return (
        <AuthLayout signedIn={!!(AuthUser.id)} displayName={AuthUser.displayName}>
            <FilterContext.Provider value={{ template: template, dateRange: dateRange, search: search }}>
                <Box px={2} mb={4}>
                    <TitleBar TitleIcon={WorkHistoryIcon} Title={`${property?.name ?? 'Property'} - Work History`} />
                    <Stack direction='row' flexWrap='wrap' sx={{ gap: '2em' }}>
                        <Stack flex='3 0' sx={{ gap: '2em' }}>
                            <Box bgcolor={'grey.400'} minHeight={400} borderRadius={4} position='relative' overflow='hidden'>
                                {
                                    (property)
                                        ? <FirebaseImage storage={storage} imgURL={property?.displayImage} alt={`Image for ${property?.name}`}/>
                                        : <Skeleton variant='rectangular' height={400} sx={{ borderRadius: 4 }}/>
                                }
                            </Box>
                            <Box>
                                <Box mb={3} sx={{ borderBottom: 1, borderColor: 'grey.500' }}>
                                    <Tabs value={template} onChange={handleTemplate} >
                                        <Tab label="Work Orders" value={TemplateID.WORK_ORDER}/>
                                        <Tab label="Weekly Reports" value={TemplateID.WEEKLY_REPORT}/>
                                    </Tabs>
                                </Box>
                                <WorkHistoryFilters search={search} searchControl={searchControl}
                                                    from={dateRange.start} to={dateRange.end}  calendarControl={toggleCalendar}
                                />
                                <WorkHistoryList AuthUser={AuthUser} propertyId={property?.id} />
                            </Box>
                        </Stack>
                        <Stack flex='2 0' position='relative' maxWidth={'100%'} minWidth={{ xs: '100%', md: 'calc(25% - 1em)' }} >
                            <Box position='sticky' top={0}>
                                <Box overflow='hidden'>
                                    <H3 fontWeight={400} mb={1}>{`${property?.name ?? 'Property'} Details`}</H3>
                                    <List disablePadding>
                                        <AgaveDetails Icon={BadgeOutlinedIcon}
                                                      primary={'Account Manager'} secondary={property?.accountMgr?.name}
                                                      email={property?.accountMgr?.email}
                                                      phone={property ? property.accountMgr?.phone?.toString() : undefined}
                                                      storage={storage} imgURL={property?.accountMgr.image}
                                        />
                                        <AgaveDetails Icon={PersonOutlineOutlinedIcon}
                                                      primary={'Community Manager'} secondary={property?.manager?.name}
                                                      email={property?.manager?.email}
                                        />
                                        <AgaveDetails Icon={NumbersOutlinedIcon}
                                                      primary={'Job Number'} secondary={property?.jobNumber}
                                        />
                                    </List>
                                </Box>
                                <Divider sx={{ mt: 3, mb: 2 }}/>
                                <AgaveContacts />
                            </Box>
                        </Stack>
                    </Stack>
                    <Calendar open={calendar} onClose={() => toggleCalendar(false)} range={dateRange} onConfirm={rangeControl}/>
                </Box>
            </FilterContext.Provider>
        </AuthLayout>
    )
}

function WorkHistoryList ({ propertyId, AuthUser }: WorkHistoryListProps ) {

    const historyURL = 'api/history';
    const { template, dateRange, search } = useContext(FilterContext);

    const fetcher = useSWR(AuthUser.id && propertyId && template && dateRange.start && dateRange.end ?
            [
                historyURL, propertyId, template,
                formatISO(dateRange.start, {representation: 'date'}),
                formatISO(dateRange.end, { representation: 'date' })
            ] : null,
        (async ([historyURL, property, template, startDate, endDate]) => {
            const filterStr = `lastupdateddate gt ${startDate} and lastupdateddate lt ${endDate}`;
            const token = await AuthUser.getIdToken();
            return await axios.get(historyURL, {
                baseURL: '/',
                headers: { Authorization: token, },
                params: { templateId: template, propertyName: property, filter: filterStr },
            })
                .then(res => res.data)
                .catch(e => { console.error(e); throw e })
        })
    );

    const { data, isLoading } = fetcher;

    if (!propertyId || isLoading || !data) return (
        <WorkHistoryAlert Icon={<CircularProgress sx={{ mb: 3 }}/>}
                          title='Loading Work History' text='This will just take a moment...'
        />
    );
    return (
        <Stack direction='column' sx={{ gap: '1em'}} minHeight='50vh' alignItems='flex-start' alignContent='flex-start'>
            {   data?.forms.length == 0 &&
                <WorkHistoryAlert Icon={<ErrorIcon sx={{ fontSize: '3rem', mb: 3 }}/>}
                                  title='No Work History Available' text='Contact us if you need assistance.'
                />
            }
            {data?.forms.map((i: any) =>
                <WorkHistoryCard key={i?.formId} user={AuthUser} propertyId={propertyId} searchStr={search}
                                 templateId={i?.templateId} formId={i?.formId} lastUpdated={i?.lastUpdateDate}
                />
            )}
        </Stack>
    )
}

function WorkHistoryAlert({ Icon, title, text }: {Icon: any, title: string, text: string}) {
    return (
        <Stack minHeight='50vh' width='100%' direction='column' alignItems='center' justifyContent='center' borderRadius={4}
               sx={{ border: 1, borderColor: theme => `${theme.palette.grey["500"]}` }}
        >
            {Icon}
            <H2 textAlign='center'>{title}</H2>
            <p>{text}</p>
        </Stack>
    )
}

export default withUser<PropertyPageProps>({
    whenAuthed: AuthAction.RENDER, // Page is rendered, if the user is authenticated
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER, // Shows loader, if the user is not authenticated & the Firebase client JS SDK has not yet initialized.
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN, // Redirect to log-in page, if user is not authenticated
    LoaderComponent: Loader,
})(PropertiesPage)