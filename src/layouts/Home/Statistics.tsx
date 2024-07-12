import { FC, useEffect } from 'react';
import {Box, Container, Typography} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

const StatItem: FC<{ stat: number, title: string }> = ({ stat, title }) => {

    const count = useMotionValue(0);
    const rounded = useTransform(count, latest => Math.round(latest));

    useEffect(() => {
        const controls = animate(count, stat, { duration: 5 })

        return controls.stop
    }, [count, stat]);

    return(
        <Box textAlign='center' display='flex' flexDirection='column' alignItems='center' justifyContent='center' mt={2}>
            <Typography variant='h3' color={'primary'}><motion.div>{rounded}</motion.div></Typography>
            <Typography variant='h5' sx={{ maxWidth: 150 }}>{title}</Typography>
        </Box>
    );
}

const Statistics: FC = () => {

    return(
        <Box overflow='hidden' sx={{ bgcolor: 'beige.50' }} py={5}
             borderRadius={(theme) => `0 0 ${theme.spacing(3)} ${theme.spacing(3)}`}
        >
            <Container disableGutters maxWidth='md'>
                <Grid container spacing={2} sx={{ maxWidth: '100%' }}>
                    <Grid xs={6} sm={3}>
                        <StatItem stat={1200} title={'Clients'}/>
                    </Grid>
                    <Grid xs={6} sm={3}>
                        <StatItem stat={6000} title={'Projects'}/>
                    </Grid>
                    <Grid xs={6} sm={3}>
                        <StatItem stat={30} title={`Years of Experience`}/>
                    </Grid>
                    <Grid xs={6} sm={3}>
                        <StatItem stat={80} title={'Awards'}/>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default Statistics;