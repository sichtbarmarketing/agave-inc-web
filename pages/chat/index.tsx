import { NextPage } from "next";
import { useState } from 'react';
import { useAuthUser, withAuthUser, AuthAction } from "next-firebase-auth";
import {
    getFirestore,
    collection,
    doc,
    addDoc,
    updateDoc,
    serverTimestamp,
    Timestamp,
    query,
    orderBy,
    limit,
    where,
    CollectionReference,
    DocumentReference,
    getDocs
} from 'firebase/firestore';
import { getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore';
import messageConverter, { NewMessage } from "@firebaseUtils/client/messageConverter";
import chatConverter, { NewChat } from "@firebaseUtils/client/chatConverter";
import profileConverter, { Profile } from "@firebaseUtils/client/profileConverter";

import { useToggle } from "hooks/useToggle";
import { Stack, IconButton, Fab } from '@mui/material';
import Loader from "components/Loader";

import ChatInput from "components/Chat/ChatInput";
import ChatLog from "components/Chat/ChatLog";
import ChatListContainer from "components/Chat/ChatListContainer";
import ChatListItem from "components/Chat/ChatListItem";
import NoChat from "components/Chat/NoChat";
import LocationDialog from "components/Chat/LocationDialog";
import CreateDialog from "components/Chat/CreateDialog";

import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

type ChatIndexProps = {}
const ChatIndexPage: NextPage<ChatIndexProps> = () => {

    const app = getApp()
    const db = getFirestore();
    const auth = getAuth();
    const AuthUser = useAuthUser();

    // State for currently selected chat & it's toggle function
    const [chatId, setChatId] = useState<string | null>(null);
    const toggleChat = (cId?: string) => { setChatId(cId ?? null) };
    // Log the chat id if in development mode
    if (process.env.NODE_ENV === 'development') console.log("Current Chat ID: ", chatId);


    // Toggle state for Dialog components
    const [createDialog, toggleCreateDialog] = useToggle(false);
    const [locationDialog, toggleLocationDialog] = useToggle(false);

    // Limit state, for pagination
    const [profLimit, setProfLimit] = useState(true);

    const chatsCol = collection(db, 'chats').withConverter(chatConverter);
    const messagesCol = collection(db, `chats/${chatId}/messages`).withConverter(messageConverter);
    const profilesCol = collection(db, 'users').withConverter(profileConverter);

    /** TODO: maybe move this handle function to Chat Input and Location Dialog */
    const handleSend = async (text: string, lat?: number, lng?: number, acc?: number) => {

        if (!AuthUser.id) return console.error('No AuthUser found!');
        if (!chatId) return console.error('No Chat has been selected!');

        const currChatDoc = doc(db, 'chats', chatId).withConverter(chatConverter);

        await addMessage({
            sender: AuthUser.id,
            text: text,
            location: (lat && lng && acc) ? { lat: lat, lng: lng, acc: acc } : null,
            timestamp: serverTimestamp(),
        }, messagesCol, currChatDoc);
    }

    /** addMessage: creates a message document **/
    const addMessage = async (message: NewMessage, msgCol: CollectionReference, chatDoc: DocumentReference) => {
        try {
            const messageRef = await addDoc(msgCol, {
                ...message,
                timestamp: serverTimestamp()
            } as NewMessage);

            /* FIXME: This should be a Cloud Function, triggered whenever a new Message doc is added */
            await updateDoc(chatDoc, {
                lastMessage: { sender: message.sender, text: message.text, timestamp: Timestamp.now() }
            });

            // Call the internal API /api/chat/messageSent.ts to send a notification
            const idToken = await AuthUser.getIdToken();
            const res = await fetch('/api/chat/messageSent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: idToken as string,
                },
                body: JSON.stringify({ chatId }),
            });
        } catch (e) {
            console.error('An Error occurred while sending message!', e);
        }
    }

    /** addChat: creates new Firebase Chat Doc with the given Profile, AuthUser, chatsCol **/
    const addChat = async (prof: Profile): Promise<{ref?: DocumentReference, err?: Error }> => {

        let resObj: {ref?: DocumentReference, err?: Error } = { }

        if (!AuthUser.id) return { ...resObj, err: new Error('Not logged in: No user found!') };
        if (!prof.id) return { ...resObj, err: new Error('No Profile found!') };
        if (prof.id === AuthUser.id) return { ...resObj, err: new Error('That\'s you!') };

        const q = query(chatsCol,
            where('createdBy', '==', AuthUser.id),
            where('members', 'array-contains', prof.id)
        );

        try {
            const prevChats = await getDocs(q);
            if (!prevChats.empty) resObj = { ...resObj, err: new Error('Previous chats found; Creating new chat anyway.') };

            const chat: NewChat = {
                createdBy: AuthUser.id, members: [AuthUser.id, prof.id],
                title: `${AuthUser.displayName} & ${prof.displayName}`, icon: null,
                lastMessage: {
                    sender: AuthUser.id, timestamp: serverTimestamp(),
                    text: `${AuthUser.displayName} started a new chat.`,
                }
            }

            const chatRef = await addDoc(chatsCol, chat);
            resObj = { ...resObj, ref: chatRef }

            toggleChat(chatRef.id);

        } catch (e: any) {
            if (e instanceof Error) resObj = { ...resObj, err: e }
            else resObj = { ...resObj, err: new Error('Unknown Error occurred!') }
        }

        return resObj;
    }

    /**
     * queries collection data for the chat history where the current user (AuthUser.id) is a member
     * TODO: Needs Pagination
     **/
    const [chatsData, chatsLoading, chatsError] = useCollectionData(
        (AuthUser.id)
            ? query(chatsCol, where('members', 'array-contains', AuthUser.id))
            : undefined
    );

    /**
     * queries collection data for the messages of currently selected chatId
     * TODO: Needs Pagination
     **/
    const [chatMessages, chatMessagesLoading, chatMessagesError] = useCollectionData(
        (AuthUser.id && chatId)
            ? query(messagesCol, orderBy('timestamp'))
            : undefined
    );

    /** querying data from 'users' collection FIXME: is using ugly conditional limit instead of pagination */
    const [profiles, pLoading, pError] = useCollectionData(
        (AuthUser.id) ? (profLimit) ? query(profilesCol, limit(5)) : query(profilesCol) : undefined
    );

    return(
        <>
            <Stack direction='row' height={'100%'} flexWrap='nowrap' justifyContent='center' sx={{ gap: '1em' }}>
                <ChatListContainer flex={'1 0'} sx={{ minWidth: { xs: '100%', md: '30%' }, maxWidth: { md: 300 } }}
                                   display={{ xs: chatId ? 'none' : 'block', md: 'block' }}
                                   isLoading={chatsLoading} error={chatsError}
                                   action={<Fab color='primary' onClick={() => toggleCreateDialog(true)}
                                                sx={{ position: 'absolute', bottom: 16, right: 16, }}
                                   >
                                       <CreateOutlinedIcon />
                                   </Fab>}
                >
                    {chatsData?.map((chat) =>
                        <ChatListItem key={chat.id} chat={chat} selected={chatId === chat.id}
                                      sent={(chat.lastMessage?.sender) === (AuthUser.id)}
                                      onClick={() => toggleChat(chat.id)}
                        />
                    )}
                </ChatListContainer>
                <Stack flex='1 0' sx={{ minWidth: { xs: '100%', md: '30%' } }} bgcolor={'grey.200'} px={3} pt={2} borderRadius={(theme) => theme.spacing(3)}
                       flexDirection='column' alignItems={'stretch'} justifyContent={'space-between'} display={{ xs: chatId ? 'flex' : 'none', md: 'flex' }}
                >
                    <Stack direction='row' justifyContent='flex-start' alignItems='center' py={1}>
                        <IconButton onClick={() => toggleChat()}><ArrowBackIcon/></IconButton>
                    </Stack>
                    <NoChat display={chatId ? 'none' : 'block'} />
                    <ChatLog messages={chatMessages} isLoading={chatMessagesLoading} error={chatMessagesError} uid={AuthUser.id}/>
                    <ChatInput send={handleSend} toggleDialog={toggleLocationDialog} />
                </Stack>
            </Stack>
            <LocationDialog send={handleSend} toggleDialog={toggleLocationDialog} open={locationDialog} />
            <CreateDialog list={profiles} load={pLoading} err={pError} open={createDialog} toggle={toggleCreateDialog}
                          handleAdd={addChat} limit={profLimit} handleLimit={() => setProfLimit(false)}
            />
        </>
    );
}

export default withAuthUser<ChatIndexProps>({
    whenAuthed: AuthAction.RENDER, // Page is rendered, if the user is authenticated
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER, // Shows loader, if the user is not authenticated & the Firebase client JS SDK has not yet initialized.
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN, // Redirect to log-in page, if user is not authenticated
    LoaderComponent: Loader,
})(ChatIndexPage)