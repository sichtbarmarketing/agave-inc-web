import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { FirebaseError } from "firebase-admin";
import adminSDK from "@firebaseUtils/adminSDK";
import { getAuth, Auth } from "firebase-admin/auth";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { apiHandler } from "utils/api/apiHandler";
import { PropertySchema } from "utils/api/yup";
import * as yup from "yup";

import { PROPERTIES_COL_, USERS_COL_, ADMIN_FIELD_, PROPERTIES_FIELD_ } from "@firebaseUtils/collections";
import { ValidationError } from "yup";

type Property = yup.InferType<typeof PropertySchema>;
type GetResponse = { property: Property | null; message: string };

const app = adminSDK();
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export function isFirebaseError(error: unknown): error is FirebaseError {
    return (error as FirebaseError).code !== undefined;
}

const isAuthed = async (token: string, auth: Auth, db: Firestore): Promise<{ uid: string, admin: boolean }> => {
    const authObj = { uid: '', admin: false };

    try {
        // Decoding Firebase Id Token
        const decoded = await auth.verifyIdToken(token);
        authObj.uid = decoded.uid;

        // Querying authenticated user in DB & checking for admin rights
        const authDoc = await db.collection(USERS_COL_).doc(authObj.uid).get();
        if (!authDoc.exists) return Promise.reject('Server-Side Authentication Error: User Not Found.');

        authObj.admin = !!(authDoc.get(ADMIN_FIELD_));

    } catch (e: unknown) {
        if (isFirebaseError(e)) return Promise.reject(e.code);
        if (e instanceof Error) return Promise.reject(e.message);
        else return Promise.reject('Unknown Error Occurred During Server-Side Authentication.');
    }

    return Promise.resolve(authObj);
};

const getProperty: NextApiHandler<GetResponse> = async (req: NextApiRequest, res: NextApiResponse) => {
    const resObject: GetResponse = { property: null, message: 'GET PROPERTIES/[propertyId]' };

    const { propertyId } = req.query;
    const token = req.headers['authorization'];

    if (!propertyId) return res.status(400).json({ ...resObject, message: 'GET PROPERTY: NO PROPERTY ID.' });
    if (!token) return res.status(401).json({ ...resObject, message: 'GET PROPERTY: UNAUTHENTICATED.' });

    try {
        const authed = await isAuthed(token, auth, db);

        // FIXME: refactor out
        if (!authed.admin) {
            // Querying authenticated user in DB & checking for properties array
            const authDoc = await db.collection(USERS_COL_).doc(authed.uid).get();
            if (!authDoc.exists) return res.status(400).json({ ...resObject, message: 'GET PROPERTY: USER NOT FOUND.' });

            const propertiesArr = authDoc.get(PROPERTIES_FIELD_);
            const allowed = (propertiesArr instanceof Array && propertiesArr.includes(propertyId as string));

            if (!allowed) return res.status(403).json({ ...resObject, message: 'GET PROPERTY: FORBIDDEN.' });
        }

        const propertyDoc = await db.collection(PROPERTIES_COL_).doc(propertyId as string).get();
        if (!propertyDoc.exists) return res.status(404).json({ ...resObject, message: 'GET PROPERTY: Not Found.' });

        resObject.property = await PropertySchema.validate(
            { ...propertyDoc.data(), id: propertyDoc.id }, { abortEarly: true, strict: true }
        );

    } catch (e: unknown) {
        if (e instanceof ValidationError) return res.status(500).json({ ...resObject, message: e.message })
        if (isFirebaseError(e)) return res.status(400).json({ ...resObject, message: e.code });
        if (e instanceof Error) return res.status(400).json({ ...resObject, message: e.message });
        if (typeof e === 'object' && e && 'message' in e && typeof e.message === 'string')
            return res.status(500).json({ ...resObject, message: e.message });
        else return res.status(500).json({ ...resObject, message: 'GET PROPERTY: UNKNOWN ERROR.' });
    }

    return res.status(200).json(resObject);
}

export default apiHandler({
    GET: getProperty,
});
