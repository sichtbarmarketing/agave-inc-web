import { FC } from 'react';
import { Paper, BottomNavigation, BottomNavigationProps, BottomNavigationAction, styled, } from '@mui/material';
import {NextLinkComposed} from 'components/Link';
import { NavProps } from "./index";

const BottomBar = (
    styled<FC<BottomNavigationProps & NavProps>>(({ nav, children, ...rest }) => {
        return (
            <Paper elevation={3}>
                <BottomNavigation showLabels {...rest}>
                    {nav.map(({key, NavIcon, title, href}) => (
                        <BottomNavigationAction
                            key={key}
                            component={NextLinkComposed} to={{pathname: href}}
                            label={title}
                            icon={ <NavIcon sx={{color: 'rgba(0, 0, 0, 0.54)',}} /> }
                        />
                    ))}
                </BottomNavigation>
            </Paper>
        )
    })
    <NavProps>(({ theme }) => ({
        borderTop: '1px solid #dedede',
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        [theme.breakpoints.up('sm')]: { display: 'none' }
    }))
);

export default BottomBar;