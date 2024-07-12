import { useMemo } from 'react';

export type WorkOrderData = {
    description: string | null,
    locations: {
        "id": string, "name": string, "type": string,
        "mapImage"?: { "id": string, "link"?: string | null } | null,
        "location"?: { "latitude": number, "longitude": number, "accuracy"?: number | null } | null
    }[],
    images: {
        "id": string, "name": string, "type": string,
        "imageFile"?: { "id": string, "link": string } | null,
        imgLink: string | null, expires: string | null // TODO: these are new properties
    }[]
}

export const useWorkOrder = (formFields?: any): WorkOrderData => {

    const description = useMemo(() => {
        if (!(formFields)) return null;
        return (formFields["Description"]?.text) ? (formFields?.["Description"]?.text) : null;
    }, [formFields]);

    const locations = useMemo(() => {
        if (!(formFields)) return []

        return Object.entries(formFields)
            .filter((i: Record<string, any>) => (i[0].includes('Location')))
            .map((i: Record<string, any>) => ({
                id: i[1]['id'] as string,
                name: i[1]['name'] as string,
                type: i[1]['type'] as string,
                mapImage: {...i[1]['mapImage']},
                location: {...i[1]['location']},
            }))
            .filter(({location}) => location["latitude"] && location["longitude"]); // filters non-empty location

    }, [formFields]);

    const images = useMemo(() => {
        if (!(formFields)) return [];

        return Object.entries(formFields)
            .filter((i: Record<string, any>) => (i[0].includes('Image')))
            .map((i: Record<string, any>) => ({
                id: i[1]['id'] as string,
                name: i[1]['name'] as string,
                type: i[1]['type'] as string,
                imageFile: {...i[1]['imageFile']},
                imgLink: null, expires: null // set new properties
            }))
            .filter(({imageFile}) => imageFile['id']); // filters non-empty imageFile

    }, [formFields]);


    return { description, locations, images };
}

export const useFormParser = <T>(field: string, parse: 'text' | 'value' | string, formFields?: any): { value: T | null } => {
    const value: T | null = useMemo(() => {
        if (!(formFields)) return null;
        return (formFields?.[field]?.[parse]) ? (formFields[field][parse]) : null;
    }, [field, parse, formFields]);

    return { value };
}