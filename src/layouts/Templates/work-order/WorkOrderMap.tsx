import { FC, useState, useMemo, useRef, useCallback, ReactNode } from 'react';
import { useLoadScript, GoogleMap, MarkerF, CircleF, InfoWindowF } from "@react-google-maps/api";
import { Stack, Box, BoxProps, Skeleton } from '@mui/material';
import type { WorkOrderData } from "hooks/useWorkOrder";

import FormPin from "components/FormPin";

type LatLngLiteral = google.maps.LatLngLiteral;
type MapOptions = google.maps.MapOptions;
type MapBounds = google.maps.LatLngBounds;
type Map = google.maps.Map;

interface WorkOrderProps extends BoxProps {
    locations: WorkOrderData['locations'],
    children?: ReactNode,
}
const WorkOrderMap: FC<WorkOrderProps> = ({ locations, children, ...props }) => {

    const [window, setWindow] = useState<string | null>(null);
    const handleWindow = (val: string | null) => setWindow(val);

    const mapRef = useRef<Map>();

    const options = useMemo<MapOptions>(() => ({
        mapId: 'bfdc44fd3699038d', // FIXME: hard-coded?
        disableDefaultUI: true,
        clickableIcons: false,
        maxZoom: 20,
    }), []);

    const onLoad = useCallback((map: Map) => { // FIXME: any
        mapRef.current = map;
        const bounds: MapBounds = new google.maps.LatLngBounds();

        locations.forEach(({ location }) => {
            if (location) bounds.extend({ lat: location.latitude, lng: location.longitude });
        });

        mapRef.current.fitBounds(bounds, { top: 32, right: 32, bottom: 32, left: 32 });

    }, [locations]);

    const center = useMemo<LatLngLiteral>(() => ({ lat: 33.46782, lng: -112.10047 }), []);

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_JS_API_KEY as string,
    });

    if (!isLoaded) return(
        <Skeleton height={450} />
    )

    return(
        <Box {...props}>
            <GoogleMap zoom={17} options={options} onLoad={onLoad}
                       mapContainerStyle={{ width: '100%', height: '100%', borderRadius: '5px', position: 'relative' }}
            >
                { children }
                { locations.map(({id, location}) => (
                    location &&
                    <FormPin key={id} id={id} radius={(location?.accuracy) ? location.accuracy : 0}
                             location={{ lat: location?.latitude, lng: location?.longitude }}
                             open={(window === id)} handleOpen={handleWindow}
                    />))
                }
            </GoogleMap>
        </Box>
    )
};

export default WorkOrderMap;