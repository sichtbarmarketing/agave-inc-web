import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import axios, {AxiosError, isAxiosError} from "axios";
import { apiHandler } from "utils/api/apiHandler";
import initAuth from "@firebaseUtils/initAuth";
import initFirebaseAdminSDK from "@firebaseUtils/firebaseAdmin";
import createHttpError from "http-errors";

const ENCODED: string = Buffer.from(`${process.env.GOFORMZ_LOGIN}:${process.env.GOFORMZ_PASS}`).toString('base64');

const createUrl = (formId: string) => {
    return (`https://api.goformz.com/v2/formz/${formId}/exports`);
}

const exportPdf: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {

    initAuth();
    initFirebaseAdminSDK();

    const { formId } = req.query;
    if (!formId) return res.status(400).json({ export: null, message: "Export failed; No form ID." });

    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ export: null, message: "Export failed; No token!" });

    try {
        const exportForm = await axios({
            method: "POST",
            url: createUrl(formId as string),
            headers: {
                'Host': 'api.goformz.com',
                'Connection': 'keep-alive',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Accept-Encoding': 'gzip, deflate, sdch',
                'Authorization': `Basic ${ENCODED}`,
            },
            data: {type: 'pdf'}
        });

        const location = exportForm?.headers['location'];
        return res.status(202).json({ export: location, message: "Export in progress" });

    } catch (err: any | AxiosError) {

        if (isAxiosError(err)) {
            console.log(err);
            return res.status(400).json({ export: null, message: "Couldn't connect to Go Formz!" });
        }

        // eslint-disable-next-line no-console
        console.error(err);
        throw new createHttpError.InternalServerError((err as Error).message ?? "Unknown internal error occurred!");
    }

}

export default apiHandler({
    GET: exportPdf,
});