import { FC, ReactNode } from "react";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material"

const FullScreenVideo = styled('video')({
    width: '100%',
    objectFit: 'contain'
});

const defaultGradient = 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(255,255,255,0.664) 59%, rgba(255,255,255,1) 95%)';

type BackgroundVideoProps = {
    source: string;
    coverAlpha?: number;
    elementId?: string;
    gradient?: boolean;
    children?: ReactNode;
}

const BackgroundVideo: FC<BackgroundVideoProps> = (props, context) => {
    const { elementId, source, coverAlpha = 0, gradient = false, children} = props;

    return (
        <Box id={elementId ?? ""} sx={{ display: 'block', position: 'relative' }}>
            <FullScreenVideo src={source} autoPlay playsInline loop muted/>
            <Box sx={
                {
                    width: '100%', height: '100%',
                    position: 'absolute',
                    top: '0%', left: '0%', bottom: '0%', right: '0%',
                    backgroundColor: `rgba(0, 0, 0, ${coverAlpha})`,
                    background: `${gradient ? defaultGradient : ""}`,
                }
            }>
                {children}
            </Box>
        </Box>
    );
}

export default BackgroundVideo;