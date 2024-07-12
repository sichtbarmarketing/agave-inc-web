import { FirebaseStorage, StorageReference } from "@firebase/storage";

import { useDownloadURL } from "react-firebase-hooks/storage";
import { ref } from "firebase/storage";

import ImageWithFallback from "components/ImageFallback";

import loadingGif from "@public/assets/images/loading.gif";
import React from "react";

export default function FirebaseImage({ storage, imgURL, alt } : { storage: FirebaseStorage, imgURL: string, alt: string }) {

    const refImage: StorageReference = ref(storage, imgURL);
    const [url, loading, error] = useDownloadURL(refImage);

    if (loading) return <ImageWithFallback src={loadingGif.src} fill imgObjectFit={"cover"} alt={`Loading ${alt}`} />
    if (!url || error) return <ImageWithFallback src={''} alt={'Unable to retrieve image.'} />
    return (
        <ImageWithFallback src={url} fill imgObjectFit={"cover"} alt={alt}/>
    );
}