import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import axios, {AxiosError, isAxiosError} from "axios";
import { apiHandler } from "utils/api/apiHandler";
import initAuth from "@firebaseUtils/initAuth";
import initFirebaseAdminSDK from "@firebaseUtils/firebaseAdmin";
import createHttpError from "http-errors";
import {verifyIdToken} from "next-firebase-auth";

const ENCODED: string = Buffer.from(`${process.env.GOFORMZ_LOGIN}:${process.env.GOFORMZ_PASS}`).toString('base64');
const DATASOURCE_ID = '52bde75c-2a41-4877-87b7-9622409d7e3c';

const config = (sourceId: string) => {
    return {
        url: `https://api.goformz.com/v2/datasources/${sourceId}/rows`,
        method: 'GET',
        headers: {
            'Host': 'api.goformz.com',
            'Connection': 'keep-alive',
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, sdch',
            'Authorization': `Basic ${ENCODED}`,
        },
        params: { pageSize: 100, },
    }
};

const getProperties: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {

    initAuth();
    initFirebaseAdminSDK();

    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ properties: null, message: "GET Properties failed; No token!" });

    try {
        // Verifying ID Token
        const authUser = await verifyIdToken(token);
        if (!authUser.id) return res.status(401).json({ properties: null, message: "GET Properties failed. Unauthorized!" })

        // Fetching Properties Data source from GoFormz
        const getProperties = await axios(config(DATASOURCE_ID));
        return res.status(200).json({ properties: getProperties.data, message: "GET Properties success." });

    } catch (err: any | AxiosError) {

        if (isAxiosError(err)) {
            console.log(err);
            return res.status(400).json({ properties: null, message: "Couldn't connect to Go Formz!" });
        }

        // eslint-disable-next-line no-console
        console.error(err);
        throw new createHttpError.InternalServerError((err as Error).message ?? "Unknown internal error occurred!");
    }
};

export default apiHandler({
    GET: getProperties,
});