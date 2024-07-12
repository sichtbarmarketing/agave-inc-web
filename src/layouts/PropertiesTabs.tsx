import { FC } from "react";

import { useMediaQuery, useTheme, CircularProgress, Box, Alert } from '@mui/material';
import Tab from '@mui/material/Tab';
import Stack from '@mui/material/Stack';
import TabList, { TabListProps } from '@mui/lab/TabList';

import { PropertySchema } from "utils/api/yup";
import * as yup from "yup";

interface PropertiesTabsProps extends TabListProps {
    overviewValue: string,
    properties?: yup.InferType<typeof PropertySchema>[],
    validating: boolean,
    loading: boolean,
    error: any,
}

const PropertiesTabs: FC<PropertiesTabsProps> = ({overviewValue, properties = [], validating, loading, error, ...props }) => {

    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

    return(
        <Stack direction='column' flexWrap='wrap' sx={{ gap: '1em' }} flex={'1 1 100%'} maxWidth={{ xs: '100%', sm: 'calc(30% - 1em)' }}>
            <TabList orientation={isSmall ? 'horizontal' : 'vertical'} aria-label="Properties Tab List"
                     variant="scrollable" allowScrollButtonsMobile
                     sx={{ maxWidth: '100%', '.MuiTabs-scrollButtons.Mui-disabled': { opacity: 0.3 }}} {...props}
            >
                <Tab label="Overview" value={overviewValue}/>
                {properties.map((p) => <Tab key={p.id} label={p.name} value={p.id}/>)}
                {(validating || loading ) ? <Tab label='•••' disabled/> : null }
                {(error ) ? <Tab label='⚠' disabled/> : null }
            </TabList>
        </Stack>
    );
}

export default PropertiesTabs;