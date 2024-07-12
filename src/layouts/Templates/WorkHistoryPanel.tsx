import { FC, SyntheticEvent } from 'react';

import {
    Paper,
    Box,
    List,
    ListItem,
    ListItemIcon,
    ListItemButton,
    ListItemText,
    Chip,
    Button,
    CircularProgress
} from '@mui/material';
import { H2, Paragraph } from "components/Typography";
import { NextLinkComposed } from "components/Link";
import { format } from "date-fns";

import CactusSVG from "@public/assets/agave-graphics/dark-green/cactus2.svg";
import { TabPanel, TabPanelProps } from "@mui/lab";
import { SvgIconComponent } from "@mui/icons-material";

interface WorkHistoryPanel extends TabPanelProps {
    forms?: any[],
    validating: boolean,
    loading: boolean,
    error: any,
    pName: string,
    Icon: SvgIconComponent,
    label: string,
    action: (event: SyntheticEvent, formId: string) => void
}

const WorkHistoryPanel: FC<WorkHistoryPanel> = ({ forms = [], Icon, validating, loading, error, pName, label, action, ...props  }: WorkHistoryPanel) => {

    if (loading) return(
        <TabPanel {...props} sx={{ minHeight: '40vh' }} >
            <Box display='flex' alignItems='center' justifyContent='center'><CircularProgress/></Box>
        </TabPanel>
    );

    if (forms.length == 0) return(
        <TabPanel {...props} sx={{ p: 0, minHeight: '40vh' }} >
            <EmptyList hide={false} property={pName} label={label}/>
        </TabPanel>
    )

    return(
        <TabPanel {...props} sx={{ p: 0, minHeight: '40vh' }} >
            <List>
                {
                    forms.map((f: Form) =>
                        <ListItem key={f.formId} component={Paper} disablePadding sx={{ mb: 1 }}>
                            <ListItemButton onClick={(event) => action(event, f.formId)}>
                                <ListItemIcon>
                                    {<Icon/>}
                                </ListItemIcon>
                                <ListItemText
                                    primaryTypographyProps={{ sx: { fontWeight: 500 } }}
                                    primary={label}
                                    secondaryTypographyProps={{ sx: { color: 'grey' } }}
                                    secondary={pName}
                                />
                                <Chip color='primary' variant='outlined'
                                      label={format(new Date(f.lastUpdateDate), 'MM/dd/yyyy')}
                                />
                            </ListItemButton>
                        </ListItem>
                    )
                }
            </List>
        </TabPanel>
    )
}

const EmptyList: FC<{ hide: boolean, property: string, label: string }> = ({ hide, property, label }) => {

    return(
        <Box component={Paper} display={ (hide) ? 'none' : "flex" } p={3} alignItems={'center'}
             sx={{
                 position: 'relative',
                 minHeight: '300px',
                 backgroundColor: '#c6e4cd',
                 backgroundImage: `url(${CactusSVG.src})`,
                 backgroundSize: 'auto 90%',
                 backgroundRepeat: 'no-repeat',
                 backgroundPosition: 'right bottom 10px',
                 outline: '2px solid white',
                 outlineOffset: '-10px',
                 borderRadius: '20px',
             }}
        >
            <Box ml={{ sm: 2 }}>
                <H2 sx={{ color: '#871A78' }}>{"It's a little dry in here."}</H2>
                <Paragraph>{`We have no ${label}s to display for ${property}.`}</Paragraph>
                <Paragraph mb={2}>{'Check back later!'}</Paragraph>
                <Button variant='contained' color='secondary' component={NextLinkComposed} to='/contact'>Contact Us</Button>
            </Box>
        </Box>
    );
}

type Form = {
    assignment: { id: string, type: string, url: string }
    formId: string
    lastUpdateDate: string
    location?: { latitude: number, longitude: number, accuracy?: any }
    name: string
    status: { status: string, changeDate: string }
    templateId: string
    templateUrl: string
    url: string
}

export default WorkHistoryPanel;