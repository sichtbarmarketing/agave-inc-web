import { useMemo } from 'react';
import { useFormParser } from "./useWorkOrder";
import { format } from "date-fns";

import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import NumbersOutlinedIcon from "@mui/icons-material/NumbersOutlined";
import GrassOutlinedIcon from "@mui/icons-material/GrassOutlined";
import DeckOutlinedIcon from "@mui/icons-material/DeckOutlined";
import WaterOutlinedIcon from "@mui/icons-material/Water";
import LocalFloristOutlinedIcon from "@mui/icons-material/LocalFloristOutlined";
import ParkOutlinedIcon from "@mui/icons-material/ParkOutlined";
import NoteAltOutlinedIcon from "@mui/icons-material/NoteAltOutlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";

export type WeeklyReportDetails = {
    image: {
        "id": string, "name": string, "type": string,
        "imageFile": { "id": string, "link": string } | null,
    };
    text: { "id": string, "name": string, "type": string, "text": string }
}

export const useWeeklyReportDetails = (textId: string, imgId: string, formFields?: any): WeeklyReportDetails => {

    const image = useMemo(() => {
        if (!(formFields)) return null;
        return (formFields?.[imgId]?.imageFile) ? (formFields[imgId]) : null;
    }, [formFields, imgId]);

    const text = useMemo(() => {
        if (!(formFields)) return null;
        return (formFields?.[textId]?.text) ? (formFields[textId]) : null;
    }, [formFields, textId]);

    return { text, image };
};

/* FIXME: Just so bad. */
export const useWeeklyReport = (formFields?: any) => {

    const { value: jobName } = useFormParser<string | null>("Job Name", "value", formFields);
    const { value: manager } = useFormParser<string | null>("Manager", "text", formFields);
    const { value: date } = useFormParser<string | null>("Date 4", "value", formFields);

    const { value: turf } = useFormParser<string | null>("Text 5", "text", formFields);
    const { value: genGrounds } = useFormParser<string | null>("Text 6", "text", formFields);
    const { value: irrigation } = useFormParser<string | null>("Text 7", "text", formFields);
    const { value: plants } = useFormParser<string | null>("Text 8", "text", formFields);
    const { value: trees } = useFormParser<string | null>("Text 9", "text", formFields);
    const { value: notes } = useFormParser<string | null>("Text 11", "text", formFields);
    const { value: actions } = useFormParser<string | null>("Text 12", "text", formFields);

    // Weekly Report Details
    const detail0 = useWeeklyReportDetails("Text 22", "Image 14", formFields);
    const detail1 = useWeeklyReportDetails("Text 23", "Image 15", formFields);
    const detail2 = useWeeklyReportDetails("Text 24", "Image 16", formFields);
    const detail3 = useWeeklyReportDetails("Text 25", "Image 17", formFields);
    const detail4 = useWeeklyReportDetails("Text 26", "Image 18", formFields);
    const detail5 = useWeeklyReportDetails("Text 27", "Image 19", formFields);
    const detail6 = useWeeklyReportDetails("Text 28", "Image 20", formFields);
    const detail7 = useWeeklyReportDetails("Text 29", "Image 21", formFields);

    return {
        info: [
            { key: 'manager', label: 'Manager', value: manager, icon: BadgeOutlinedIcon },
            { key: 'date', label: 'Date', value: date ? format(new Date(date), 'MM/dd/yyyy') : null, icon: EventAvailableOutlinedIcon },
            { key: 'jobId', label: 'Job Name', value: jobName, icon: NumbersOutlinedIcon },
        ],
        report: [
            { key: 'turf', label: 'Turf', value: turf, icon: GrassOutlinedIcon },
            { key: 'genGrounds', label: 'General Grounds', value: genGrounds, icon: DeckOutlinedIcon },
            { key: 'irrigation', label: 'Irrigation', value: irrigation, icon: WaterOutlinedIcon },
            { key: 'plants', label: 'Plants', value: plants, icon: LocalFloristOutlinedIcon },
            { key: 'trees', label: 'Trees', value: trees, icon: ParkOutlinedIcon },
            { key: 'notes', label: 'Notes', value: notes, icon: NoteAltOutlinedIcon },
            { key: 'actions', label: 'Actions', value: actions, icon: PendingActionsOutlinedIcon },
        ],
        details: [detail0, detail1, detail2, detail3, detail4, detail5, detail6, detail7]
    };
}