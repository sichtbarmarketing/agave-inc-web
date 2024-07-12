import { FC } from 'react';

import { Avatar, IconButton, ListItem, ListItemAvatar, ListItemText, Stack, Skeleton } from '@mui/material';
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import { FirebaseStorage, StorageReference } from "@firebase/storage";
import { ref } from "firebase/storage";
import { useDownloadURL } from "react-firebase-hooks/storage";

interface AgaveDetailsProps {
    Icon: any,
    primary: string, secondary?: string,
    email?: string, phone?: string,
    imgURL?: string, storage?: FirebaseStorage
};

const AgaveDetails: FC<AgaveDetailsProps> = ({Icon, primary, secondary, email, phone, imgURL, storage}: AgaveDetailsProps) => {

    return(
        <ListItem secondaryAction={
            <Stack direction='row' justifyContent='flex-end' alignItems='center' gap={'0.2em'}>
                { (email) &&
                    <IconButton aria-label={`${email}`} component='a' href={`mailto:${email}`}>
                        <EmailOutlinedIcon />
                    </IconButton>
                }
                { (phone) &&
                    <IconButton aria-label={`${phone}`} component='a' href={`tel:${phone}`}>
                        <LocalPhoneOutlinedIcon />
                    </IconButton>
                }
            </Stack>
        }>
            {
                (imgURL && storage)
                    ? <AgaveDetailsImage imgURL={imgURL} storage={storage} Icon={Icon} />
                    : <ListItemAvatar>
                        <Avatar alt={'Account Manager Image'} src={undefined} sx={{ bgcolor: 'primary.main' }}>
                            <Icon />
                        </Avatar>
                      </ListItemAvatar>
            }
            <ListItemText
                primary={primary}
                secondary={secondary ?? <Skeleton variant="text" sx={{ fontSize: '1rem', maxWidth: '20ch' }} />}
            />
        </ListItem>
    );
};

const AgaveDetailsImage = ({ imgURL, storage, Icon }: { imgURL: string, storage: FirebaseStorage, Icon: any }) => {

    const refImage: StorageReference = ref(storage, imgURL);
    const [url, loading, error] = useDownloadURL(refImage);

    return(
        <ListItemAvatar>
            <Avatar alt={'Account Manager Image'} src={url} sx={{ bgcolor: 'primary.main' }}>
                <Icon />
            </Avatar>
        </ListItemAvatar>
    );
};

export default AgaveDetails;