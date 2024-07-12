import React, {FC, Fragment} from 'react';
import {Box, Stack, Paper, Typography, Divider, ListItemIcon, Container} from '@mui/material';
import { List, ListItem, ListItemText, ListItemButton } from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';

// MUI ICONS
import PictureAsPdfSharp from "@mui/icons-material/PictureAsPdfSharp";
import DownloadSharp from "@mui/icons-material/DownloadSharp";
import DataObjectIcon from '@mui/icons-material/DataObject';

import {H1, H3, H4, Paragraph } from "components/Typography"

type StatusUpdateProps = { fields: any };
const StatusUpdate: FC<StatusUpdateProps> = ({ fields }) => {

    // FIXME: Dev Only
    const openJson = () => {
        let file = new Blob([JSON.stringify(fields, null, '\t')], { type: 'application/json' });
        let fileURL = URL.createObjectURL(file);
        let tab = window.open('about:blank', '_blank');

        if (tab) {
            tab.document.write(`<iframe src="${fileURL}" style="border:0; inset:0; width:100%; height:100%;" allowfullscreen />`);
            tab.document.close();
            URL.revokeObjectURL(fileURL);
        }
    }

    if (!fields) return(<div>We could not load your data!</div>);

    return(
        <Container maxWidth={false} disableGutters sx={{ backgroundColor: '#edeae5' }}>
            <Grid container spacing={3} p={3} xs={12}>

                <Grid xs={12}>
                    <Box component={Paper} p={3}>
                        <H1>STATUS UPDATE</H1>
                        <Stack direction={"row"} justifyContent={"space-between"}>
                            <Typography>Job</Typography>
                            <Typography>
                                { (fields["Job Name"].value) ? fields["Job Name"].value : "Not Specified" }
                            </Typography>
                        </Stack>

                        <Stack direction={"row"} justifyContent={"space-between"}>
                            <Typography>Manager</Typography>
                            <Typography>
                                { (fields.Manager.text) ? fields.Manager.text : "Not Specified" }
                            </Typography>
                        </Stack>
                    </Box>
                </Grid>

                <Grid xs={12} md={6} >
                    <Box component={Paper} p={3}>
                        <H3>SUMMARY</H3>
                        <Divider/>

                        <Stack divider={<Divider/>}>
                            <Box py={3}>
                                <H4>Turf</H4>
                                <Paragraph lineHeight={1.5}>
                                    { (fields["Text 5"].text) ? (fields["Text 5"].text) : "Not Specified" }
                                </Paragraph>
                            </Box>
                            <Box py={3}>
                                <H4>General Grounds</H4>
                                <Paragraph lineHeight={1.5}>
                                    { (fields["Text 6"].text) ? (fields["Text 6"].text) : "Not Specified" }
                                </Paragraph>
                            </Box>
                            <Box py={3}>
                                <H4>Irrigation</H4>
                                <Paragraph lineHeight={1.5}>
                                    { (fields["Text 6"].text) ? (fields["Text 6"].text) : "Not Specified" }
                                </Paragraph>
                            </Box>
                            <Box py={3}>
                                <H4>Plants</H4>
                                <Paragraph lineHeight={1.5}>
                                    { (fields["Text 7"].text) ? (fields["Text 7"].text) : "Not Specified" }
                                </Paragraph>
                            </Box>
                            <Box py={3}>
                                <H4>Trees</H4>
                                <Paragraph lineHeight={1.5}>
                                    { (fields["Text 8"].text) ? (fields["Text 8"].text) : "Not Specified" }
                                </Paragraph>
                            </Box>
                        </Stack>
                    </Box>
                </Grid>

                <Grid xs={12} md={6}>
                    <Stack spacing={3} flex="1 1 0">
                        <Box component={Paper} p={3}>
                            <H3>NOTES</H3>
                            <Divider/>

                            <Stack divider={<Divider/>}>
                                <Box py={3}>
                                    <H4>Property Drive Notes</H4>
                                    <Paragraph lineHeight={1.5}>
                                        { (fields["Text 11"].text) ? (fields["Text 11"].text) : "No Notes" }
                                    </Paragraph>
                                </Box>
                                <Box py={3}>
                                    <H4>Actions For Completion</H4>
                                    <Paragraph lineHeight={1.5}>
                                        { (fields["Text 12"].text) ? (fields["Text 12"].text) : "No Notes" }
                                    </Paragraph>
                                </Box>
                            </Stack>
                        </Box>

                        <Box component={Paper} p={3}>
                            <H3>ATTACHMENTS</H3>
                            <Divider/>

                            <Stack divider={<Divider/>}>
                                <List>
                                    <ListItem component={Paper} disablePadding sx={{ my: 1 }}>
                                        <ListItemButton >
                                            <ListItemIcon>
                                                <PictureAsPdfSharp fontSize={'large'} color={"error"}/>
                                            </ListItemIcon>
                                            <ListItemText primary={<Paragraph fontWeight={700}>Status Update Form</Paragraph>}
                                                          secondary={'File type: PDF'}
                                            />
                                            <DownloadSharp color="primary"/>
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem component={Paper} disablePadding sx={{ my: 1 }}>
                                        <ListItemButton  onClick={() => openJson()}>
                                            <ListItemIcon>
                                                <DataObjectIcon fontSize={'large'} color={"inherit"}/>
                                            </ListItemIcon>
                                            <ListItemText primary={<Paragraph fontWeight={700}>Status Update RAW</Paragraph>}
                                                          secondary={'File type: JSON'}
                                            />
                                            <DownloadSharp color="primary"/>
                                        </ListItemButton>
                                    </ListItem>
                                </List>
                            </Stack>
                        </Box>
                    </Stack>
                </Grid>

            </Grid>
        </Container>
    );
}

export default StatusUpdate;