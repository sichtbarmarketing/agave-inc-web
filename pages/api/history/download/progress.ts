import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import axios, {AxiosError, isAxiosError} from "axios";
import { apiHandler } from "utils/api/apiHandler";
import initAuth from "@firebaseUtils/initAuth";
import initFirebaseAdminSDK from "@firebaseUtils/firebaseAdmin";
import createHttpError from "http-errors";

const ENCODED: string = Buffer.from(`${process.env.GOFORMZ_LOGIN}:${process.env.GOFORMZ_PASS}`).toString('base64');

const getProgress: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {

    initAuth();
    initFirebaseAdminSDK();

    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ exportId: null, redirect: null, message: "Download failed; No token!" });

    const { location } = req.query;
    if (!location) return res.status(400).json({ exportId: null, redirect: null, message: "Download failed; No location!" });

    try {
        const checkProgress = await axios({
            method: "GET",
            url: location as string,
            headers: {
                'Host': 'api.goformz.com',
                'Connection': 'keep-alive',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Accept-Encoding': 'gzip, deflate, sdch',
                'Authorization': `Basic ${ENCODED}`,
            }
        });

        const redir = checkProgress.data.redirectUrl;
        const eId = checkProgress.data.resourceId;
        const prog = checkProgress.data.progressIndicator;

        return res.status(202).json({ exportId: eId, redirect: redir, message: `Export progress: ${prog}`});

    } catch (err: any | AxiosError) {

        if (isAxiosError(err)) {
            console.log(err);
            return res.status(400).json({ exportId: null, redirect: null, message: "Couldn't connect to Go Formz!" });
        }

        // eslint-disable-next-line no-console
        console.error(err);
        throw new createHttpError.InternalServerError((err as Error).message ?? "Unknown internal error occurred!");
    }
}

export default apiHandler({
    GET: getProgress,
});