// import { Fragment, FC, useState, useEffect } from 'react';
import { NextPage } from "next";
import { useAuthUser, AuthAction, withAuthUser } from "next-firebase-auth";

import { Box, Typography } from "@mui/material";
import Loader from "components/Loader";

import AuthLayout from "layouts/AuthLayout";
import WhatWeDoGrid from "layouts/Home/WhatWeDoGrid";
import Statistics from "layouts/Home/Statistics";

type HomePageProps = {

}

const HomePage: NextPage<HomePageProps> = () => {

    const AuthUser = useAuthUser();

    return(
        <AuthLayout signedIn={!!(AuthUser.id)} displayName={AuthUser.displayName}>
            <Box display='block' position='relative' height="75vh" overflow="hidden" mt={1}
                 borderRadius={(theme) => `${theme.spacing(3)} ${theme.spacing(3)} 0 0`}
            >
                <video src={"/assets/videos/homepage-video.mp4"} autoPlay playsInline loop muted
                       style={{ height: '90vh',maxWidth: '100%', objectFit: "cover", zIndex: -1 }}
                />
                <Box sx={{ width: '100%', height: '100%', position: 'absolute', top: '0%', left: '0%', bottom: '0%', right: '0%', }}>

                </Box>
            </Box>

            <Statistics/>

            <Box py={4}>
                <WhatWeDoGrid/>
            </Box>
        </AuthLayout>
    );
}

export default withAuthUser<HomePageProps>({
    whenAuthed: AuthAction.REDIRECT_TO_APP, // User is redirected to dashboard page, if the user is authenticated
    whenUnauthedBeforeInit: AuthAction.RENDER, // Renders page, if the user is not authenticated & the Firebase client JS SDK has not yet initialized.
    whenUnauthedAfterInit: AuthAction.RENDER, // Redirect to log-in page, if user is not authenticated
    whenAuthedBeforeRedirect: AuthAction.SHOW_LOADER, // Shows loader while redirecting
    LoaderComponent: Loader,
    appPageURL: '/dashboard', // Dashboard Page
})(HomePage);