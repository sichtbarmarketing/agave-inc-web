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

const getUsersHandler: NextApiHandler = async (req, res) => {

    let users: User[] = [];

    // Initializing Firebase Admin SDK
    initAuth();
    initFirebaseAdminSDK();
    const db = getFirestore();

    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ users: null, message: "GET Users failed; No token!" });

    try {
        // Verifying ID Token
        const authUser = await verifyIdToken(token);
        if (!authUser.id) return res.status(401).json({ users: null, message: "GET Users failed. Unauthorized!" })

        // Querying authenticated user in DB & checking for admin rights
        const authDoc = await db.collection(USERS_COL_).doc(authUser.id).get();
        if (!authDoc.exists) return res.status(500).json({ users: null, message: "GET Users failed. User not found!" })
        if (!authDoc.get(ADMIN_FIELD_)) return res.status(401).json({ users: null, message: "GET Users failed. Not an admin." })

        // Query the user list
        //const adminSnapshot = await db.collection(USERS_COL_).where(ADMIN_FIELD_, "==", true).get();
        const userSnapshot = await db.collection(USERS_COL_).orderBy(ADMIN_FIELD_, "desc").get();

        userSnapshot.forEach((doc) => {
            users.push( { id: doc.id, displayName: doc.get("displayName"), admin: doc.get('admin'), properties: doc.get('properties') } )
        });

        return res.status(200).json({ users: users, message: "GET Users" })

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
    GET: getUsersHandler,
});