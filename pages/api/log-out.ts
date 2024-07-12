// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { unsetAuthCookies } from 'next-firebase-auth'
import initAuth from '@firebaseUtils/initAuth'

initAuth()

const logOutHandler = async (req: NextApiRequest, res: NextApiResponse) => {

    const duration: number = 7000;
    const id = setTimeout(() => res.json({message: "Request Timeout"}), duration);

    try {
        await unsetAuthCookies(req, res);
        clearTimeout(id);
        return res.status(200).json({ status: true });
    } catch (e: any) {
        // eslint-disable-next-line no-console
        console.error(e);
        return res.status(500).json({ error: e.message });
    }
}

export default logOutHandler