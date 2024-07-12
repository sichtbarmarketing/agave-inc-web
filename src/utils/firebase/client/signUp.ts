import firebaseClient from "@firebaseUtils/firebaseClient";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";

const auth = getAuth(firebaseClient);

export default async function signUp(email: string, password: string) {
    let result = null, error = null;

    try {
        result = await createUserWithEmailAndPassword(auth, email, password);
    } catch (e) {
        error = e;
    }

    return { result, error };
}