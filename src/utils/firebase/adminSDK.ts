import { cert, getApps, initializeApp, App } from "firebase-admin/app";
import { getPrivateKey } from "./getPrivateKey";

const firebaseAdminInitConfig = {
    credential: {
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID as string,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL as string,
        privateKey: getPrivateKey(),
    },
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL as string,
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET as string,
}

const adminSDK = (): App => {
    const apps = getApps();
    if (!apps.length) {
        return initializeApp({
            ...firebaseAdminInitConfig,
            credential: cert({...firebaseAdminInitConfig.credential,}),
        });
    } else return apps[0];
};

export default adminSDK;