// =================================================================
interface CustomPaletteColor {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    600: string;
    700: string;
    800: string;
    900: string;
    main: string;
    contrastText: string;
}

declare module "@mui/material/styles" {
    interface Palette {
        paste: CustomPaletteColor;
        marron: CustomPaletteColor;
        beige: CustomPaletteColor;
    }

    interface PaletteOptions {
        paste: CustomPaletteColor;
        marron: CustomPaletteColor;
        beige: CustomPaletteColor;
    }
}
// =================================================================

export const primary = {
    50: "#bbd3bd",
    100: "#b0ccb3",
    200: "#9dc2a0",
    300: "#88af8b",
    400: "#7A9F7D",
    600: "#6b8e6e",
    700: "#5c755e",
    800: "#3f4a40",
    900: "#323a32",
    main: "#7A9F7D",
    contrastText: "#FFFFFF",
};

export const secondary = {
    100: "#d09fcc",
    200: "#bb90b7",
    300: "#9f7a9c",
    400: "#89749b",
    500: "#7f6f8d",
    600: "#7b688b",
    700: "#6c5e78",
    800: "#5a5062",
    900: "#3b373f",
    main: "#7b688e",
    dark: "#3b373f",
};

export const beige = {
    50: "#e5dbcf",
    100: "#e1d5c7",
    200: "#c7bcaf",
    300: "#b2a99c",
    400: "#b0a89b",
    600: "#9f9689",
    700: "#c9a87c",
    800: "#b0956d",
    900: "#a1845e",
    main: "#b0a89b",
    contrastText: "#151515",
}

export const warning = {
    100: "#FFF8E5",
    main: "#FFCD4E",
    contrastText: "#FFFFFF",
};

export const success = {
    100: "#E7F9ED",
    200: "#C2F1D1",
    300: "#99E8B3",
    400: "#52D77E",
    500: "#33D067",
    600: "#2ECB5F",
    700: "#27C454",
    800: "#20BE4A",
    900: "#0b7724",
    main: "rgb(51, 208, 103)",
};

export const error = {
    100: "#FFEAEA",
    200: "#FFCBCB",
    300: "#FFA9A9",
    400: "#FF6D6D",
    500: "#FF5353",
    600: "#FF4C4C",
    700: "#FF4242",
    800: "#FF3939",
    900: "#FF2929",
    main: "#E94560",
};

export const blue = {
    50: "#f3f5f9",
    100: "#DBF0FE",
    200: "#B8DEFE",
    300: "#94C9FE",
    400: "#7AB6FD",
    500: "#4E97FD",
    600: "#3975D9",
    700: "#2756B6",
    800: "#183C92",
    900: "#0E2979",
    main: "#4E97FD",
    contrastText: "#FFFFFF",
};

export const marron = {
    50: "#f3f5f9",
    100: "#F6F2ED",
    200: "#F8DBD1",
    300: "#EBBCB3",
    400: "#D89C98",
    600: "#A3545C",
    700: "#883948",
    800: "#6E2438",
    900: "#5B162F",
    main: "#BE7374",
    contrastText: "#FFFFFF",
};

export const paste = {
    50: "#F5F5F5",
    100: "#DDFBF1",
    200: "#BDF7E8",
    300: "#97E8DA",
    400: "#76D2CA",
    600: "#36929A",
    700: "#257181",
    800: "#175368",
    900: "#0E3D56",
    main: "#4BB4B4",
    contrastText: "#FFFFFF",
};

export const mono = {
    50: "#ffffff",
    100: "#f3f3f3",
    200: "#d5d5d5",
    300: "#bbbbbb",
    400: "#9d9d9d",
    600: "#727272",
    700: "#696969",
    800: "#464646",
    900: "#3a3a3a",
    main: "#FFFFFF",
    contrastText: "#000000"
}

export const grey = {
    900: "#2B3445", // Main Text
    800: "#373F50", // Paragraph
    700: "#4B566B",
    600: "#7D879C", // Low Priority form Title/Text
    500: "#AEB4BE",
    400: "#DAE1E7", // Border
    300: "#E3E9EF",
    200: "#F3F5F9", // Line Stroke
    100: "#F6F9FC",
};

export const themeColors = {
    error,
    warning,
    success,
    secondary,
    beige: { ...beige },
    grey: { ...grey },
    info: { ...blue },
    divider: grey[200],
    paste: { ...paste },
    marron: { ...marron },
    background: { default: grey[100] },
    text: { primary: grey[900], secondary: grey[800], disabled: grey[400] },
};