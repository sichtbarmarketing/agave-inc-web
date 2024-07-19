import { useState, useEffect, useCallback, useMemo } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { getFirestore, doc, getDoc, query, where, orderBy, Timestamp, collection } from "firebase/firestore";
import { useUser } from "next-firebase-auth";
import profileConverter from "@firebaseUtils/client/profileConverter";
import chatConverter from "@firebaseUtils/client/chatConverter";
import messageConverter from "@firebaseUtils/client/messageConverter";

const useChatData = (chatId: string | null) => {
	const db = getFirestore();
	const AuthUser = useUser();

	const [lastReadTimestamps, setLastReadTimestamps] = useState<{
		[key: string]: Timestamp;
	}>({});

	const fetchLastReadTimestamps = useCallback(async () => {
		if (!AuthUser.id) return;

		const userDoc = doc(db, "users", AuthUser.id).withConverter(profileConverter);
		const userSnapshot = await getDoc(userDoc);
		if (userSnapshot.exists()) {
			const userData = userSnapshot.data();
			setLastReadTimestamps(userData.lastRead || {});
		}
	}, [AuthUser.id]);

	useEffect(() => {
		fetchLastReadTimestamps();
	}, [AuthUser.id, fetchLastReadTimestamps]);

	const chatsCol = collection(db, "chats").withConverter(chatConverter);
	const messagesCol = collection(db, `chats/${chatId}/messages`).withConverter(messageConverter);

	const [chatsData, chatsLoading, chatsError] = useCollectionData(
		AuthUser.id
			? query(chatsCol, where("members", "array-contains", AuthUser.id))
			: undefined
	);

	const [chatMessages, chatMessagesLoading, chatMessagesError] = useCollectionData(
		AuthUser.id && chatId ? query(messagesCol, orderBy("timestamp")) : undefined
	);

	const hasUnreadChatMessages = useMemo(() => {
		if (!chatsData || !lastReadTimestamps) return false;

		return chatsData.some(chat => {
			const lastReadTimestamp = lastReadTimestamps[chat.id];
			// @ts-expect-error - we need to use seconds to compare timestamps
			const chatLastMessageTimestamp = chat.lastMessage?.timestamp?.seconds as number;
			const hasNewMessages = lastReadTimestamp
				? chatLastMessageTimestamp > lastReadTimestamp.seconds
				: false;

			return hasNewMessages;
		});
	}, [chatsData, lastReadTimestamps]);

	return {
		lastReadTimestamps,
		chatsData,
		chatsLoading,
		chatsError,
		chatMessages,
		chatMessagesLoading,
		chatMessagesError,
		fetchLastReadTimestamps,
		hasUnreadChatMessages,
	};
};

export default useChatData;