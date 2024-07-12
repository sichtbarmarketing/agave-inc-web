/*
 *
 * WIP file used to get admin app for API calls
 * source: https://github.com/gladly-team/next-firebase-auth/blob/v1.x/src/initFirebaseAdminSDK.js
 *
 */

import {
    cert,
    getApps,
    initializeApp,
} from 'firebase-admin/app'

const firebaseAdminInitConfig = {
    credential: {
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID as string,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL as string,
        // Private ket must not be accessible client-side
        // Using JSON to handle newline problems when storing the key as a secret in Vercel. See:
        // https://github.com/vercel/vercel/issues/749#issuecomment-707515089
        privateKey: process.env.FIREBASE_PRIVATE_KEY ? JSON.parse(process.env.FIREBASE_PRIVATE_KEY) : undefined,
    },
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL as string,
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET as string,
}

const initFirebaseAdminSDK = () => {
    const apps = getApps();
    if (!apps.length) {
        initializeApp({
            ...firebaseAdminInitConfig,
            credential: cert({...firebaseAdminInitConfig.credential,}),
        })
        console.warn('[firebaseAdmin.ts] Initialized the Firebase admin SDK.')
    }
}

export default initFirebaseAdminSDK