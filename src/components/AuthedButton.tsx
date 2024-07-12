'use client'

import { FC } from 'react'
import { Avatar, Button } from "@mui/material";
import { NextLinkComposed } from "components/Link";

import clientLogOut from "@firebaseUtils/client/logOut";
import PersonOutline from "@mui/icons-material/PersonOutline";

type AuthedButtonProps = { signedIn: boolean, name: string | null, }

const handleLogOut = async () => {
    const { result, error } = await clientLogOut();
    if (error) { return console.error(error); }
    // else successful
    return console.log(result);
};

const AuthedButton: FC<AuthedButtonProps> = ({ signedIn, name }) => {

    if (signedIn) return(
        <Button startIcon={<Avatar>{(name) ? name.charAt(0) : <PersonOutline color='primary'/> }</Avatar>}
                variant='contained' color='primary' sx={{ borderRadius: '24px', pl: '10px', pr: '16px' }}
                onClick={handleLogOut}
        >
            { 'Log Out' }
        </Button>
    );

    else return(
        <Button endIcon={<Avatar><PersonOutline color='secondary'/></Avatar>}
                variant='contained' color='secondary' sx={{ borderRadius: '24px', pr: '10px', pl: '16px' }}
                component={NextLinkComposed} to={'/log-in'}
        >
            { 'Log In' }
        </Button>
    );
}

export default AuthedButton;