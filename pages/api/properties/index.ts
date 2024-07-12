import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { apiHandler } from "utils/api/apiHandler";
import initAuth from "@firebaseUtils/initAuth";
import createHttpError from "http-errors";
import { verifyIdToken } from "next-firebase-auth";
import { getFirestore, Firestore, QuerySnapshot, FieldPath } from "firebase-admin/firestore";
import { AxiosError, isAxiosError } from "axios";
import { PropertySchema } from "utils/api/yup";
import * as yup from "yup";

type Property = yup.InferType<typeof PropertySchema>;
type GetResponse = { properties: Property[]; message: string };

const USERS_COL_: string = 'users';
const PROPERTIES_COL_: string = 'properties';
const ADMIN_FIELD_: string = 'admin';
const PROPERTIES_FIELD_: string = 'properties';

/*
 * GET PROPERTIES: Returns a list of all properties if admin, else all properties for the given user
 */
const getProperties: NextApiHandler<GetResponse> = async (req: NextApiRequest, res: NextApiResponse) => {

    initAuth();
    const db = getFirestore();
    let properties: Property[] = [];

    let adminStatus = false;
    let userProperties: string[] = []

    const token = req.headers['authorization'];

    if (!token)
        return res.status(401).json({ properties: properties, message: "GET Properties failed; No token!" });

    try {
        // Verifying ID Token
        const authUser = await verifyIdToken(token);

        if (!authUser.id)
            return res.status(401).json({ properties: properties, message: "GET Properties failed; Unauthorized!" })

        // Querying authenticated user in DB
        const authDoc = await db.collection(USERS_COL_).doc(authUser.id).get();

        if (!authDoc.exists)
            return res.status(500).json({ properties: properties, message: "GET Properties failed. User not found!" })

        //  Checking for admin rights
        if (authDoc.get(ADMIN_FIELD_)) adminStatus = true;
        userProperties = authDoc.get(PROPERTIES_FIELD_) as string[];

        properties = await iteratePropertiesCol(db, adminStatus, userProperties);

        return res.status(200).json({ properties: properties, message: `GET Properties success [${adminStatus}]` })

    } catch (err: any | AxiosError) {

        if (isAxiosError(err)) {
            console.log(err);
            return res.status(400).json({ properties: properties, message: "Couldn't connect to Firebase!" });
        }

        // eslint-disable-next-line no-console
        console.error(err);
        throw new createHttpError.InternalServerError((err as Error).message ?? "Unknown internal error occurred!");

    }

}

export default apiHandler({
    GET: getProperties,
});

const iteratePropertiesCol = async (db: Firestore, admin: boolean, userProperties: string[] ) => {

    let properties: Property[] = []
    let snapshot: null | QuerySnapshot = null;

    try {
        const propertiesRef = db.collection(PROPERTIES_COL_);

        if (admin) snapshot = await propertiesRef.get();
        else snapshot = await propertiesRef.where(FieldPath.documentId(), 'in', userProperties).get(); // TODO: test

        if (snapshot.empty) return properties;

        for (const doc of snapshot.docs) {
            const valid = await PropertySchema.isValid(
                { ...doc.data(), id: doc.id }, { abortEarly: false, strict: true, }
            );

            if (valid) properties.push(await PropertySchema.validate(
                { ...doc.data(), id: doc.id }, { abortEarly: true, strict: true }
            ));
        }

        return properties;
    } catch (e) {

        console.error(e);
        return properties;
    }
}