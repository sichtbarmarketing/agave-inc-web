import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import axios, {AxiosError, isAxiosError} from "axios";
import { apiHandler } from "utils/api/apiHandler";
import initAuth from "@firebaseUtils/initAuth";
import initFirebaseAdminSDK from "@firebaseUtils/firebaseAdmin";
import createHttpError from "http-errors";

type Response = { imgLink: null | string, id: null | string, expires: null | string }
const ENCODED: string = Buffer.from(`${process.env.GOFORMZ_LOGIN}:${process.env.GOFORMZ_PASS}`).toString('base64');

const getImage: NextApiHandler = async (req, res) => {

    const resObj: Response = { imgLink: null, id: null, expires: null };

    initAuth(); // FIXME: these both being called might cause problems
    initFirebaseAdminSDK(); // FIXME: these both being called might cause problems

    const query = req.query;
    const token = req.headers['authorization'];
    const { imgId } = query;

    if (!token) return res.status(401).json({ ...resObj, message: "GET Image failed; No token!" });
    if (!imgId) return res.status(400).json({ ...resObj, message: "GET Image failed. No imgId." });

    try {

        const fileData = await getImageData(imgId as string);
        resObj.id = fileData.id;
        resObj.imgLink = fileData.imgLink;
        resObj.expires = fileData.expires;

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
    GET: getImage,
});

const getImageData = async (imgId: string) => {

    try {
        const res = await axios({
            method: "GET",
            url: `https://api.goformz.com/v2/files/${imgId}`,
            headers: {
                'Host': 'api.goformz.com',
                'Connection': 'keep-alive',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Accept-Encoding': 'gzip, deflate, sdch',
                'Authorization': `Basic ${ENCODED}`,
            },
        });

        return { id: res.data["id"], imgLink: res.data["link"], expires: res.data["linkExpiration"] };

    } catch (e: any | AxiosError) {
        if (isAxiosError(e)) console.error(e);
        return { id: null, imgLink: null, expires: null };
    }

}