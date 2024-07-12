import { FC } from 'react';
import { LinearProgress, Box, Container } from "@mui/material";
import Image from 'next/image';

type LoaderProps = {

}

const Loader: FC<LoaderProps> = ({}) => {
    return(
        <Box height='100%' display='flex' flexDirection='column' p={3}>
            <Container maxWidth='sm' sx={{ my: "2rem", position: 'relative' }}>
                <Image
                    src="/assets/images/logo-agave.png"
                    width={558}
                    height={223}
                    alt="Agave Logo"
                    style={{ objectFit: 'contain', maxWidth: '100%' }}
                />
                <LinearProgress color="primary" />
            </Container>
        </Box>
    );
}

export default Loader;