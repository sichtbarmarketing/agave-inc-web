import * as yup from "yup";

export const postUserSchema = yup.object().shape({
    displayName: yup.string().required("name is required"),
    email: yup.string().email("invalid email").required("email is required"),
    password: yup.string().required("password is required"),
    re_password: yup
        .string()
        .oneOf([yup.ref("password"),], "passwords must match")
        .required("please re-type password"),
});

export const AnnouncementSchema = yup.object().shape({
    id: yup.string().required("announcement object id is required"),
    author: yup.object({name: yup.string().required(), uid: yup.string().required()}).required("author is required"),
    created: yup.object({_seconds: yup.number().required(), _nanoseconds: yup.number().required()}).required("timestamp is required"),
    title: yup.string().required("title is required")
        .max(50, ({ max }) => `Character limit exceeded! Max ${max} characters allowed!`),
    description: yup.string().required("description is required")
        .max(500, ({ max }) => `Character limit exceeded! Max ${max} characters allowed!`),
});

export const FolderSchema = yup.object({
    id: yup.string(),
    name: yup.string().required("folder name is required"),
    owner: yup.object().required("folder owner is required"),
    viewers: yup.array().of(yup.object()).required("viewers list is required"),
});

export const ProposalSchema = yup.object({
    division: yup.string().oneOf(["enhancement", "tree", "irrigation"]).required("division is required"),
    requester: yup.object().shape({
        name: yup.string().required("requester name is required"),
        email: yup.string().email("invalid requester email"),
        phone: yup.string(),
    }).required("requester is required"),
    client: yup.object().shape({
        name: yup.string().required("client name is required"),
        email: yup.string().email("invalid client email"),
        phone: yup.string(),
        address: yup.string(),
    }).required("client is required"),
    property: yup.object().shape({
        name: yup.string().required("property name is required"),
        address: yup.string().required("property address is required"),
        contact: yup.string(),
        budget: yup.string(),
        gate_code: yup.string()
    }).required("property is required"),
    work_requested: yup.object().shape({
        amenities: yup.boolean(),
        clean_up: yup.boolean(),
        drywells: yup.boolean(),
        erosion_repair: yup.boolean(),
        fire_wise_clearing: yup.boolean(),
        grading: yup.boolean(),
        granite_install: yup.boolean(),
        hardscape: yup.boolean(),
        irrigation_repair: yup.boolean(),
        irrigation_retrofit: yup.boolean(),
        other: yup.boolean(),
        shrub_planting: yup.boolean(),
        storm_damage: yup.boolean(),
        tree_planting: yup.boolean(),
        tree_removal: yup.boolean(),
        tree_trim: yup.boolean(),
        trim_plan: yup.boolean(),
        turf_to_granite: yup.boolean()
    }).required("work requested is required"),
    description: yup.string(),
    information: yup.array().of(
        yup.object().shape({
            description: yup.string(),
            image: yup.string(),
            location: yup.object().shape({ latitude: yup.number().required("latitude required"), longitude: yup.number().required("longitude required")})
        })
    )
});

export const PropertySchema = yup.object({
    id: yup.string().required('ID required. MUST match GoFormz key.'),
    name: yup.string().required('Name required.'),
    address: yup.string().required('Address Line 1 required.'),
    jobNumber: yup.string().required('Job Number required.'),
    manager: yup.object().shape({
        name: yup.string().required("Name is required."),
        email: yup.string().email("invalid Email."),
    }).required('Manager details are required.'),
    phone: yup.number(),
    accountMgr: yup.object().shape({
        name: yup.string().required("Account Manager Name is required."),
        phone: yup.number(),
        email: yup.string().email("invalid Email."),
        image: yup.string().defined().strict(true),
    }),
    displayImage: yup.string().defined().strict(true),
});

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    postUserSchema,
    AnnouncementSchema,
    FolderSchema,
    ProposalSchema,
    PropertySchema,
}