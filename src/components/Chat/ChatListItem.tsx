import { FC } from "react";
import { Chat } from "@firebaseUtils/client/chatConverter";
import {
	Box,
	Avatar,
	Chip,
	ListItem,
	ListItemAvatar,
	ListItemButton,
	ListItemText,
	ListItemButtonProps,
} from "@mui/material";
import ReplyIcon from "@mui/icons-material/Reply";
import ChatIcon from "@mui/icons-material/Chat";
import GroupIcon from "@mui/icons-material/Group";
import MessageIcon from "@mui/icons-material/Message";
import { Timestamp } from "firebase/firestore";
import { formatRelative } from "date-fns";
import { Span } from "components/Typography";

type ChatListItemProps = {
	chat: Partial<Chat>;
	sent: boolean;
	selected: ListItemButtonProps["selected"];
	hasNewMessages: boolean;
	onClick: ListItemButtonProps["onClick"];
};

const ChatListItem: FC<ChatListItemProps> = ({
	chat,
	sent,
	selected,
	hasNewMessages,
	onClick,
}) => {
	return (
		<ListItem
			disablePadding
			sx={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
			<ListItemButton selected={selected} onClick={onClick}>
				<ListItemAvatar>
					{hasNewMessages ? (
						<Avatar sx={{ bgcolor: "error.main" }}>
							<MessageIcon />
						</Avatar>
					) : (
						<Avatar sx={{ bgcolor: "secondary.main" }}>
							<GroupIcon />
						</Avatar>
					)}
				</ListItemAvatar>
				<ListItemText
					primary={
						<Span
							color='grey.900'
							fontWeight={600}
							ellipsis
							maxWidth='90%'
							display='inline-block'>
							{chat?.title ? chat.title : "Untitled Conversation"}
						</Span>
					}
					secondary={
						<Box display='flex' flexDirection='column' alignItems='flex-start'>
							<Chip
								size='small'
								sx={{ mr: 1 }}
								icon={sent ? <ReplyIcon /> : <ChatIcon />}
								label={
									chat?.lastMessage?.timestamp instanceof Timestamp &&
									formatRelative(chat.lastMessage.timestamp.toDate(), Date.now())
								}
							/>
							<Span color='grey.600' ellipsis maxWidth='90%' display='inline-block'>
								{hasNewMessages
									? `New Message: ${chat?.lastMessage?.text}`
									: chat?.lastMessage?.text}
							</Span>
						</Box>
					}
				/>
			</ListItemButton>
		</ListItem>
	);
};

export default ChatListItem;
