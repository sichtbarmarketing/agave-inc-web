import { NextPage } from "next";
import React, { useState } from "react";

import { Box, Container, Paper, Stack } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import enUS from 'date-fns/locale/en-US';
import TodayIcon from '@mui/icons-material/Today';

import AuthLayout from "layouts/AuthLayout";
import { useUser, withUser, withUserTokenSSR, AuthAction } from 'next-firebase-auth';
import PropertiesList from "layouts/PropertiesList";

import Loader from "components/Loader";
import useSWR from "swr";
import axios from "axios";
import Settings from "@mui/icons-material/Settings";
import PersonIcon from '@mui/icons-material/Person';
import TitleBar from "components/TitleBar";
import UserCard from "components/UserCard";

import wateringGuidelines from "@public/assets/images/dashboard/landscape-watering-guidelines.png"
import Image from "next/image";

type DashboardPageProps = { }
const DashboardPage: NextPage = () => {

    const propertiesURL = '/api/properties';
    const AuthUser = useUser();

    const fetcher = useSWR(AuthUser.id ? propertiesURL: null, (async () => {
        const token = await AuthUser.getIdToken();
        return await axios.get(propertiesURL, { headers: { Authorization: token, } } )
            .then(res => res.data)
            .catch(e => { console.error(e); throw e });
    }));

    const { data, error, isLoading, isValidating } = fetcher;

    return(
        <AuthLayout signedIn={!!(AuthUser.id)} displayName={AuthUser.displayName}>
            <Container maxWidth='md' sx={{ mt: 3, mb: 6, minHeight: '50vh' }}>
                <TitleBar TitleIcon={PersonIcon} Title={(AuthUser?.displayName) ? `Hello, ${AuthUser.displayName}!` : 'Dashboard'}/>
                <Stack direction='row' flexWrap='wrap' position='relative' width='100%' sx={{ gap: '1em' }}>

                    <Stack direction='row' flexWrap='wrap' position='relative' justifyContent='center' width='100%' sx={{ gap: '1em' }}>
                        <UserCard displayName={AuthUser?.displayName} phoneNumber={AuthUser?.phoneNumber}
                                  photoURL={AuthUser?.photoURL} email={AuthUser?.email}
                                  sx={{ minWidth: { xs: '100%', sm: 'calc(50% - 1em)', md: 'calc(60% - 1em)' } }}
                        />

                        <Box minWidth={{ xs: '100%', sm: 'calc(50% - 1em)', md: 'calc(40% - 1em)' }} maxWidth={'100%'} position='relative'>
                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enUS}>
                                <DateCalendar />
                            </LocalizationProvider>
                        </Box>
                    </Stack>
                    <PropertiesList validating={isValidating} loading={isLoading} error={error} properties={data?.properties}/>
                </Stack>
            </Container>
        </AuthLayout>
    );
}



export default withUser<DashboardPageProps>({
    whenAuthed: AuthAction.RENDER, // Page is rendered, if the user is authenticated
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER, // Shows loader, if the user is not authenticated & the Firebase client JS SDK has not yet initialized.
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN, // Redirect to log-in page, if user is not authenticated
    LoaderComponent: Loader,
})(DashboardPage)