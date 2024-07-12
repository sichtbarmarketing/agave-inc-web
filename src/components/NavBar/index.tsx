import {FC} from "react";
import BottomBar from "./BottomBar";
import SideBar from "./SideBar";

import { styled, Box, useMediaQuery, useTheme } from "@mui/material";

const HeaderContainer = styled('header')(({ theme }) => ({
    backgroundColor: '#fff',
    borderRight: '1px solid #dedede',

    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'flex-end',

    flex: '1 1 0',

    [theme.breakpoints.down('sm')]: {
        display: 'none'
    }
}));

/* TODO: BOTTOMBAR - find way to avoid zIndex */
const NavBar: FC<NavProps> = ({ nav }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    if (isMobile) return (
        <BottomBar nav={nav} sx={{ zIndex: 1100 }}/>
    );

    else return (
        <HeaderContainer>
            <SideBar nav={nav}/>
        </HeaderContainer>
    );
}

export default NavBar;

export type NavProps = {
    nav: { key: number, title: string, NavIcon: any, href: string }[]
}