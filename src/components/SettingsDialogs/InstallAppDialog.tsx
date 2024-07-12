import { FC, useState } from 'react';
import SettingsDialog, { SettingsDialogProps } from "./SettingsDialog";
import ImageWithFallback from "components/ImageFallback";
import { DialogContentText, Box, Tab } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

/* ASSETS */
import IosShareOutlinedIcon from '@mui/icons-material/IosShareOutlined';
import chromePng from '@public/assets/images/settings/chrome-install.png';

interface InstallAppDialogProps extends SettingsDialogProps { }

const InstallAppDialog: FC<InstallAppDialogProps> = ({ toggle, open, ...rest }) => {

    const [tab, setTab] = useState('1');
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setTab(newValue);
    };

    return(
        <SettingsDialog title="Add To Home Screen" toggle={toggle} open={open} scroll='paper' {...rest} >
            <DialogContentText sx={{ color: 'grey.600', fontSize: '1rem', mb: 1 }}>
                Install Agave Community to your device and enjoy the following features:
            </DialogContentText>
            <DialogContentText sx={{ color: 'grey.600', fontSize: '.9rem', mb: .5 }}>
                • Receive Push Notifications
            </DialogContentText>
            <DialogContentText sx={{ color: 'grey.600', fontSize: '.9rem', mb: .5 }}>
                • Fullscreen view, like a native app
            </DialogContentText>
            <DialogContentText sx={{ color: 'grey.600', fontSize: '.9rem', mb: .5 }}>
                • Agave in your home screen; Just a tap away!
            </DialogContentText>
            <Box mt={2}>
                <TabContext value={tab}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChange} variant='fullWidth' aria-label="PWA Instructions Tabs">
                            <Tab label="iOS" value="1" sx={{textTransform: 'none', color: 'grey.600' }} />
                            <Tab label="Android" value="2" sx={{textTransform: 'none', color: 'grey.600' }} />
                            <Tab label="Desktop" value="3" sx={{textTransform: 'none', color: 'grey.600' }} />
                        </TabList>
                    </Box>
                    <TabPanel value="1" sx={{ px: 1 }}>
                        <Box minHeight={150}>
                            <DialogContentText sx={{ color: 'grey.600', fontSize: '.9rem', mb: .5 }}>
                                1. While viewing the website using the Safari browser, tap the
                                <IosShareOutlinedIcon sx={{fontSize: '1rem', mx: .2, mb: -.2}}/>
                                Share Button in the Menu Bar.
                            </DialogContentText>
                            <DialogContentText sx={{ color: 'grey.600', fontSize: '.9rem', mb: .5 }}>
                                2. Scroll down the list of options, then tap Add to Home Screen.
                            </DialogContentText>
                            <DialogContentText sx={{ color: 'grey.600', fontSize: '.9rem', mb: .5 }}>
                                3. The Agave Community icon will then appear on your iPhone or iPad.
                            </DialogContentText>
                        </Box>
                    </TabPanel>
                    <TabPanel value="2" sx={{ px: 1 }}>
                        <Box minHeight={150}>
                            <DialogContentText sx={{ color: 'grey.600', fontSize: '.9rem', mb: .5 }}>
                                1. While viewing the website, tap the Add Button in the Menu
                            </DialogContentText>
                            <DialogContentText sx={{ color: 'grey.600', fontSize: '.9rem', mb: .5 }}>
                                2. The Agave Community icon will then appear on your Android device.
                            </DialogContentText>
                        </Box>
                    </TabPanel>
                    <TabPanel value="3" sx={{ px: 1 }}>
                        <Box>
                            <DialogContentText sx={{ color: 'grey.600', fontSize: '.9rem', mb: 1 }}>
                                While viewing the website, tap the Install Button in the Address Bar:
                            </DialogContentText>
                            <Box width='100%' height={288} position='relative' borderRadius={8} overflow='hidden'>
                                <ImageWithFallback src={chromePng} alt={'Image displaying the Install Prompt'}
                                                   style={{ objectFit: 'contain' }} fill
                                />
                            </Box>
                        </Box>
                    </TabPanel>
                </TabContext>
            </Box>
        </SettingsDialog>
    );
}

export default InstallAppDialog;