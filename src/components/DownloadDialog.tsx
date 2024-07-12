import { FC, Fragment, useState, useEffect } from "react";
import { useRouter } from 'next/router'
import { Dialog, DialogTitle, DialogContent, Button, CircularProgress } from "@mui/material";
import axios from "axios";

import PauseCircleOutline from "@mui/icons-material/PauseCircleOutline";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { AuthUserContext } from "next-firebase-auth";

type DownloadDialogProps = {
    formId: string | null;
    authUser: AuthUserContext;
    onClose: () => void;
}

const downloadStatus: Record<'inactive' | 'loading' | 'complete' | 'error', { progress: boolean , message: string, component: any }> = {
    inactive: { progress: false, message: 'Loading', component: <PauseCircleOutline color={'primary'} sx={{ fontSize: '3rem' }}/> },
    loading: { progress: false, message: 'Loading...', component: <CircularProgress size={'3rem'}/> },
    complete: { progress: true, message: 'Completed!', component: <CheckCircleOutlineIcon color={'primary'} sx={{ fontSize: '3rem' }}/> },
    error: { progress: false, message: 'Error!', component: <ErrorOutlineIcon color={'primary'} sx={{ fontSize: '3rem' }}/> }
};

const DownloadDialog: FC<DownloadDialogProps> = ({ formId, authUser, onClose }) => {

    const router = useRouter();
    const [status, setStatus] = useState(downloadStatus.inactive);
    const [download, setDownload] = useState<{ formId: null | string, exportId: null | string }>({ formId: null, exportId: null });

    const handleCancel = () => {
        setStatus(downloadStatus.inactive);
        onClose();
    };

    const sleep = (ms: number) => { return new Promise(resolve => setTimeout(resolve, ms)); }

    useEffect(() => {
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();

        if (formId && authUser.id)
            (async () => {
                try {
                    const token = await authUser.getIdToken();
                    let eId, redirect = null;
                    setStatus(downloadStatus.loading);

                    const resIdx = await axios.get('api/history/download', {
                        baseURL: '/', params: { formId: formId }, headers: { Authorization: token }, cancelToken: source.token
                    });

                    const resLoc = resIdx.data?.export;

                    while (!redirect) {
                        await sleep(1000);

                        let resProg = await axios.get('api/history/download/progress', {
                            baseURL: '/', params: { location: resLoc }, headers: { Authorization: token }, cancelToken: source.token
                        });

                        redirect = resProg.data?.redirect;
                        eId = resProg.data?.exportId;
                    }

                    console.table([['REDIRECT LINK', redirect], ['EXPORT ID', eId], ['FORM ID', formId],]); // TODO: remove
                    setDownload({ formId: formId, exportId: eId });
                    setStatus(downloadStatus.complete);

                } catch (e) {
                    console.error(e);
                    setStatus(downloadStatus.error);
                }
            })();

        return () => { source.cancel(); }
    }, [formId, authUser]);

    useEffect(() => {
        if (download.formId && download.exportId)
            void router.push({ pathname: '/history/[formId]', query: { formId: download.formId, exportId: download.exportId } })
    }, [router, download]);

    return(
        <Dialog open={!!(formId)} fullWidth >
            <DialogTitle>{status.message}</DialogTitle>
            <DialogContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {status.component}
            </DialogContent>
            <Button onClick={handleCancel}>Cancel</Button>
        </Dialog>
    );
}

export default DownloadDialog;