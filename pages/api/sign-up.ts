import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import initFirebaseAdminSDK from "@firebaseUtils/firebaseAdmin";
import { getAuth } from "firebase-admin/auth";
import { apiHandler } from "utils/api/apiHandler";
import { postUserSchema } from "utils/api/yup";
import createHttpError from "http-errors";
import { FirebaseError } from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

const USERS_COL_: string = 'users';

type PostResponse = { uid: string; message: string; };
interface postUserRequest extends NextApiRequest {
    // use typeOf to infer the properties from postUserSchema
    body: { values : typeof postUserSchema };
}

const signUpHandler: NextApiHandler<PostResponse> = async (req: postUserRequest, res: NextApiResponse) => {

    // Initializing Firebase Admin SDK
    initFirebaseAdminSDK();
    const db = getFirestore();

    try {
        // Validating request values
        const validate = await postUserSchema.validate(req.body.values, { abortEarly: false, strict: true, });

        // Create a user in the Auth database
        const userRecord = await getAuth().createUser({
            email: validate.email,
            emailVerified: false,
            password: validate.password,
            displayName: validate.displayName,
            disabled: false,
        });

        // eslint-disable-next-line no-console
        console.log('Successfully created new user:', userRecord.uid);

        // Set a new user document(userRecord.id) with default settings
        await db.collection(USERS_COL_).doc(userRecord.uid).set({
            displayName: userRecord.displayName,
            admin: false,
            properties: [],
        });

        const customToken = await getAuth().createCustomToken(userRecord.uid);
        return res.status(200).json({uid: customToken, message: 'POST User success!'});
    } catch (e: unknown) {
        // TODO: API resolved without sending a response for /api/sign-up, this may result in stalled requests.
        // if FirebaseError, return 400 response
        if ((e as FirebaseError).toJSON) return res.status(400).json({ error: (e as FirebaseError).toJSON() });

        // eslint-disable-next-line no-console
        console.error(e);
        throw new createHttpError.InternalServerError((e as Error).message ?? "Unknown internal error occurred!");
    }
}

export default apiHandler({
    POST: signUpHandler,
});