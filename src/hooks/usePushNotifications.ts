import { useState } from "react";
import { getMessaging, getToken, deleteToken, isSupported } from "@firebase/messaging";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import firebaseClient from "@firebaseUtils/firebaseClient";

const WEB_CREDENTIALS = { vapidKey: 'BM4ys8oe0rShWhuP9JxwqZkDZwj2lZcurQE2iO5bPCLEiwvuTvH573stGfg1f3W85M97AT0sVG82NxozdI8U7cc' };
const db = getFirestore(firebaseClient);
const FCM_COLLECTION = 'fcm';

const setTokenFCM = async (uid: string | null) => {
    if (uid == null) throw Error('No UID provided!');

    const msg = await isSupported() && getMessaging(firebaseClient);
    if (!msg) throw Error('Messaging Not Available!');

    const tokenFCM = await getToken(msg, { ...WEB_CREDENTIALS });
    if (!tokenFCM) throw Error('Notification Permission Not Granted!');

    const fcmRef = doc(db, FCM_COLLECTION, uid);
    await setDoc(fcmRef, { tokenFCM });
}

const unsetTokenFCM = async () => {
    const msg = await isSupported() && getMessaging(firebaseClient);
    if (!msg) throw Error('Messaging Not Available!');

    await deleteToken(msg);
}

const notificationPermissions = async (): Promise<Boolean> => {
    if (!("Notification" in window)) throw Error('Notifications Are Unavailable!');
    if (Notification.permission === "denied") throw Error('Notifications Permission Denied!');
    if (Notification.permission === "granted") return true;

    const perm = await Notification.requestPermission();
    return perm == 'granted';
}

type PushNotification = {
    allow: boolean, message: string, supported: () => Promise<boolean>,
    handleSubscribe: () => Promise<void>, handleUnsubscribe: () => Promise<void>,
}

export const usePushNotifications = (uid: string | null): PushNotification => {
    const [allow, setAllow] = useState(false);
    const [message, setMessage] = useState<string>("You can change your notification settings at any time.");
    const supported = async () => await isSupported();

    const handleSubscribe = async () => {
        try {
            setMessage('Enabling Push Notifications...');
            if (!await notificationPermissions()) return setMessage('Notifications Permission Denied');

            await setTokenFCM(uid);
            setAllow(true);
            setMessage('Enabled Push Notifications!')
        } catch (e: any) {
            setAllow(false);
            setMessage(e?.message ?? 'Unknown Error Occurred.');
            console.log(e);
        }
    }
    const handleUnsubscribe = async () => {
        try {
            setMessage('Disabling Push Notifications...');
            await unsetTokenFCM();
            setAllow(false);
            setMessage('Disabled Push Notifications!')
        } catch (e: any) {
            setMessage(e?.message ?? 'Unknown Error Occurred.');
        }
    }

    return {allow, supported, message, handleSubscribe, handleUnsubscribe};
}