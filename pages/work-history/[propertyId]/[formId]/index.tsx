import { NextPage } from "next";
import { useRouter } from "next/router";
import useSWR from "swr";
import axios from "axios";

import { useWorkOrder, useFormParser } from "hooks/useWorkOrder";
import { useAuthUser, withAuthUser, AuthAction } from 'next-firebase-auth';

import { Chip, Stack, Box, Paper, ImageList, Divider, Button, useTheme, useMediaQuery } from "@mui/material";

import AuthLayout from "layouts/AuthLayout";
import Loader from "components/Loader";
import TitleBar from "components/TitleBar";

import WorkOrderTable from "layouts/Templates/work-order/WorkOrderTable";
import WorkOrderMap from "layouts/Templates/work-order/WorkOrderMap";
import WorkOrderImage from "layouts/Templates/work-order/WorkOrderImage";
import TechnicianNotes from "layouts/Templates/work-order/TechnicianNotes";

import WorkHistoryOutlinedIcon from '@mui/icons-material/WorkHistoryOutlined';
import IosShareOutlinedIcon from '@mui/icons-material/IosShareOutlined';

import SignpostOutlinedIcon from '@mui/icons-material/SignpostOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';

/** FIXME: THIS IS ALL BAD!!! REFACTOR TO CORRECTLY USE SWR LOADING STATE **/

type PropertyFormProps = {}
const PropertyFormPage: NextPage<PropertyFormProps> = () => {

    const router = useRouter();
    const AuthUser = useAuthUser();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const formId = router.query.formId;
    const url: string = `api/history/${formId}`; // FIXME: this fetch DOES NOT request a form PDF

    const fetcher = useSWR(AuthUser ? url : null, (async () => {
        const token = await AuthUser.getIdToken();
        return await axios.get(url, { baseURL: '/', headers: { Authorization: token } } )
            .then(res => res.data)
            .catch(e => { console.error(e); throw e });
    }));

    const { data: formData, error, isLoading, isValidating } = fetcher;

    const { description, locations, images } = useWorkOrder(formData?.fields);
    const { value: crossStreets } = useFormParser<string>('Cross Streets', 'text', formData?.fields);
    const { value: jobNumber } = useFormParser<string>('Job Number', 'text', formData?.fields);
    const { value: completedBy } = useFormParser<string>('Completed by', 'value', formData?.fields);
    const { value: completionDate } = useFormParser<string>('Completion Date', 'value', formData?.fields);

    const { value: materials } = useFormParser<string>('Materials Total', 'value', formData?.fields);
    const { value: labor } = useFormParser<string>('Labor Total', 'value', formData?.fields);
    const { value: total } = useFormParser<string>('Grand Total', 'value', formData?.fields);

    if (!formData) return(<div>Loading!</div>); // TODO: handle loading state within inner components!!!

    return(
        <AuthLayout signedIn={!!(AuthUser.id)} displayName={AuthUser.displayName}>
            <Box m={1} mb={3}>
                <Stack direction='row' flexWrap='wrap' justifyContent='center' sx={{ gap: '1em' }}>
                    <Box flex='1 0' maxWidth={{ xs: '100%', md: 'calc(50% - 1em)' }}>
                        <Stack direction='row' justifyContent='space-between' alignItems='center' px={2}>
                            <TitleBar TitleIcon={WorkHistoryOutlinedIcon} Title={'Work Order'} flexGrow={0}/>
                            <Button color='secondary' variant='outlined' startIcon={<IosShareOutlinedIcon/>}>
                                Share
                            </Button>
                        </Stack>
                        <Divider />
                        <Stack direction='row' flexWrap='wrap' justifyContent='flex-start' p={2} sx={{ gap: '1em' }}>
                            <Chip icon={<SignpostOutlinedIcon />} variant="outlined"
                                  label={crossStreets ?? 'Property'} />
                            <Chip icon={<LocationOnOutlinedIcon />} variant="outlined"
                                  label={`${locations.length} Location${locations.length == 1 ? '' : 's'}`} />
                            <Chip icon={<ImageOutlinedIcon />} variant="outlined"
                                  label={`${images.length} Image${images.length == 1 ? '' : 's'}`} />
                        </Stack>
                        <WorkOrderTable materials={materials} labor={labor} total={total}
                                        technician={completedBy} date={completionDate} jobNum={jobNumber}
                        />
                        <Box m={2} borderRadius='10px' overflow='hidden'>
                            <ImageList cols={isMobile ? 3 : 3} >
                                {images.map(({ id, imageFile }) =>
                                    imageFile && <WorkOrderImage imgId={id} key={id} imageFile={imageFile} user={AuthUser}/>
                                )}
                            </ImageList>
                        </Box>
                    </Box>
                    <WorkOrderMap component={Paper} flex='1 0' position='relative' minWidth={300} minHeight='60vh' locations={locations} m={2}>
                        <Box position='absolute' p={1}>
                            <TechnicianNotes completedBy={completedBy} description={description} variant='outlined' />
                        </Box>
                    </WorkOrderMap>
                </Stack>
            </Box>
        </AuthLayout>
    );
}

export default withAuthUser<PropertyFormProps>({
    whenAuthed: AuthAction.RENDER, // Page is rendered, if the user is authenticated
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER, // Shows loader, if the user is not authenticated & the Firebase client JS SDK has not yet initialized.
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN, // Redirect to log-in page, if user is not authenticated
    LoaderComponent: Loader,
})(PropertyFormPage)