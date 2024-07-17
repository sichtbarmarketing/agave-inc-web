import { cert, getApps, initializeApp, App } from "firebase-admin/app";

const getPrivateKey = (): string => {
    // Private ket must not be accessible client-side
    // Using JSON to handle newline problems when storing the key as a secret in Vercel. See:
    // https://github.com/vercel/vercel/issues/749#issuecomment-707515089
    // If in next.js development mode, don't use JSON.parse
    const privateKey = 
        process.env.NODE_ENV === 'development'
            ? process.env.FIREBASE_PRIVATE_KEY
            : JSON.parse(process.env.FIREBASE_PRIVATE_KEY as string)
    if (!privateKey) throw new Error('No private key found in environment variables')
    return privateKey;
}

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