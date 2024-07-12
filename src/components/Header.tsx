import Image from "next/image";
import { FC, ReactNode } from "react";
import { Box, BoxProps, styled } from "@mui/material";
import { NextLinkComposed } from "components/Link";
import agaveLogo from '@public/assets/images/logo-agave.png';

interface HeaderProps extends BoxProps { setHeight: number, children?: ReactNode }

const SmoothHeader = styled(Box, { shouldForwardProp: (props) => props !== 'setHeight', })<{ setHeight: number }>
(({ theme, setHeight, ...props }) => ({

    position: 'relative',
    height: `calc(${setHeight}px + env(safe-area-inset-top))`,
    width: '100%',
    paddingTop: `env(safe-area-inset-top, ${theme.spacing(2)})`,
    paddingRight: `calc(${theme.spacing(2)} + env(safe-area-inset-right))`,
    paddingLeft: `calc(${theme.spacing(2)} + env(safe-area-inset-left))`,

    display: 'flex', flexFlow: 'row nowrap', justifyContent: 'space-between', alignItems: 'center',

    transitionProperty: 'all',
    transitionDuration: '200ms',
    transitionTimingFunction: 'ease',
}));

const Header: FC<HeaderProps> = ({ setHeight, children, ...props }) => {

    return(
        <SmoothHeader setHeight={setHeight} {...props}>
            <Box position='relative' height='100%' minWidth={150} component={NextLinkComposed} to={{pathname: '/'}} >
                <Image src={agaveLogo} alt='Agave Logo' fill loading='lazy' placeholder='blur' sizes={'150px'} style={{ objectFit: 'contain'}}/>
            </Box>
            <Box flex='1 1 auto' justifyContent='flex-end' display='flex'>
                {children}
            </Box>
        </SmoothHeader>
    );
}

export default Header;