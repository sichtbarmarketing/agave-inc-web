import React, { FC, Fragment } from 'react';

import {Box, BoxProps, CircularProgress, Stack, Skeleton, Paper, Button} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2

import { H2, Paragraph } from "components/Typography";
import { NextLinkComposed } from "components/Link";

import { PropertySchema } from "utils/api/yup";
import * as yup from "yup";
import PropertyCard from "components/PropertyCard";

import HomeWorkIcon from "@mui/icons-material/HomeWork";
import AgaveSVG from "@public/assets/agave-graphics/dark-green/agave2.svg";

type PropertiesListProps = {
    properties?: yup.InferType<typeof PropertySchema>[],
    validating: boolean,
    loading: boolean,
    error: any,
    showTitle?: boolean,
}
const PropertiesList: FC<PropertiesListProps> = ({ properties = [], validating, loading, error, showTitle = true }) => {

    return(
        <Fragment>
            <Box display={ showTitle ? 'flex' : 'none' } alignItems='center' my={2}>
                <HomeWorkIcon color="primary"/>
                <H2 ml={1.5} my="0px" lineHeight="1" whiteSpace="pre">
                    Your Agave Properties
                </H2>
                <CircularProgress size='1rem' sx={{ ml: 2, display: (validating ? 'flex' : 'none') }}/>
            </Box>
            <Stack direction='row' flexWrap='wrap' sx={{ gap: '1em' }} width={'100%'}>
                {
                    (!loading) ? properties.map((p) =>
                        <PropertyCard key={p.id} propertyName={p.name} imageUrl={p.displayImage as string} propertyId={p.id}
                                      sx={{ flex: '1 1 100%', maxWidth: { xs: '100%', md: 'calc(50% - 1em)' } }}/>
                    ) : <Skeleton variant='rounded' height={300}
                                  sx={{ flex: '1 1 100%', maxWidth: { xs: '100%', md: 'calc(50% - 1em)' } }}/>
                }
                <AddProperty />
            </Stack>
        </Fragment>
    );
}

const AddProperty: FC<BoxProps> = () => {

    return(
        <Box component={Paper} display={"flex"} p={3} alignItems={'center'}
             sx={{
                 flex: '1 1 100%',
                 maxWidth: { xs: '100%', md: 'calc(50% - 1em)' },
                 minHeight: '290px',
                 position: 'relative',

                 background: `url(${AgaveSVG.src}) right bottom 10px / auto 90% no-repeat, beige`,

                 outline: '2px solid white',
                 outlineOffset: '-10px',
                 borderRadius: '5px',
             }}
        >
            <Box ml={{ sm: 2 }}>
                <H2 sx={{ color: '#871A78' }} mb={2}>{"Are we missing something?"}</H2>
                <Button variant='contained' color='secondary' component={NextLinkComposed} to='/contact'>Contact Us</Button>
            </Box>
        </Box>
    );
}

export default PropertiesList;