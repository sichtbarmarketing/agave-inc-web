import React, { FC, ReactNode } from 'react';
import { Box, BoxProps } from '@mui/material';
import Header from 'components/Header';
import Footer from 'components/Footer';
import AuthedButton from "components/AuthedButton";

interface AuthLayoutProps extends BoxProps { signedIn?: boolean, displayName?: string | null, children?: ReactNode, };

const AuthLayout: FC<AuthLayoutProps> = ({ signedIn = false, displayName = null, children, ...props }) => {

    return(
        <Box position={'relative'} {...props}>
            <Header setHeight={90} zIndex={100} overflow='hidden'> {/* FIXME: remove overflow prop */}
                <Box><AuthedButton signedIn={signedIn} name={displayName}/></Box>
            </Header>
            {children}
            <Footer/>
        </Box>
    );
};

export default AuthLayout;