import {
    DocumentData,
    DocumentReference,
    FirestoreDataConverter,
    QueryDocumentSnapshot, SnapshotOptions,
    PartialWithFieldValue,
    Timestamp
} from "firebase/firestore";

export type Profile = {
    displayName: string,
    admin: boolean,
    properties: string[],
    id: string,
    ref: DocumentReference<DocumentData>,
    lastRead?: {
        [chatId: string]: Timestamp
    }
};

export type NewProfile = Omit<Profile, 'id' | 'ref'>;

const profileConverter: FirestoreDataConverter<Profile> = {
    toFirestore(profile: PartialWithFieldValue<NewProfile>): DocumentData {
        return {
            displayName: profile.displayName,
            admin: profile.admin,
            properties: profile.properties,
            lastRead: profile.lastRead,
        };
    },
    fromFirestore(
        snapshot: QueryDocumentSnapshot,
        options: SnapshotOptions
    ): Profile {
        const data = snapshot.data(options);
        return {
            displayName: data.displayName,
            admin: data.admin,
            properties: data.properties,
            id: snapshot.id,
            ref: snapshot.ref,
            lastRead: data.lastRead,
        };
    },
};

export default profileConverter;