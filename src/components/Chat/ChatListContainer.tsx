import { FC, ReactNode } from 'react';
import { Box, BoxProps, Stack, Divider, List, CircularProgress } from '@mui/material';
import TitleBar from "components/TitleBar";
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import { FirestoreError } from "firebase/firestore";

interface ChatHistoryProps extends BoxProps {
    isLoading: boolean,
    error?: FirestoreError,
    action?: ReactNode,
    children?: ReactNode,
}

const ChatListContainer: FC<ChatHistoryProps> = ({ isLoading, action, children, ...props }: ChatHistoryProps) => {

    return(
        <Box position='relative' height='100%' {...props}>
            <Stack direction='column' flexWrap='nowrap' height='100%'>
                <Stack direction='row' justifyContent='space-between' alignItems='center' px={2}>
                    <TitleBar TitleIcon={MailOutlineOutlinedIcon} Title={'Chats'} flexGrow={0}/>
                </Stack>
                <Divider />
                <List sx={{ overflow: 'auto', flexGrow: 1 }} >
                    { children }
                    { isLoading && <Stack alignItems='center'><CircularProgress/></Stack> }
                </List>
            </Stack>
            { action }
        </Box>
    );
}

export default ChatListContainer;