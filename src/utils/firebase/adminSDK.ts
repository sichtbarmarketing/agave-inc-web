import { cert, getApps, initializeApp, App } from "firebase-admin/app";

const firebaseAdminInitConfig = {
    credential: {
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID as string,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL as string,
        // Private ket must not be accessible client-side
        // Using JSON to handle newline problems when storing the key as a secret in Vercel. See:
        // https://github.com/vercel/vercel/issues/749#issuecomment-707515089
        privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY : undefined,
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