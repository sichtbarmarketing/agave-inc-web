import { FC } from 'react';
import { ImageListItem } from '@mui/material';
import useSWR from "swr";
import axios from "axios";

import { User } from "next-firebase-auth";

import Loading from '@public/assets/images/loading.gif';

type WorkOrderImageProps = {
    imgId: string,
    imageFile: { id: string, link: string },
    user: User
}


const WorkOrderImage: FC<WorkOrderImageProps> = ({ imgId, imageFile, user }) => {

    const url = `api/history/image`;

    const swrOptions = {
        revalidateOnFocus: false,
        revalidateOnMount: true, // https://swr.vercel.app/docs/api
        revalidateOnReconnect: false,
        refreshWhenOffline: false,
        refreshWhenHidden: false,
        refreshInterval: 3600000, // one hour in milliseconds
    }

    const fetcher = useSWR(user.id ? [url, imageFile.id] : null, (async () => {
        const token = await user.getIdToken();
        return await axios.get(url, { baseURL: '/', headers: { Authorization: token }, params: { imgId: imageFile.id } } )
            .then(res => res.data['imgLink'])
            .catch(e => { console.error(e); throw e });
    }), swrOptions);

    const { data, error, isLoading, isValidating } = fetcher;

    return(
        <ImageListItem>
            <img src={data ? data : Loading.src} alt={`Work Order Image ID: ${imgId}`} />
        </ImageListItem>
    );
}

export default WorkOrderImage;