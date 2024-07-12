import { NextPage } from "next";
import React, { useState, SyntheticEvent } from "react";
import { useAuthUser, withAuthUser, withAuthUserTokenSSR, AuthAction } from 'next-firebase-auth';

import { Container, Stack, Box } from '@mui/material';

import AuthLayout from "layouts/AuthLayout";
import PropertiesList from "layouts/PropertiesList";

import Loader from "components/Loader";
import TitleBar from "components/TitleBar";
import useSWR from "swr";
import axios from "axios";

import HomeWorkIcon from "@mui/icons-material/HomeWork";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import Grid from "@mui/material/Unstable_Grid2";


type WorkHistoryPageProps = { }
const WorkHistoryPage: NextPage<WorkHistoryPageProps> = () => {

    const propertiesURL = '/api/properties';

    const AuthUser = useAuthUser();

    const propertiesFetcher = useSWR(AuthUser.id ? propertiesURL: null, (async () => {
        const token = await AuthUser.getIdToken();
        return await axios.get(propertiesURL, { headers: { Authorization: token, } } )
            .then(res => res.data)
            .catch(e => { console.error(e); throw e });
    }));

    const { data: pData, error: pError, isLoading: pLoading, isValidating: pValidating } = propertiesFetcher;

    return(
        <AuthLayout signedIn={!!(AuthUser.id)} displayName={AuthUser.displayName}>
            <Container maxWidth='md' sx={{ mt: 3, mb: 6, minHeight: '60vh' }}>
                <TitleBar TitleIcon={WorkHistoryIcon} Title={"Work History"} />
                <PropertiesList validating={pValidating} loading={pLoading} error={pError}
                                properties={pData?.properties} showTitle={false} />
            </Container>
        </AuthLayout>
    )
}

export default withAuthUser<WorkHistoryPageProps>({
    whenAuthed: AuthAction.RENDER, // Page is rendered, if the user is authenticated
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER, // Shows loader, if the user is not authenticated & the Firebase client JS SDK has not yet initialized.
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN, // Redirect to log-in page, if user is not authenticated
    LoaderComponent: Loader,
})(WorkHistoryPage)