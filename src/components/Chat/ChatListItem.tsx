import { FC } from "react";
import { Chat } from "@firebaseUtils/client/chatConverter";
import { Box, Avatar, Chip, ListItem, ListItemAvatar, ListItemButton, ListItemText, ListItemButtonProps } from "@mui/material";
import ReplyIcon from "@mui/icons-material/Reply";
import ChatIcon from "@mui/icons-material/Chat";
import GroupIcon from '@mui/icons-material/Group';
import { Timestamp } from "firebase/firestore";
import { formatRelative } from "date-fns";
import { Span } from "components/Typography";

type ChatListItemProps = {
    chat: Partial<Chat>,
    sent: boolean,
    selected: ListItemButtonProps['selected'],
    onClick: ListItemButtonProps['onClick']
}

const ChatListItem: FC<ChatListItemProps> = ({ chat, sent, selected, onClick }) => {

    return(
        <ListItem disablePadding sx={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            <ListItemButton selected={selected} onClick={onClick}>
                <ListItemAvatar><Avatar sx={{ bgcolor: 'secondary.main' }}><GroupIcon /></Avatar></ListItemAvatar>
                <ListItemText
                    primary={
                        <Span color='grey.900' fontWeight={600} ellipsis maxWidth='90%' display='inline-block'>
                            {chat?.title ? chat.title : 'Untitled Conversation'}
                        </Span>
                    }
                    secondary={
                        <Box display='flex' flexDirection='column' alignItems='flex-start'>
                            <Chip size='small' sx={{mr: 1}} icon={sent ? <ReplyIcon/> : <ChatIcon/>}
                                  label={
                                      (chat?.lastMessage?.timestamp instanceof Timestamp)
                                      && formatRelative(chat.lastMessage.timestamp.toDate(), Date.now())
                                  }
                            />
                            <Span color='grey.600' ellipsis maxWidth='90%' display='inline-block'>
                                {chat?.lastMessage?.text}
                            </Span>
                        </Box>
                    }
                />
            </ListItemButton>
        </ListItem>
    )
};

export default ChatListItem;