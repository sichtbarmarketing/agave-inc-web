/*
 * [FIXME] I really don't like how the checkboxes are mapped. Maybe rethink that code snippet entirely.
 *
 * [TODO]
 *   - Handle form submit
 *   - review general performance issues
 *   - review 'MuiTelInput' performance as well
 *   - make style changes to checkbox list
 */

import React, {FC, useState} from "react";
import {
    Card, Alert, AlertColor, Collapse, Divider, Chip, FormControlLabel, Checkbox, TextField, FormGroup,
    MenuItem, InputLabel, Select, FormControl, FormHelperText, Button, Grid,
} from '@mui/material';
import { MuiTelInput } from 'mui-tel-input'
import { useFormik } from "formik";
import axios, { AxiosError } from "axios";
import { ProposalSchema } from "utils/api/yup";
import {H3, Small} from "components/Typography";
import BazarTextField from "components/Forms/BazarTextField";
import startCase from "lodash/startCase";
import { InferType } from "yup";

type Proposal = InferType<typeof ProposalSchema>;

const initialValues: Proposal = {
    division: "enhancement",
    requester: { name: "", email: "", phone: "", },
    client: { name: "", email: "", phone: "", address: "", },
    property: { name: "", address: "", contact: "", budget: "", gate_code: "", },
    work_requested: {
        amenities: false,
        clean_up: false,
        drywells: false,
        erosion_repair: false,
        fire_wise_clearing: false,
        grading: false,
        granite_install: false,
        hardscape: false,
        irrigation_repair: false,
        irrigation_retrofit: false,
        other: false,
        shrub_planting: false,
        storm_damage: false,
        tree_planting: false,
        tree_removal: false,
        tree_trim: false,
        trim_plan: false,
        turf_to_granite: false,
    },
    description: "",
    information: [],
};
const ProposalForm: FC = () => {

    // Alert States
    const [alert, setAlert] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState<AlertColor>('error');
    const [alertContent, setAlertContent] = useState('');

    /* TODO: replace with api call */
    const handleFormSubmit = async (values: Proposal) => {
        try {
            console.log(values);

        } catch (e: unknown) {
            setAlert(true);
            setAlertSeverity('error');
            setAlertContent("An unknown error occurred.");

            console.error(e);

            if (e instanceof AxiosError && e.response) {
                setAlertContent(e.response.data.error.message);
            }
        }
    }

    // Initializing variables to use within form, provided by useFormik
    const { values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, } =
        useFormik({
                initialValues, onSubmit: handleFormSubmit, validationSchema: ProposalSchema, // TODO
            }
        );

    return(
        <Card sx={{padding: "2rem 3rem", width: "100%"}}>
            <form onSubmit={handleSubmit}>
                <H3 textAlign="center" mb={1}>New Proposal Request</H3>

                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="division-label">Division</InputLabel>
                    <Select
                        name="division" labelId="division-label" id="division-select" label="Division"
                        value={values.division} onChange={handleChange} onBlur={handleBlur}
                        error={!!touched.division && !!errors.division}
                    >
                        <MenuItem value={"enhancement" as typeof values.division}>Enhancement</MenuItem>
                        <MenuItem value={"tree" as typeof values.division}>Tree</MenuItem>
                        <MenuItem value={"irrigation" as typeof values.division}>Irrigation</MenuItem>
                    </Select>
                    <FormHelperText>{touched.division && errors.division}</FormHelperText>
                </FormControl>

                <TextField sx={{ mb: 2 }} fullWidth multiline size="medium" variant="outlined" rows={5}
                    name="description" label="Description" placeholder="Brief Description"
                    onBlur={handleBlur} value={values.description} onChange={handleChange}
                    error={!!touched.description && !!errors.description} helperText={touched.description && errors.description}
                />

                <FormGroup>
                    <Grid container spacing={3}>
                        {Object.keys(values.work_requested).map((key: string) => (
                                (key in values.work_requested) ?
                                <Grid key={key}>
                                    <FormControlLabel label={startCase(key)}
                                        control={
                                        <Checkbox name={`work_requested.${key}`}
                                                  checked={values.work_requested[key as keyof typeof values.work_requested]}
                                                  value={values.work_requested[key as keyof typeof values.work_requested]}
                                                  onBlur={handleBlur} onChange={handleChange}
                                        />
                                        }
                                    />
                                    {(!!touched.work_requested?.[key as keyof typeof values.work_requested] && !!errors.work_requested?.[key as keyof typeof values.work_requested]) ? (
                                        <FormHelperText error>
                                            {"An error occurred with one of your checkboxes"}
                                        </FormHelperText>
                                    ) : null}
                                </Grid> : null
                        ))}
                    </Grid>
                </FormGroup>

                <Divider sx={{ mt: 2, mb: 1 }} ><Chip label="Requester Information" /></Divider>
                <BazarTextField mb={1.5} fullWidth size="small" variant="outlined"
                    name="requester.name" label="Name" placeholder="Requester Name"
                    onBlur={handleBlur} value={values.requester.name} onChange={handleChange}
                    error={!!touched.requester?.name && !!errors.requester?.name} helperText={touched.requester?.name && errors.requester?.name}
                />
                <BazarTextField mb={1.5} fullWidth size="small" variant="outlined"
                    name="requester.email" type="email"  label="Email" placeholder="example@email.com"
                    onBlur={handleBlur} value={values.requester.email} onChange={handleChange}
                    error={!!touched.requester?.email && !!errors.requester?.email} helperText={touched.requester?.email && errors.requester?.email}
                />
                <InputLabel htmlFor="requester-phone"><Small display="block" textAlign="left" fontWeight="600" color="grey.700">Requester Phone</Small></InputLabel>
                <MuiTelInput disableFormatting sx={{ mb: 2 }} fullWidth size="medium" variant="standard"
                    name="requester.phone" id="requester-phone" placeholder="+1" defaultCountry={'US'} preferredCountries={['US', 'MX']} continents={['NA']}
                    onBlur={handleBlur} value={values.requester.phone} onChange={e => setFieldValue("requester.phone", e)}
                    error={!!touched.requester?.phone && !!errors.requester?.phone} helperText={touched.requester?.phone && errors.requester?.phone}
                />

                <Divider sx={{ mt: 2, mb: 1 }}><Chip label="Client Information" /></Divider>
                <BazarTextField mb={1.5} fullWidth size="small" variant="outlined"
                    name="client.name" label="Client Name" placeholder="Client Name"
                    onBlur={handleBlur} value={values.client.name} onChange={handleChange}
                    error={!!touched.client?.name && !!errors.client?.name} helperText={touched.client?.name && errors.client?.name}
                />
                <BazarTextField mb={1.5} fullWidth size="small" variant="outlined"
                    name="client.email" type="email" label="Client Email" placeholder="example@email.com"
                    onBlur={handleBlur} value={values.client.email} onChange={handleChange}
                    error={!!touched.client?.email && !!errors.client?.email} helperText={touched.client?.email && errors.client?.email}
                />
                <BazarTextField mb={1.5} fullWidth size="small" variant="outlined"
                    name="client.address" label="Client Address" placeholder="1634 N 19th Ave, Phoenix, AZ 85009"
                    onBlur={handleBlur} value={values.client.address} onChange={handleChange}
                    error={!!touched.client?.address && !!errors.client?.address} helperText={touched.client?.address && errors.client?.address}
                />
                <InputLabel htmlFor="client-phone"><Small display="block" textAlign="left" fontWeight="600" color="grey.700">Client Phone</Small></InputLabel>
                <MuiTelInput disableFormatting sx={{ mb: 2 }} fullWidth size="medium" variant="standard"
                    name="client.phone" id="client-phone" placeholder="+1" defaultCountry={'US'} preferredCountries={['US', 'MX']} continents={['NA']}
                    onBlur={handleBlur} value={values.client.phone} onChange={e => setFieldValue("client.phone", e)}
                    error={!!touched.client?.phone && !!errors.client?.phone} helperText={touched.client?.phone && errors.client?.phone}
                />

                <Divider sx={{ mt: 2, mb: 1 }}><Chip label="Property Information" /></Divider>
                <BazarTextField mb={1.5} fullWidth size="small" variant="outlined"
                    name="property.name" label="Name" placeholder="Property Name"
                    onBlur={handleBlur} value={values.property.name} onChange={handleChange}
                    error={!!touched.property?.name && !!errors.property?.name} helperText={touched.property?.name && errors.property?.name}
                />
                <BazarTextField mb={1.5} fullWidth size="small" variant="outlined"
                    name="property.address" label="Property Address" placeholder="1634 N 19th Ave, Phoenix, AZ 85009"
                    onBlur={handleBlur} value={values.property.address} onChange={handleChange}
                    error={!!touched.property?.address && !!errors.property?.address} helperText={touched.property?.address && errors.property?.address}
                />
                <BazarTextField mb={1.5} fullWidth size="small" variant="outlined"
                    name="property.contact" label="On-Site Contact" placeholder="Contact"
                    onBlur={handleBlur} value={values.property.contact} onChange={handleChange}
                    error={!!touched.property?.contact && !!errors.property?.contact} helperText={touched.property?.contact && errors.property?.contact}
                />
                <BazarTextField mb={1.5} fullWidth size="small" variant="outlined"
                    name="property.budget" label="Budget" placeholder="$ 0.00"
                    onBlur={handleBlur} value={values.property.budget} onChange={handleChange}
                    error={!!touched.property?.budget && !!errors.property?.budget} helperText={touched.property?.budget && errors.property?.budget}
                />
                <BazarTextField mb={2} fullWidth size="small" variant="outlined"
                    name="property.gate_code" label="Gate Code" placeholder="#00000"
                    onBlur={handleBlur} value={values.property.gate_code} onChange={handleChange}
                    error={!!touched.property?.gate_code && !!errors.property?.gate_code} helperText={touched.property?.gate_code && errors.property?.gate_code}
                />


                <Button fullWidth type="submit" color="primary" variant="contained" sx={{ mb: "1.65rem", height: 44 }}>
                    Submit Proposal
                </Button>

                <Collapse in={alert}>
                    <Alert onClose={() => setAlert(false)} severity={alertSeverity}>{alertContent}</Alert>
                </Collapse>
            </form>
        </Card>
    );
}

export default ProposalForm;