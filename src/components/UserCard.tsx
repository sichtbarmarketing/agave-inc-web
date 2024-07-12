import React, { FC } from 'react';
import { Card, CardProps, CardContent, CardMedia, Typography, Avatar } from "@mui/material";
import coverPhoto from "@public/assets/agave-graphics/dark-green/agave.svg";

interface UserCardProps extends CardProps {
    displayName?: string | null,
    photoURL?: string | null,
    email?: string | null,
    phoneNumber?: string | null,
}
const UserCard: FC<UserCardProps> = ({ photoURL = null, displayName = null, email = null, phoneNumber = null, ...props }) => {

    return(
        <Card {...props}>
            <CardMedia image={coverPhoto.src} component={'div'} sx={{ minHeight: 150, backgroundColor: '#c6e4cd' }}/>
            <CardContent sx={{ position: 'relative', px: 4, pt: 6, pb: 4 }}>

                <Avatar src={photoURL ? photoURL : undefined}
                        sx={{ width: 64, height: 64, position: 'absolute', top: -32 }}
                >
                    { (displayName) ? displayName.charAt(0) : undefined }
                </Avatar>

                <Typography gutterBottom variant="h5" component="div">
                    { (displayName) ? displayName : "Your Account" }
                </Typography>

                <Typography variant="body2" color="text.secondary">
                    { (email ? email : null) }
                </Typography>

                <Typography variant="body2" color="text.secondary">
                    { (phoneNumber ? phoneNumber : null) }
                </Typography>

            </CardContent>
        </Card>
    )
}

export default UserCard;