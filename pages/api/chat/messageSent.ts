import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import initFirebaseAdminSDK from "@firebaseUtils/firebaseAdmin";
import { apiHandler } from "utils/api/apiHandler";
import { getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";
import { verifyIdToken } from "next-firebase-auth";
import { AxiosError, isAxiosError } from "axios";
import createHttpError from "http-errors";
import initAuth from "@firebaseUtils/initAuth";

type User = {
	id: string;
	displayName: string;
	admin: boolean;
	properties: any[];
};
const USERS_COL_: string = "users";

const createChatHandler: NextApiHandler = async (
	req: NextApiRequest,
	res: NextApiResponse
) => {
	// Initializing Firebase Admin SDK
	initAuth();
	initFirebaseAdminSDK();
	const db = getFirestore();

	const token = req.headers["authorization"];
	const body = req.body;
	const { chatId } = body;

	if (!token)
		return res
			.status(401)
			.json({ user: null, message: "POST Chat failed; No token!" });
	if (!chatId)
		return res
			.status(400)
			.json({ user: null, message: "POST Chat failed. No properties." });

	try {
		// Verifying ID Token
		const authUser = await verifyIdToken(token);
		if (!authUser.id)
			return res
				.status(401)
				.json({ user: null, message: "POST Chat failed. Unauthorized!" });

		// Get the chat document
		const chatDoc = await db.collection("chats").doc(chatId).get();
		if (!chatDoc.exists)
			return res
				.status(404)
				.json({ user: null, message: "POST Chat failed. Chat not found!" });

		// Get last message from chat
		const lastMessage = chatDoc.data()?.lastMessage;
		if (!lastMessage)
			return res
				.status(404)
				.json({ user: null, message: "POST Chat failed. No last message found!" });

		// Get the sender of the last message
		const sender = lastMessage.sender;

		// Filter out the sender from the chat members
		const members = chatDoc.data()?.members;
		const recipient = members.filter((member: string) => member !== sender)[0];

		// Get the recipient's FCM tokens
		const recipientDoc = (await db.collection("fcm").doc(recipient).get()).data();

		// Send a push notification to the recipient using the FCM tokens
		if (recipientDoc) {
			const fcmToken = recipientDoc?.tokenFCM;

			const message = {
				data: {
					title: "New Message",
					body: authUser?.displayName
						? `${authUser?.displayName} sent you a new message.`
						: `Someone sent you a new message.`,
				},
				token: fcmToken,
			};

			const messaging = getMessaging();
			const messageRes = await messaging.send(message);
			console.log(
				"🛑 ~ constcreateChatHandler:NextApiHandler= ~ messageRes:",
				messageRes
			);
		} else {
			console.log("Recipient FCM token not found!");
		}

		return res.status(200).json({ user: true, message: "POST Chat success!" });
	} catch (err: any | AxiosError) {
		if (isAxiosError(err)) {
			console.log(err);
			return res
				.status(400)
				.json({
					users: null,
					message: "There was an error processing your request.",
				});
		}

		// eslint-disable-next-line no-console
		console.error(err);
		throw new createHttpError.InternalServerError(
			(err as Error).message ?? "Unknown internal error occurred!"
		);
	}
};

export default apiHandler({
	POST: createChatHandler,
});
