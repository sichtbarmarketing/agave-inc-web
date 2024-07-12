import { FC } from 'react';
import { Box, BoxProps, Stack } from "@mui/material";

import { H2, Span } from 'components/Typography';
import Image from "next/image";

import AgaveLogo from '@public/assets/images/logo-agave.png';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
interface NoChatProps extends BoxProps {
    view: boolean
}

const NoChat: FC<BoxProps> = ({ ...props }) => {

    return(
        <Box {...props} height={'100%'} position='relative'
        >
            <Stack alignItems='center' justifyContent='center' height='100%'>
                <ChatBubbleOutlineOutlinedIcon color='secondary' sx={{ fontSize: '100px'}}/>
                <H2 color='secondary.700'>No Message Selected</H2>
                <Span color='secondary.600'>
                    Start the conversation by clicking a chat from the left-side pane
                </Span>
            </Stack>
        </Box>
    );
}

export default NoChat;