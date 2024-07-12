import { FC, ReactNode } from 'react';
import { ListItemIcon, ListItemButton, ListItemText, ListItemButtonProps } from "@mui/material";

interface UserSettingsProps extends ListItemButtonProps { primary: string, secondary: string, Icon: ReactNode, Badge?: ReactNode }
const UserSettingsItem: FC<UserSettingsProps> = ({ primary, secondary, Icon, Badge, ...rest }) => {

    return(
        <ListItemButton sx={{ bgcolor: 'grey.200', borderRadius: (theme) => theme.spacing(3), p: 3}} {...rest}>
            <ListItemIcon>{Icon}</ListItemIcon>
            <ListItemText primary={primary} secondary={secondary} primaryTypographyProps={{ fontSize: '1rem', fontWeight: 600 }}/>
            <ListItemIcon sx={{ justifyContent: 'flex-end' }}>
                {Badge}
            </ListItemIcon>
        </ListItemButton>
    );
}

export default UserSettingsItem;