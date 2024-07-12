import React, { FC } from "react";
import {
    Box,
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    CardProps,
    styled
} from "@mui/material";
import ImageWithFallback from "components/ImageFallback";
import downloadImage from "@firebaseUtils/client/downloadImage";
import loadingGif from "@public/assets/images/loading.gif";
import { useEffect, useState } from 'react';
import { NextLinkComposed } from "components/Link";

const HoverBox = styled(Box)(({ theme }) => ({

    position: 'relative',
    overflow: 'hidden',
    borderBottom: '1px solid',
    borderColor: `${theme.palette.grey["300"]}`,

    '> img': {
        transitionProperty: 'transform',
        transitionDuration: '200ms',
        transitionTimingFunction: 'ease',

        ':hover': {
            transform: 'scale(1.05, 1.05)',
        },
    },
}));

interface PropertyCardProps extends CardProps {
    propertyName: string,
    propertyId: string,
    imageUrl?: string,
}

const PropertyCard = ({ propertyName, propertyId, imageUrl = "", ...props }: PropertyCardProps ) => {

    // [FIXME] >>>>>>>>
    const [image, setImage] = useState(loadingGif.src);

    useEffect(() => {
        const getImage = async () => {
            const { result, error } = await downloadImage(imageUrl);
            if (error) { setImage('/not-found.jpg'); return console.error(error.message); } // FIXME
            if (result) setImage(result)
            return console.log(`DOWNLOAD IMAGE ${imageUrl} : ${result}`);
        }

        if (imageUrl) void getImage();

    }, [imageUrl]);
    // [FIXME] <<<<<<<<<

    return(
        <Card sx={{ minWidth: { md: 350 } }} { ...props }>
            <CardActionArea component={NextLinkComposed} to={`/work-history/${encodeURIComponent(propertyId)}`}>
                <CardMedia>
                    <HoverBox height={{ xs: 200, md: 180 }} >
                        <ImageWithFallback src={image} fill imgObjectFit={"cover"} alt={"Image for [PROPERTY]"}/>
                    </HoverBox>
                </CardMedia>
                <CardHeader titleTypographyProps={{ color: "#96772c" }} title={propertyName}></CardHeader>
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <Button variant='text' color={'secondary'}>View Details</Button>
                </CardActions>
            </CardActionArea>
        </Card>
    );
}

export default PropertyCard;