import { FC, ReactNode } from "react";
import { Icon, Stack, StackProps } from "@mui/material";
import { Span } from "components/Typography";
import { SvgIconComponent } from "@mui/icons-material";

type WeeklyReportTableProps = {
    items: { key: string, label: string, value: string | null, icon: SvgIconComponent }[]
};
const WeeklyReportTable: FC<WeeklyReportTableProps> = ({ items }) => {
    return(
        <Stack direction='row' flexWrap='wrap' position='relative' p={2} sx={{ gap: '2em' }}>
            {items.map(({key, label, value, icon}) =>
                <WeeklyReportItem key={key} label={label} value={value ?? '---'} Icon={icon} />
            )}
        </Stack>
    );
}

const WeeklyReportItem: FC<{label: string, value: string | null, Icon: SvgIconComponent} & StackProps> = ({label, value = '---', Icon, ...props}) => {
    return(
        <Stack flex='1 0' sx={{ gap: '0.5em' }} {...props}>
            <Stack direction='row' flexWrap='nowrap' alignItems='center' sx={{ gap: '0.5em' }}>
                <Icon color='disabled' />
                <Span color='grey.600'>{label}</Span>
            </Stack>
            <Span color={'grey.800'} fontWeight={'800'} fontSize={'1.3em'}>{value}</Span>
        </Stack>
    );
}

export default WeeklyReportTable;