import { FC } from 'react';
import {Box, Container, Stack, styled, Typography, Link, IconButtonProps, Paper, Divider} from "@mui/material";
import { LinkedIn, Instagram, Facebook } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import {NextLinkComposed} from "./Link";
import Image from "next/image";
import agaveLogo from "@public/assets/images/logo-agave-white.svg";

const FooterWrapper = styled(Box, {})
(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    minHeight: '50vh',
    padding: theme.spacing(6),
    display: 'flex',
    flexFlow: 'row wrap',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderRadius: theme.spacing(3),
}));

const FooterTypography = styled(Typography, {})(({ theme }) => ({
    fontFamily: 'Roboto',
    color: theme.palette.grey['100'],
    letterSpacing: '-1px',
    marginBottom: theme.spacing(2),
}));

const FooterIcon = styled(IconButton, {})(({ theme, ...props }) => ({
    color: theme.palette.grey['100'],
    '& svg': {
        fontSize: '3rem',
    },
})) as typeof IconButton

const Footer: FC = () => {

    return(
        <FooterWrapper>
            <Box position='relative' component={NextLinkComposed} to={{pathname: '/'}} >
                <Image src={agaveLogo} alt='Agave Logo' width={300} loading='lazy' style={{ objectFit: 'contain'}}/>
            </Box>
            <Stack alignItems='center' justifyContent='center'>
                <FooterTypography color={'beige'} fontSize={{ xs: '35px', md: '3rem' }}>Connect With Us</FooterTypography>
                <Box>
                    {FooterLinks.map((i) => <FooterIcon key={i.key} href={i.link} target='_blank'>{i.LinkLogo}</FooterIcon>)}
                </Box>
            </Stack>
        </FooterWrapper>
    );
}

const FooterLinks = [
    { key: 'LinkedIn', link: 'https://www.linkedin.com/company/agaveincaz/', LinkLogo: <LinkedIn/> },
    { key: 'Facebook', link: 'https://fb.com/agaveincaz', LinkLogo: <Facebook/> },
    { key: 'Instagram', link: 'https://instagram.com/agaveincaz', LinkLogo: <Instagram/> }
]

export default Footer;