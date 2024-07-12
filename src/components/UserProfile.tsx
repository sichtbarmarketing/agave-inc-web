import React, { FC, ReactNode } from 'react';

import {
    Avatar,
    Box,
    BoxProps,
    Button,
    CardMedia,
    Stack,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    IconButton,
    Divider
} from '@mui/material';

import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';

import coverPhoto from "@public/assets/agave-graphics/dark-green/agave.svg";

interface UserProfileProps extends BoxProps {
    photoURL: string | null;
    displayName: string | null;
    children?: ReactNode;
    toggle: (value?: boolean) => void;
}

const UserProfile: FC<UserProfileProps> = ({ photoURL, displayName, children, toggle, ...rest }: UserProfileProps) => {
    return(
        <Box overflow='hidden' sx={{ backgroundColor: '#c6e4cd', borderRadius: (theme) => theme.spacing(3) }} {...rest} >
            <CardMedia image={coverPhoto.src} component={'div'}
                       sx={{ minHeight: 150, position: 'relative' }}
            >
                <Stack width='100%' direction='row' alignItems='center' justifyContent='flex-end' p={2}>
                    <Button variant='contained' color='secondary' startIcon={<AddPhotoAlternateOutlinedIcon/>}
                            sx={{ borderRadius: (theme) => theme.spacing(3) }} onClick={() => toggle(true)}
                    >
                        UPDATE
                    </Button>
                </Stack>
                <Stack width='100%' direction='row' alignItems='center' justifyContent={{xs: 'center', md: 'flex-start'}}
                       sx={{ position: 'absolute', bottom: '-40px' }} px={4}>
                    <Avatar src={photoURL ? photoURL : undefined}
                            sx={{ width: 80, height: 80, position: 'relative', fontSize: '2rem' }}
                    >
                        { (displayName) ? displayName.charAt(0) : undefined }
                    </Avatar>
                </Stack>
            </CardMedia>
            <Box p={3} bgcolor={'grey.200'} borderRadius={(theme) => theme.spacing(3)}>
                <List disablePadding sx={{mt: 4}}>
                    <ListItem>
                        <ListItemText primary='Update Your Profile' primaryTypographyProps={{ fontSize: '1.4rem' }} />
                    </ListItem>
                    <Divider sx={{ borderColor: 'grey.400', mb: 2, mx: 1 }} component='li'/>
                    { children }
                </List>
            </Box>
        </Box>
    );
}

export const UserProfileItem: FC<{ primary: string, secondary: string | null, Icon: any, action: (value?: boolean) => void }> = ({ primary, secondary, Icon, action }) => {

    const handleAction = () => { action(true)  }

    return(
        <ListItem secondaryAction={<IconButton edge="end" aria-label="edit" onClick={handleAction}><EditOutlinedIcon /></IconButton>}>
            <ListItemIcon><Icon /></ListItemIcon>
            <ListItemText primary={primary} primaryTypographyProps={{ fontSize: '1rem', fontWeight: 600 }}
                          secondary={ (secondary) ?? 'Add a display name.' } />
        </ListItem>
    );
}

export default UserProfile;