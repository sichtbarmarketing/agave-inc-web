import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import initFirebaseAdminSDK from "@firebaseUtils/firebaseAdmin";
import { getAuth } from "firebase-admin/auth";
import { apiHandler } from "utils/api/apiHandler";
import { getFirestore } from "firebase-admin/firestore";
import { verifyIdToken } from "next-firebase-auth";
import { AxiosError, isAxiosError } from "axios";
import createHttpError from "http-errors";
import initAuth from "@firebaseUtils/initAuth";

type User = { id: string, displayName: string, admin: boolean, properties: any[] }
const USERS_COL_: string = 'users';
const ADMIN_FIELD_: string = 'admin';

const putUserHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {

    // Initializing Firebase Admin SDK
    initAuth();
    initFirebaseAdminSDK();
    const db = getFirestore();

    const token = req.headers['authorization'];
    const query = req.query;
    const body = req.body;
    const { uid } = query;
    const { properties } = body;

    if (!token) return res.status(401).json({ user: null, message: "PUT User failed; No token!" });
    if (!uid) return res.status(400).json({ user: null, message: "PUT User failed. No uid." });
    if (!properties) return res.status(400).json({ user: null, message: "PUT User failed. No properties." });

    try {
        // Verifying ID Token
        const authUser = await verifyIdToken(token);
        if (!authUser.id) return res.status(401).json({ user: null, message: "PUT User failed. Unauthorized!" })

        // Querying authenticated user in DB & checking for admin rights
        const authDoc = await db.collection(USERS_COL_).doc(authUser.id).get();
        if (!authDoc.exists) return res.status(500).json({ user: null, message: "PUT User failed. User could not be authenticated!" })
        if (!authDoc.get(ADMIN_FIELD_)) return res.status(401).json({ user: null, message: "PUT User failed. Not an admin." })

        // Update a user (uid) with new properties array
        const userDoc = await db.collection(USERS_COL_).doc(uid as string).get();
        if (!userDoc.exists) return res.status(400).json({ user: null, message: "PUT User failed. Provided UID not found!" })
        await db.collection(USERS_COL_).doc(uid as string).update({
            properties: properties as string[]
        });

        return res.status(200).json({ user: true, message: "PUT User success!" });

    } catch (err: any | AxiosError) {

        if (isAxiosError(err)) {
            console.log(err);
            return res.status(400).json({ users: null, message: "There was an error processing your request." });
        }

        // eslint-disable-next-line no-console
        console.error(err);
        throw new createHttpError.InternalServerError((err as Error).message ?? "Unknown internal error occurred!");

    }
}

export default apiHandler({
    PUT: putUserHandler,
})