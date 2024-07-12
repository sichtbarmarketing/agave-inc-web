/**
 * usePosition Hook:
 * - code taken from 'trekhleb' on GitHub [https://github.com/trekhleb/use-position/tree/master]
 * - modified for use with Typescript
**/

import { useState, useEffect, useMemo } from "react";

const defaultSettings = {
    enableHighAccuracy: false,
    timeout: Infinity,
    maximumAge: 0,
};

type Position = {
        latitude: number | null,
        longitude: number | null,
        accuracy: number | null,
        speed: number | null,
        heading: number | null,
        timestamp: number | null
}

export const usePosition = (active: boolean, watch: boolean = false, userSettings = {}) => {

    const settings = useMemo(() => {
        return { ...defaultSettings, ...userSettings, }
    }, [userSettings]);

    const [position, setPosition] = useState<Position>({
        latitude: null, longitude: null, accuracy: null, speed: null, heading: null, timestamp: null
    });
    const [error, setError] = useState<string | null>(null);

    const onChange = ({coords, timestamp}: GeolocationPosition) => {
        setPosition({
            latitude: coords.latitude,
            longitude: coords.longitude,
            accuracy: coords.accuracy,
            speed: coords.speed,
            heading: coords.heading,
            timestamp,
        });
    };

    const onError = (error: any) => {
        setError((error?.message) ? error.message as string : 'Unknown error!');
    };

    useEffect(() => {
        if (!active) return;

        if (!navigator || !navigator.geolocation) {
            setError('Geolocation is not supported');
            return;
        }

        if (watch) {
            const watcher =
                navigator.geolocation.watchPosition(onChange, onError, settings);
            return () => navigator.geolocation.clearWatch(watcher);
        }

        navigator.geolocation.getCurrentPosition(onChange, onError, settings);
    }, [ active, watch, settings ]);

    return {...position, error};
};