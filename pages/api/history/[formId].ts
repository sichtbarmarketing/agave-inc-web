import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import axios, {AxiosError, isAxiosError} from "axios";
import { apiHandler } from "utils/api/apiHandler";
import initAuth from "@firebaseUtils/initAuth";
import initFirebaseAdminSDK from "@firebaseUtils/firebaseAdmin";
import createHttpError from "http-errors";

type Response = { pdfLink: null | string, name: null | string, lastUpdated: null | string, message: string, fields: null | any }
const ENCODED: string = Buffer.from(`${process.env.GOFORMZ_LOGIN}:${process.env.GOFORMZ_PASS}`).toString('base64');
const getDownload = async (formId: string, exportId: string) => {
    try {
        const res = await axios({
            method: "GET",
            url: `https://api.goformz.com/v2/formz/${formId}/exports/${exportId}`,
            headers: {
                'Host': 'api.goformz.com',
                'Connection': 'keep-alive',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Accept-Encoding': 'gzip, deflate, sdch',
                'Authorization': `Basic ${ENCODED}`,
            },
        });
        return res.data["link"];

    } catch (e: any | AxiosError) {

        if (isAxiosError(e)) console.error(e);
        return null;
    }
}

const getFormData = async (formId: string ) => {
    try {
        const res = await axios({
            method: "GET",
            url: `https://api.goformz.com/v2/formz/${formId}`,
            headers: {
                'Host': 'api.goformz.com',
                'Connection': 'keep-alive',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Accept-Encoding': 'gzip, deflate, sdch',
                'Authorization': `Basic ${ENCODED}`,
            },
        });

        return { name: res.data["name"], lastUpdated: res.data["lastUpdateDate"], fields: res.data["fields"] };

    } catch (e: any | AxiosError) {

        if (isAxiosError(e)) console.error(e);
        return { name: null, lastUpdated: null, fields: null };
    }
}

const getForm: NextApiHandler = async (req, res) => {

    const resObj: Response = { pdfLink: null, name: null, lastUpdated: null, fields: null, message: "" };

    initAuth();
    initFirebaseAdminSDK();

    const query = req.query;
    const token = req.headers['authorization'];
    const { formId, exportId } = query;

    if (!token) return res.status(401).json({ ...resObj, message: "GET Form failed; No token!" });
    if (!formId) return res.status(400).json({ ...resObj, message: "GET Form failed. No formId." });

    try {

        if (exportId) resObj.pdfLink = await getDownload(formId as string, exportId as string);

        const formData = await getFormData(formId as string);
        resObj.name = formData.name;
        resObj.lastUpdated = formData.lastUpdated;
        resObj.fields = formData.fields;

        return res.status(200).json({ ...resObj });

    } catch (err: any | AxiosError) {

        if (isAxiosError(err)) {
            console.log(err);
            return res.status(400).json({ ...resObj, message: "Couldn't connect to Go Formz!" });
        }

        // eslint-disable-next-line no-console
        console.error(err);
        throw new createHttpError.InternalServerError((err as Error).message ?? "Unknown internal error occurred!");
    }
}

export default apiHandler({
    GET: getForm,
});