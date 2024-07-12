import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import axios, {AxiosError, isAxiosError} from "axios";
import { apiHandler } from "utils/api/apiHandler";
import initAuth from "@firebaseUtils/initAuth";
import initFirebaseAdminSDK from "@firebaseUtils/firebaseAdmin";
import createHttpError from "http-errors";
import { verifyIdToken } from "next-firebase-auth";
import { getFirestore } from "firebase-admin/firestore";

type User = { id: string, displayName: string, admin: boolean, properties: any[] }
const USERS_COL_: string = 'users';
const ADMIN_FIELD_: string = 'admin';
const PROPERTIES_F: string = 'properties';

const ENCODED: string = Buffer.from(`${process.env.GOFORMZ_LOGIN}:${process.env.GOFORMZ_PASS}`).toString('base64');

const config = (templateId: string, nameParam?: string, filter?: string) => {

    let params: { status: string, name?: string, filter?: string } = { status: 'complete' };
    if (nameParam) params = { ...params, name: nameParam };
    if (filter) params = { ...params, filter: filter };

    return {
        url: `https://api.goformz.com/v2/templates/${templateId}/formz`,
        method: 'GET',
        headers: {
            'Host': 'api.goformz.com',
            'Connection': 'keep-alive',
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, sdch',
            'Authorization': `Basic ${ENCODED}`,
        },
        params: { ...params },
    }
};

const getForms: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {

    initAuth();
    initFirebaseAdminSDK();
    const db = getFirestore();

    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ forms: null, message: "GET forms failed; No token!" });

    const { templateId, propertyName, filter } = req.query;
    if (!templateId) return res.status(400).json({ forms: null, message: "GET forms failed; No templateId!" });

    try {
        // Verifying ID Token
        const authUser = await verifyIdToken(token);
        if (!authUser.id) return res.status(401).json({ forms: null, message: "GET forms failed. Unauthorized!" })

        // Querying authenticated user in DB & checking for admin rights
        const authDoc = await db.collection(USERS_COL_).doc(authUser.id).get();
        if (!authDoc.exists) return res.status(500).json({ forms: null, message: "GET forms failed. User not found!" })

        // // Query GoFormz without filtering by Property name
        // if (authDoc.get(ADMIN_FIELD_)) {
        //     const getForms = await axios(config(templateId as string));
        //     return res.status(200).json({ forms: getForms.data, message: "GET forms success. (Admin)" })
        // }
        //
        // let clientForms: any[] = [];
        // let getClientForms;
        //
        // for (let pName of authDoc.get(PROPERTIES_F) as string[]) {
        //     getClientForms = await axios(config(templateId as string, pName));
        //     clientForms = clientForms.concat(getClientForms.data);
        // }

        const getForms = await axios(config
            (templateId as string, propertyName as string ?? undefined, filter as string ?? undefined)
        );

        return res.status(200).json({ forms: getForms.data, message: "GET forms success. (Client)" });


    } catch (err: any | AxiosError) {

        if (isAxiosError(err)) {
            console.log(err);
            return res.status(400).json({ forms: null, message: "Couldn't connect to Go Formz!" });
        }

        // eslint-disable-next-line no-console
        console.error(err);
        throw new createHttpError.InternalServerError((err as Error).message ?? "Unknown internal error occurred!");
    }
};

export default apiHandler({
    GET: getForms,
});