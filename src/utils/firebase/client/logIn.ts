import firebaseClient from "@firebaseUtils/firebaseClient";
import { signInWithEmailAndPassword, getAuth, } from "firebase/auth";
import { FirebaseError } from "@firebase/util";

const auth = getAuth(firebaseClient);

export default async function clientLogIn(email: string, password: string) {
    let result = null, error = null;

    try {
        result = await signInWithEmailAndPassword(auth, email, password);
    } catch (e: unknown) {

        let errorCode = '???';
        let errorName = 'unknown';
        let errorMessage = 'Unknown Error occurred!';

        if (e instanceof Error) {
            errorName = e.name; errorMessage = e.message
        }

        if (e instanceof FirebaseError) {
            errorCode = e.code; errorName = e.name; errorMessage = e.message
        }

        error = { code: errorCode, name: errorName, message: errorMessage, error: e };
    }

    return { result, error };
}
