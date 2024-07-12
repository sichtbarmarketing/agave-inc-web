import { FC } from 'react';
import Image, { ImageProps } from "next/image";
import { Container, Stack, Box, BoxProps, Typography, useTheme, useMediaQuery } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { motion } from "framer-motion";

import arborServices from '@public/assets/images/home/arbor-services.jpg';
import enhancementServices from '@public/assets/images/home/enhancement-services.jpeg';
import landscapeConstruction from '@public/assets/images/home/landscape-construction.jpg';
import landscapeMaintenance from '@public/assets/images/home/landscape-maintenance.jpg';
import nativePlantsSalvage from '@public/assets/images/home/native-plants-salvage.jpg';
import waterManagement from '@public/assets/images/home/water-management.jpg';

const WhatWeDoItem: FC<{ img: ImageProps['src'] } & BoxProps> = ({ img, title, ...props}) => {

    return(
        <motion.a initial={{ opacity: 0.6, transform: "translateY(100px)" }}
                  whileInView={{ opacity: 1, transform: "translateY(0px)" }}
                  href={'https://www.agave-inc.com/'} referrerPolicy='no-referrer' target='_blank'
        >
            <Box
                sx={{
                    position: 'relative', overflow: 'hidden',
                    borderRadius: '1rem', cursor: 'pointer',
                    '> img': { transition: 'transform 500ms cubic-bezier(0.85, 0, 0.15, 1)', willChange: 'transform' },
                    '&:hover' : { '> img': { transform: 'scale(1.05, 1.05)' } },
                }}
                {...props}
            >
                <Image src={img} alt={title ? title : 'What We Do Image'} fill style={{ objectFit: 'cover' }} placeholder='blur'/>
                <Box sx={{ position: 'absolute', inset: '0 0 50%', background: 'linear-gradient(rgba(0,0,0,1), rgba(0,0,0,0))' }}>
                    <Box sx={{
                        position: 'absolute',
                        left: 0,
                        paddingLeft: '40px',
                        top: '30px',
                        maxWidth: '250px',
                        textAlign: 'left',
                        width: '100%',
                        zIndex: 1,
                    }}>
                        <Typography color={'primary'}>What We Do</Typography>
                        <Typography variant={'h5'} color={'white'}>{title ? title : 'What We Do'}</Typography>
                    </Box>
                </Box>
            </Box>
        </motion.a>
    );
}

const WhatWeDoGrid: FC = () => {

    const theme = useTheme();
    const isMd = useMediaQuery(theme.breakpoints.down('md'));

    return(
        <Container maxWidth={ isMd ? 'sm' : 'lg'}>
            <Grid container spacing={2}>
                <Grid xs={12} md={4} >
                    <Stack direction='column' sx={{ gap: theme.spacing(2) }}>
                        <WhatWeDoItem height={300} img={landscapeMaintenance} title={'Landscape Maintenance'}/>
                        <WhatWeDoItem height={380} img={landscapeConstruction} title={'Landscape Construction'}/>
                    </Stack>
                </Grid>
                <Grid xs={12} md={4} >
                    <Stack direction='column' sx={{ gap: theme.spacing(2) }}>
                        <WhatWeDoItem height={380} img={waterManagement} title={'Water Management'}/>
                        <WhatWeDoItem height={300} img={nativePlantsSalvage} title={'Native Plants Salvage'}/>
                    </Stack>
                </Grid>
                <Grid xs={12} md={4} >
                    <Stack direction='column' sx={{ gap: theme.spacing(2) }}>
                        <WhatWeDoItem height={300} img={arborServices} title={'Arbor Services'}/>
                        <WhatWeDoItem height={380} img={enhancementServices} title={'Enhancement Services'}/>
                    </Stack>
                </Grid>
            </Grid>
        </Container>
    );
}

export default WhatWeDoGrid;