import { NextPage } from "next";
import React, { Fragment, useEffect, useState } from "react";
import { AuthAction, withAuthUser, useAuthUser } from "next-firebase-auth";
import Loader from "components/Loader";
import ErrorMessage from "components/ErrorMessage";
import PropertyDialog from "layouts/PropertyDialog";
import { Box, Container, Divider, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button } from "@mui/material"
import useSWR from "swr";
import axios from "axios";
import Settings from "@mui/icons-material/Settings";
import { H2, Paragraph } from "components/Typography";

type AdminDashboardProps = {}

const AdminDashboardPage: NextPage<AdminDashboardProps> = ({}) => {

    const url = 'api/users';

    const AuthUser = useAuthUser(); // according to next-firebase-auth, the user is guaranteed to be authenticated
    const [dialog, setDialog] = useState(false);
    const [user, setUser] = useState<{ uid: string, displayName: string, properties: string[] } | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const handleEditUser = (id: string, disNam: string, propsArr: string[]) => {
        setUser({ uid: id, displayName: disNam, properties: propsArr });
    }

    const handleCloseDialog = () => {
        setUser(null);
        setDialog(false);
    }

    useEffect(() => {
        if (user) setDialog(true);
    },[user]);

    useEffect(() => {
        (async () => {
            const idToken = await AuthUser.getIdToken();
            console.log(`getToken called; Token: ${!!idToken}`);
            setToken(idToken);
        })();
    }, [AuthUser])

    const fetcher = useSWR(AuthUser ? url : null, (async () => {
        const token = await AuthUser.getIdToken();
        return await axios.get(url, { baseURL: '/', headers: { Authorization: token }, } )
            .then(res => res.data)
            .catch(e => { console.error(e); throw e });
    }));

    const { data, error, isLoading, isValidating } = fetcher;

    if (isLoading || isValidating) return <Loader/>;

    if (error) return (
        <Container sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ErrorMessage code={ (error.code) ? error.code : 500} message={ (error.message) ? error.message : undefined}/>
        </Container>
    )

    return(
        <Fragment>
            <Box height='100%' display='flex' flexDirection='column'>
                <Container sx={{ mt: "2rem", mb: "1rem" }}>
                    <Box display='flex' alignItems='center' my={2}>
                        <Settings color="primary"/>
                        <H2 ml={1.5} my="0px" lineHeight="1" whiteSpace="pre">
                            Admin Dashboard
                        </H2>
                    </Box>

                    <Divider sx={{ mb: 1, borderColor: "grey.300" }} />
                </Container>

                <Container>
                    <TableContainer component={Paper}>
                        <Table aria-label="User Table">
                            <TableHead>
                                <TableRow hover={false}>
                                    <TableCell sx={{ fontWeight: 700 }}>User</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 700 }}>Role</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 700 }}>Properties</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.users?.map((i: any) => (
                                    <TableRow key={i.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row">
                                            <Paragraph> {i.displayName} </Paragraph>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip label={i.admin ? "Admin" : "User"} size="small" color={i.admin ? "primary" : "default"}/>
                                        </TableCell>
                                        <TableCell align="right">
                                            {i.admin ? null :
                                                <Button onClick={() => handleEditUser(i.id, i.displayName, i.properties)} color="primary">EDIT</Button>
                                            }
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <PropertyDialog user={user} open={dialog} onClose={handleCloseDialog} token={token}/>
                </Container>
            </Box>
        </Fragment>
    );
};

export default withAuthUser<AdminDashboardProps>({
    whenAuthed: AuthAction.RENDER, // Page is rendered, if the user is authenticated
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER, // Shows loader, if the user is not authenticated & the Firebase client JS SDK has not yet initialized.
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN, // Redirect to log-in page, if user is not authenticated
    LoaderComponent: Loader,
})(AdminDashboardPage);