import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import initFirebaseAdminSDK from "@firebaseUtils/firebaseAdmin";
import { getFirestore, DocumentData } from "firebase-admin/firestore";
import { apiHandler } from "utils/api/apiHandler";
import createHttpError from "http-errors";
import {AnnouncementSchema, } from "utils/api/yup";
import * as yup from "yup";

type GetResponse = { announcements: typeof AnnouncementSchema[]; message: string };
type Announcement = yup.InferType<typeof AnnouncementSchema>;
const ANNOUNCEMENTS_COL_: string = 'home_announcements';

const GetAnnouncements: NextApiHandler<GetResponse> = async (req: NextApiRequest, res: NextApiResponse ) => {
    initFirebaseAdminSDK();
    const db = getFirestore();
    let docs: Announcement[] = [];

    try {
        const snapshot = await db.collectionGroup(ANNOUNCEMENTS_COL_).get();
        if (snapshot.empty) res.status(404).json({announcements: null, message: "GET failed no announcements."});

        for (const doc of snapshot.docs) {
            const validate = await AnnouncementSchema.validate({...doc.data(), id: doc.id}, { abortEarly: false, strict: true, });
            docs.push(validate);
        }

    } catch (e: unknown) {
        // eslint-disable-next-line no-console
        console.error(e);

        let message = 'Unknown internal error occurred!';
        if (e instanceof Error) message = e.message;

        throw new createHttpError.InternalServerError(message);
    }

    res.status(200).json({announcements: docs, message: "GET announcements success."});
}

export default apiHandler({
    GET: GetAnnouncements,

})