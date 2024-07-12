import React, { FC, useState } from 'react';
import enUS from 'date-fns/locale/en-US';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, differenceInCalendarDays } from 'date-fns';
import {Box, Button, Dialog, DialogProps, DialogActions} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRange, Range } from 'react-date-range';

interface AgaveCalendarProps extends DialogProps {
    range: { start: Date, end: Date },
    onConfirm: (value: {start: Date, end: Date }) => void,
}

const Calendar: FC<AgaveCalendarProps> = ({ range, onConfirm, ...rest }) => {

    const [newRange, setRange] = useState<Range>({ startDate: range.start, endDate: range.end, key: 'selection' });
    const min = (newRange.startDate && newRange.endDate) && (differenceInCalendarDays(newRange.endDate, newRange.startDate) > 0);
    const max = (newRange.startDate && newRange.endDate) && (differenceInCalendarDays(newRange.endDate, newRange.startDate) <= 90);

    const handleConfirm = () => {
        if (!(newRange.startDate && newRange.endDate) || !min || !max) return;

        onConfirm({ start: newRange.startDate, end: newRange.endDate });
    }

    return(
        <Dialog {...rest}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enUS}>
                <DateRange
                    editableDateInputs={true}
                    onChange={(item) => setRange(item.selection)}
                    moveRangeOnFirstSelection={false}
                    ranges={[newRange]}
                />
            </LocalizationProvider>
            <DialogActions sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Box>
                    {!max && <Box color={'error.main'}>{'Select at most 90 days'}</Box>}
                    {!min && <Box color={'error.main'}>{'Select at least 2 days'}</Box>}
                </Box>
                <Button onClick={handleConfirm} color='primary' disabled={!(min && max)} sx={{ justifySelf: 'end' }}>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    )
};

export default Calendar;