import { FC } from 'react';
import { FirestoreError } from "firebase/firestore";
import { Stack, styled } from '@mui/material';
import { Message } from "@firebaseUtils/client/messageConverter";
import ChatMessage from 'components/Chat/ChatMessage';

const StyledStack = styled(Stack)(({ theme }) => ({
    position: 'relative',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
}));

type ChatLogProps = { messages?: Message[], isLoading: boolean, error?: FirestoreError, uid: string | null };

const ChatLog: FC<ChatLogProps> = ({ messages = [], isLoading, error, uid }) => {

    return(
        <Stack overflow='auto' position='relative' flexDirection='column-reverse' flexGrow={1}>
            {/* TODO: add UI for loading, empty list, and error states */}
            {/* TODO: maybe move message mapping to parent component, then add children ReactNode prop */}
            <StyledStack>
                { messages.map((i) =>
                    <ChatMessage key={i.id} text={i.text} isSender={i.sender === uid}
                                 timestamp={i?.timestamp} location={i?.location}
                    />
                )}
            </StyledStack>
        </Stack>
    );
}

export default ChatLog;