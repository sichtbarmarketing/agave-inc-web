import { FC } from 'react';
import { MarkerF, CircleF, InfoWindowF, InfoWindowProps } from "@react-google-maps/api";
import { Box, Divider } from '@mui/material';

type LatLngLiteral = google.maps.LatLngLiteral;
type FormPinProps = {
    id?: string, location?: LatLngLiteral, radius?: number,
    open: boolean, handleOpen: (val: string | null) => void,
}

const FormPin: FC<FormPinProps> = ({ id, location, radius = 0, open, handleOpen }) => {

    if (!location || !id) return null;
    const windowToggle = () => { open ? handleOpen(null) : handleOpen(id) }
    const windowClose = () => handleOpen(null);

    return(
        <MarkerF position={location} onClick={windowToggle}
                 options={{
                     icon: {
                         path: google.maps.SymbolPath.CIRCLE,
                         fillOpacity: 1.0, fillColor: '#871A78', scale: 3.0,
                         strokeOpacity: 1.0, strokeColor: '#871A78', strokeWeight: 1.0,
                     }
                 }}
        >
            <PinWindow open={open} position={location} onCloseClick={windowClose} />
            <CircleF center={location} radius={radius} onClick={windowToggle} options={{ strokeWeight: 0, fillColor: '#871A78' }} />
        </MarkerF>
    )
}

const PinWindow: FC<{ open: boolean } & InfoWindowProps> = ({open, position, ...rest}) => {
    // FIXME: keeping position as a separate prop from InfoWindowProps might be useful later? If not, remove it.
    if (!open || !position) return null;

    return(
        <InfoWindowF {...rest}>
            <Box mt={1} mb={2} mx={1} minWidth={'20em'}>
                Work Details
                <Divider/>
            </Box>
        </InfoWindowF>
    );
}

export default FormPin;