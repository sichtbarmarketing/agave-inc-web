import { init } from 'next-firebase-auth';
import type { ConfigInput, CustomInitConfig } from "next-firebase-auth";

const TWELVE_DAYS_IN_MS = 12 * 60 * 60 * 24 * 1000

// Module augmentation for custom InitConfig
declare module 'next-firebase-auth' {
    interface CustomInitConfig extends ConfigInput {
        firebaseAdminInitConfig?: {
            credential: {
                projectId: string
                clientEmail: string
                privateKey: string
            }
            databaseURL: string
            storageBucket?: string // storageBucket is now an optional string
        }
    }
}

const getPrivateKey = (): string => {
    // Private ket must not be accessible client-side
    // Using JSON to handle newline problems when storing the key as a secret in Vercel. See:
    // https://github.com/vercel/vercel/issues/749#issuecomment-707515089
    // If in next.js development mode, don't use JSON.parse
    const privateKey = 
        process.env.NODE_ENV === 'development'
            ? process.env.FIREBASE_PRIVATE_KEY
            : JSON.parse(process.env.FIREBASE_PRIVATE_KEY as string)
    if (!privateKey) return '';
    return privateKey;
}

const initConfig: CustomInitConfig = {
    // debug: true,
    authPageURL: '/log-in',
    appPageURL: '/',
    loginAPIEndpoint: '/api/log-in',
    logoutAPIEndpoint: '/api/log-out',
    onLoginRequestError: (err: unknown) => { console.error(err) },
    onLogoutRequestError: (err: unknown) => { console.error(err) },
    firebaseAdminInitConfig: {
        credential: {
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID as string,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL as string,
            
            privateKey: getPrivateKey(),
        },
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL as string,
        storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET as string,
    },
    firebaseClientInitConfig: {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY as string, // required
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
    },
    cookies: {
        name: 'AgaveAuth', // required
        // Keys are required unless you set `signed` to `false`.
        // The keys cannot be accessible on the client side.
        keys: [
            process.env.COOKIE_SECRET_CURRENT,
            process.env.COOKIE_SECRET_PREVIOUS,
        ],
        httpOnly: true,
        maxAge: TWELVE_DAYS_IN_MS,
        overwrite: true,
        path: '/',
        sameSite: 'Strict',
        secure: process.env.NEXT_PUBLIC_COOKIE_SECURE === 'true', // set this to false in local (non-HTTPS) development
        signed: true,
    },
    onVerifyTokenError: (err: unknown) => { console.error(err) },
    onTokenRefreshError: (err: unknown) => { console.error(err) },
}

const initAuth = () => { init(initConfig) }

export default initAuth