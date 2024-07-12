import React, { FC } from 'react';

import { Box, BoxProps, SvgIcon, IconTypeMap } from "@mui/material";

import { H1 } from 'components/Typography';

interface TitleBarProps extends BoxProps {
    TitleIcon: typeof SvgIcon,
    Title: string,
}

const TitleBar: FC<TitleBarProps> = ({ TitleIcon, Title , ...props }) => {
    return(
        <Box display='flex' alignItems='center' my={2} {...props} >
            <TitleIcon color='primary' fontSize={'large'}/>
            <H1 ml={1.5}>{Title}</H1>
        </Box>
    );
};

export default TitleBar;