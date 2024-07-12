import { FC } from 'react';
import {Stack, Box, Paper, Avatar, Divider} from '@mui/material';
import { SvgIconComponent } from "@mui/icons-material";

import { Paragraph, H3, H2 } from "components/Typography";

type WeeklyReportSummaryProps = {
    summArr: { key: string, label: string, value: string | null, icon: SvgIconComponent }[]
};

const WeeklyReportSummary: FC<WeeklyReportSummaryProps> = ({ summArr }) => {

    return(
        <Stack direction='column' gap='0.5rem' my={2}>
            {summArr.map(({ key, label, value, icon}) =>
                <WeeklyReportItem key={key} title={label} text={value} Icon={icon}/>
            )}
        </Stack>
    );
}

const WeeklyReportItem: FC<{title: string, text: string | null, Icon: SvgIconComponent}> = ({title, text, Icon}) => {
    return(
        <Stack direction='row' px={1} py={1} gap='0.8rem'
               borderRadius={(theme) => theme.spacing(3)}
        >
            <Avatar>
                <Icon color='primary'/>
            </Avatar>
            <Box flexGrow={1}>
                <H3 mt={0.7}>{title}</H3>
                <Divider sx={{ mt: 0.5, mb: 2 }}/>
                <Paragraph color={text ? 'grey.800' : 'grey.600'}>{text ?? 'No Information Provided.'}</Paragraph>
            </Box>
        </Stack>
    );
}

export default WeeklyReportSummary;