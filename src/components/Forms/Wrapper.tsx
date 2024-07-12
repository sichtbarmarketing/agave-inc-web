import { FC } from 'react';
import { styled, Card, CardProps } from '@mui/material'

const fbStyle = { background: "#3B5998", color: "white" };
const googleStyle = { background: "#4285F4", color: "white" };

type WrapperProps = { passwordVisibility?: boolean };

const Wrapper = styled<FC<WrapperProps & CardProps>>(
    ({ children, passwordVisibility, ...rest }) => (
        <Card {...rest}>{children}</Card>
    )
)<CardProps>(({ theme, passwordVisibility }) => ({
    width: 500,
    padding: "2rem 3rem",
    [theme.breakpoints.down("sm")]: { width: "100%" },
    ".passwordEye": {
        color: passwordVisibility
            ? theme.palette.grey[600]
            : theme.palette.grey[400],
    },
    ".facebookButton": { marginBottom: 10, ...fbStyle, "&:hover": fbStyle },
    ".googleButton": { ...googleStyle, "&:hover": googleStyle },
    ".agreement": { marginTop: 12, marginBottom: 24 },
}));

export default Wrapper;