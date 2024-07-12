import Image, { ImageProps } from 'next/image'
import { useEffect, useState, SyntheticEvent } from 'react'

import fallbackImage from "@public/assets/images/logo-agave.png";

interface ImageWithFallbackProps extends ImageProps {
    fallback?: ImageProps['src'],
    imgObjectFit?: "contain" | "cover" | "fill" | "none" | "scale-down",
}

const ImageWithFallback = ({ fallback = fallbackImage, imgObjectFit = "cover", alt, src, ...props }: ImageWithFallbackProps) => {
    const [error, setError] = useState<SyntheticEvent<HTMLImageElement, Event> | null>(null)

    useEffect(() => {
        setError(null)
    }, [src])

    return (
        <Image
            alt={alt}
            onError={setError}
            style={{ objectFit: error ? "contain" : imgObjectFit }}
            src={error ? fallbackImage : src}
            {...props}
        />
    )
}
export default ImageWithFallback;