import { getStorage, ref, getDownloadURL } from "firebase/storage";

// Get a Firebase Storage instance with default app and bucket
const storage = getStorage();

// Get the download URL
export default async function downloadImage(imgPath: string) {
    let result = null, error = null;

    try {
        const imgRef = ref(storage, imgPath)

        console.log('STORAGE: ', storage)
        console.log('IMAGE PATH:', imgPath)
        console.log('REF:', imgRef)

        result = await getDownloadURL(imgRef);

    } catch (e: any) {

        let errorCode = '???';
        let errorName = 'unknown';
        let errorMessage = 'Unknown Error occurred!';

        if (e?.code) errorCode = e.code;
        if (e?.message) errorMessage = e.message;
        if (e.name) errorName = e.name;

        error = { code: errorCode, name: errorName, message: errorMessage, error: e };
    }

    return { result, error }
}