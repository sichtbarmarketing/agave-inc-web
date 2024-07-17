import {NextPage} from "next";
import {useRouter} from "next/router";

import useSWR from "swr";
import axios from "axios";
import { AuthAction, useUser, withUser } from "next-firebase-auth";

import Loader from "components/Loader";
import StatusUpdate from "layouts/Templates/StatusUpdate";

type ExampleProps = {}
const StatusUpdatePage: NextPage<ExampleProps> = () => {

    const router = useRouter()
    const { formId, exportId } = router.query
    const url: string = `api/history/${formId}`;

    const AuthUser = useUser(); // according to next-firebase-auth, the user is guaranteed to be authenticated
    const fetcher = useSWR(AuthUser ? url : null, (async () => {
        const token = await AuthUser.getIdToken();
        return await axios.get(url, { baseURL: '/', headers: { Authorization: token }, params: { exportId: exportId } } )
            .then(res => res.data)
            .catch(e => { console.error(e); throw e });
    }));

    const { data, error, isLoading, isValidating } = fetcher;

    if (isLoading || isValidating) return <Loader/>;

    return(
        <>
            <StatusUpdate fields={data.fields}/>
        </>
    )
}

export default withUser<ExampleProps>({
    whenAuthed: AuthAction.RENDER, // Page is rendered, if the user is authenticated
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER, // Shows loader, if the user is not authenticated & the Firebase client JS SDK has not yet initialized.
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN, // Redirect to log-in page, if user is not authenticated
    LoaderComponent: Loader,
})(StatusUpdatePage);