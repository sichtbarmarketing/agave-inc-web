import React, { FC, useEffect, useState } from 'react';

import { Card, CardProps, CardContent, CardMedia, Typography, Chip } from '@mui/material';
import ImageWithFallback from "components/ImageFallback";
import downloadImage from "@firebaseUtils/client/downloadImage";

import loadingGif from "@public/assets/images/loading.gif";

import LocationOnIcon from '@mui/icons-material/LocationOn';

interface PropertyDetailsProps extends CardProps {
    pName: string,
    pAddress: string,
    mName: string,
    imageUrl?: string,
}
const PropertyDetails: FC<PropertyDetailsProps> = ({ pName, pAddress, mName, imageUrl = "", ...props }: PropertyDetailsProps) => {

    // [FIXME] >>>>>>>>
    const [image, setImage] = useState(loadingGif.src);

    useEffect(() => {
        const getImage = async () => {
            const { result, error } = await downloadImage(imageUrl);
            if (error) { setImage('/assets/not-found.jpg'); return console.error(error.message); } // FIXME
            if (result) setImage(result)
            return console.log(`DOWNLOAD IMAGE ${imageUrl} : ${result}`);
        }

        if (imageUrl) void getImage();

    }, []);
    // [FIXME] <<<<<<<<<

    return(
        <Card sx={{ display: 'flex', flexWrap: 'wrap' }} {...props}>
            <CardMedia sx={{ position: 'relative', minHeight: 220, width: {xs: '100%'}, overflow: 'hidden' }}>
                <ImageWithFallback src={image} fill imgObjectFit={"cover"} alt={`Image for ${pName}`}/>
            </CardMedia>
            <CardContent>
                <Typography component="div" variant="h5">
                    {pName}
                </Typography>
                <Typography variant="subtitle1" color="grey.600" component="div" mb={3}>
                    {mName}
                </Typography>
                <Chip icon={<LocationOnIcon/>} label={pAddress}/>
            </CardContent>
        </Card>
    )
}

export default PropertyDetails;