import { FC } from 'react';
import Link from 'next/link';
import { styled, } from '@mui/material';
import { Box, BoxProps, Avatar, List, ListItem, ListItemButton, ListItemAvatar, ListItemIcon, ListItemText } from '@mui/material';
import Image from "components/BazarImage";
import { NavProps } from "./index";

const SideBar = (
    styled<FC<BoxProps & NavProps>>(({ nav, children, ...rest }) => {
        return (
            <Box {...rest}>
                <List >
                    <ListItem key={'logo-button'}>
                        <Link href="/" passHref>
                            <Image width={225} sx={{margin: '0 auto'}} src="/assets/images/logo-agave.png" alt="logo" />
                        </Link>
                    </ListItem>

                    {nav.map(({key, NavIcon, title, href}) => (
                        <ListItem key={key} >
                            <Link href={href} passHref>
                                <ListItemButton sx={{borderRadius: '30px'}} >
                                    <ListItemIcon><NavIcon sx={{fontSize: '1.9rem'}} /></ListItemIcon>
                                    <ListItemText
                                        primary={title}
                                        primaryTypographyProps={{sx: {color: 'rgba(0, 0, 0, 0.54)', fontSize: '1.3rem', fontWeight: 600} }}
                                    />
                                </ListItemButton>
                            </Link>
                        </ListItem>
                    ))}
                </List>

                <ListItem key={'account-button'}>
                    <ListItemButton sx={{borderRadius: '30px', display: 'none'}} >
                        <ListItemAvatar><Avatar alt={'avatar'}/></ListItemAvatar>
                        <ListItemText
                            primary={'Mike McMahon'}
                            secondary={'Administrator'}
                            primaryTypographyProps={{sx: {color: 'rgba(0, 0, 0, 0.54)', fontSize: '1rem', fontWeight: 600} }}
                        />
                    </ListItemButton>
                </ListItem>
            </Box>
        )
    })
    <NavProps>(({ theme }) => ({
        /* Root Element Styling */
        padding: `${theme.spacing(1)}`,
        width: 275, height: '100%',
        display: 'flex',
        flexFlow: 'column nowrap',
        justifyContent: 'space-between',

        [theme.breakpoints.down('sm')]: { display: 'none' }
    }))
);

export default SideBar;