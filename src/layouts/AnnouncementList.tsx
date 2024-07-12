import React, { FC, Fragment } from "react";
import { H4, Paragraph, Small } from "components/Typography";
import axios from "axios";
import useSWR from "swr";
import { Box, Divider, List, ListItem, ListItemAvatar, ListItemText, Alert, CircularProgress } from "@mui/material";
import { Person } from "@mui/icons-material";
import * as yup from "yup";
import { AnnouncementSchema } from "utils/api/yup";

type Announcement = yup.InferType<typeof AnnouncementSchema>;
const fetcher = (url: string) => axios.get(url).then(res => res.data);
const AnnouncementList: FC = () => {
    const fetched = useSWR('/api/announcements', fetcher);

    if (fetched.error) return(<Alert severity="error">Error - could not retrieve announcements</Alert>);
    if (fetched.isLoading) return(
        <Box height='100%' display='flex' flexDirection='column' p={3}>
            <CircularProgress />
        </Box>
    );

    return(
        <Fragment>
            {fetched.data.announcements !== null &&
                <List disablePadding>
                    {fetched.data.announcements.map((i: Announcement) => (
                        <Fragment key={i.id}>
                            <ListItem>
                                <ListItemAvatar>
                                    {<Person/>}
                                </ListItemAvatar>
                                <ListItemText
                                    primary={<H4>{i.title}</H4>}
                                    secondary={
                                        <>
                                            <Paragraph
                                                sx={{ display: 'block' }}
                                                component="span"
                                                color="text.primary"
                                                mb={1}
                                            >
                                                {i.description}
                                            </Paragraph>
                                            <Small
                                                sx={{ display: 'block', textAlign: 'end' }}
                                            >
                                                {`- ${new Date(i.created._seconds * 1000 + i.created._nanoseconds / 1000000,).toDateString()}`}
                                            </Small>
                                        </>
                                    }
                                />
                            </ListItem>
                            <Divider variant="inset" component="li" />
                        </Fragment>
                    ))}
                </List>
            }
        </Fragment>
    );
}

export default AnnouncementList;