import { FC, ReactNode } from 'react';
import { Stack, StackProps} from '@mui/material';
import { Span } from 'components/Typography';
import { format } from "date-fns";

import HandymanOutlinedIcon from '@mui/icons-material/HandymanOutlined';
import HomeRepairServiceOutlinedIcon from '@mui/icons-material/HomeRepairServiceOutlined';
import SellOutlinedIcon from '@mui/icons-material/SellOutlined';

import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined';

type WorkOrderProps = {
    materials: string | null, labor: string | null, total: string | null,
    technician: string | null, date: string | null, jobNum: string | null,
}
const WorkOrderTable: FC<WorkOrderProps> = ({ materials, labor, total, technician, date, jobNum }: WorkOrderProps) => {

    return(
        <Stack direction='column' position='relative' p={2} sx={{ gap: '2em' }}>
            <Stack direction='row' flexWrap='wrap' justifyContent='space-around' sx={{ gap: '1em' }}>
                <WorkOrderItem label={'Materials'} value={materials} icon={<HomeRepairServiceOutlinedIcon color={'disabled'} />} />
                <WorkOrderItem label={'Labor'} value={labor} icon={<HandymanOutlinedIcon color={'disabled'} />} />
                <WorkOrderItem label={'Total'} value={total} icon={<SellOutlinedIcon color={'disabled'} />} />
            </Stack>
            <Stack direction='row' flexWrap='wrap' justifyContent='space-around' sx={{ gap: '1em' }}>
                <WorkOrderItem label={'Technician'} value={technician} icon={<BadgeOutlinedIcon color={'disabled'} />} />
                <WorkOrderItem label={'Completed'} icon={<EventAvailableOutlinedIcon color={'disabled'} />}
                               value={date ? format(new Date(date), 'MM/dd/yyyy') : null}
                />
                <WorkOrderItem label={'Job ID'} value={jobNum} icon={<NumbersOutlinedIcon color={'disabled'} />} />
            </Stack>
        </Stack>
    )
}

const WorkOrderItem: FC<{label: string, value: string | null, icon: ReactNode} & StackProps> = ({label, value = '---', icon, ...props}) => {
    return(
        <Stack flex='1 0' sx={{ gap: '0.5em' }} {...props}>
            <Stack direction='row' flexWrap='nowrap' alignItems='center' sx={{ gap: '0.5em' }}>
                {icon}
                <Span color={'grey.600'}>{label}</Span>
            </Stack>
            <Span color={'grey.800'} fontWeight={'800'} fontSize={'1.3em'}>{value}</Span>
        </Stack>
    );
}

export default WorkOrderTable;