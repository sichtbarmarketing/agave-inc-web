import useSWR from "swr";
import axios from "axios";

export const swrOnceOptions = {
    revalidateOnFocus: false,
    revalidateOnMount: true, // https://swr.vercel.app/docs/api
    revalidateOnReconnect: false,
    refreshWhenOffline: false,
    refreshWhenHidden: false,
    refreshInterval: 3600000, // one hour in milliseconds
};