import { FC } from "react";
import { Box, Stack, styled } from "@mui/material";
import { Small } from "components/Typography";
import { formatRelative } from 'date-fns'
import { Timestamp, FieldValue } from "firebase/firestore";

const MessageBox = styled(Box)(({theme}) => ({

    padding: theme.spacing(1),
    margin: `${theme.spacing(0.25)} 0px`,
    width: 'fit-content', minWidth: '30ch',

    '&.sender': { backgroundColor: theme.palette.primary.light, alignSelf: 'flex-end' },
    '&.recipient': { backgroundColor: theme.palette.grey["400"], alignSelf: 'flex-start' },

    /* Targets a sender element that is NOT preceded by other sender elements */
    '&.sender:not(.sender+.sender)': {
        marginTop: theme.spacing(1.5), borderTopRightRadius: '5px', borderTopLeftRadius: '5px'
    },
    /* Targets a sender element that does NOT precede another sender element */
    '&.sender:not(:has(+ .sender))': {
        marginBottom: theme.spacing(1.5), borderBottomRightRadius: '5px', borderBottomLeftRadius: '5px'
    },

    /* Targets a recipient element that is NOT preceded by other recipient elements */
    '&.recipient:not(.recipient+.recipient)': {
        marginTop: theme.spacing(1.5), borderTopRightRadius: '5px', borderTopLeftRadius: '5px'
    },
    /* Targets a recipient element that does NOT precede another recipient element */
    '&.recipient:not(:has(+ .recipient))': {
        marginBottom: theme.spacing(1.5), borderBottomRightRadius: '5px', borderBottomLeftRadius: '5px'
    },

}));

const embed: any = {
    key: process.env.NEXT_PUBLIC_MAPS_EMBED_API_KEY,
    width: 215, height: 215,
    style: { border: 0, borderRadius: 5, minHeight: 100 },
    url: 'https://www.google.com/maps/embed/v1/place'
}

type ChatMessageProps = { text: string, isSender: boolean, timestamp: Timestamp | FieldValue, location?: { lat: number, lng: number } | null };

const ChatMessage: FC<ChatMessageProps> = ({ text, isSender, timestamp, location }) => {

    if (location) return(
        <MessageBox className={ isSender ? 'sender' : 'recipient'}>
            <iframe width={embed.width} height={embed.height} style={embed.style} loading="lazy"
                    src={`${embed.url}?q=${location.lat},${location.lng}&key=${embed.key}`} allowFullScreen
            />
            <Stack direction='row' justifyContent='flex-end'>
                <Small color='grey.600' fontSize='smaller'>
                    {timestamp instanceof Timestamp ? formatRelative(timestamp.toDate(), Date.now()) : 'sending...'}
                </Small>
            </Stack>
        </MessageBox>
    )

    return(
        <MessageBox className={ isSender ? 'sender' : 'recipient'}>
            { text }
            <Stack direction='row' justifyContent='flex-end'>
                <Small color='grey.600' fontSize='smaller'>
                    {timestamp instanceof Timestamp ? formatRelative(timestamp.toDate(), Date.now()) : 'sending...'}
                </Small>
            </Stack>
        </MessageBox>
    )
}

export default ChatMessage;