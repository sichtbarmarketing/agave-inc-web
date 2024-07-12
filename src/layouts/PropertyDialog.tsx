import { FC, Fragment, useState, useEffect } from "react";
import { Box, Dialog, DialogTitle, DialogContent, ListSubheader, DialogActions, Button, CircularProgress, List, ListItem, ListItemButton, ListItemText, Chip } from "@mui/material";
import axios, {CancelTokenSource} from "axios";
import useSWR from "swr";
import Loader from "components/Loader";

type PropertyDialogProps = {
    user: { uid: string, displayName: string, properties: string[] } | null;
    token: string | null;
    open: boolean; onClose: (value: string | null) => void;
}

const PropertyDialog: FC<PropertyDialogProps> = ({ user, token, open, onClose }) => {

    const [userProperties, setUserProperties] = useState<string[]>([]);

    useEffect(() => {
        if (user) setUserProperties(user.properties);
    }, [user])

    const handleAdd = (p: string) => {
        if (!userProperties.includes(p) && userProperties.length < 3) setUserProperties([...userProperties, p]);
    }

    const handleRemove = (pOut: string) => {
        setUserProperties(userProperties.filter(userProp => userProp !== pOut));
    }

    const handleCancel = () => {
        setUserProperties([]);
        onClose(null);
    };

    const handleSubmit = () => {
        if (user && token)
            putProperties(user.uid, token, userProperties)
            .then(() => handleCancel())
            .catch((e) => console.error(e));
    }

    const putProperties = async (uid: string, token: string, propArr: string[]) => {
        try {

            await axios.put(`api/users/${uid}`,
                { properties: propArr },
                { baseURL: '/', headers: { Authorization: token, } }
            );

        } catch (e) {
            console.error(e);
        }
    }

    const url = 'api/properties';
    const fetcher = useSWR(token ? url : null, (async (url) => {
        return await axios.get(url, {
            baseURL: '/',
            headers: { Authorization: token, }
        })
            .then(res => res.data)
            .catch(e => { console.error(e); throw e });
    }));

    const { data, error, isLoading, isValidating } = fetcher;

    if (isLoading || isValidating) return(<Dialog open={open} fullWidth><CircularProgress/></Dialog>)

    return(
        <Dialog open={open} fullWidth scroll={"paper"}>
            <DialogTitle fontWeight={700}>{`Add Up To 3 Properties for ${user?.displayName}`}</DialogTitle>
            <DialogContent dividers sx={{ pt: 0 }}>
                <List>
                    <ListSubheader>
                        {
                            (userProperties.length > 0) ?
                            userProperties.map((p: string) =>
                                <Chip key={p} label={p} color={"primary"} sx={{mr: 1}} onDelete={() => handleRemove(p)}/>
                            ) : <Chip label={'No Properties'} />
                        }
                    </ListSubheader>
                    {
                        data?.properties && data.properties.map((i: any) =>
                        <ListItem key={i.id} disablePadding>
                            <ListItemButton onClick={() => handleAdd(i.keyColumn)}>
                                <ListItemText primary={i.keyColumn}/>
                            </ListItemButton>
                        </ListItem>
                        )
                    }
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel} color={'error'}>Cancel</Button>
                <Button onClick={handleSubmit} disabled={user?.properties == userProperties}>Confirm</Button>
            </DialogActions>
        </Dialog>
    );
}

export default PropertyDialog;