import React, { FC, ChangeEvent } from 'react';
import { format } from 'date-fns';
import { Box, Stack, Button, InputAdornment, FormControl, InputLabel, OutlinedInput } from '@mui/material';

import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

interface WorkHistoryFiltersProps {
    search: string,
    searchControl: (event: ChangeEvent<HTMLInputElement>) => void,
    to: Date, from: Date,
    calendarControl: (value?: boolean) => void,
}

const WorkHistoryFilters: FC<WorkHistoryFiltersProps> = ({ search, searchControl, to, from, calendarControl}) => {

    return(
        <Box mb={3}>
            <Stack direction='row' justifyContent='space-between' mb={1} gap='0.5em' >
                <FormControl fullWidth>
                    <InputLabel htmlFor="outlined-search" size='small'>Search</InputLabel>
                    <OutlinedInput label='Search' id="outlined-search" sx={{borderRadius: (theme) => theme.spacing(3)}}
                                   endAdornment={<InputAdornment position='end'><SearchOutlinedIcon/></InputAdornment>}
                                   value={search} onChange={searchControl} size='small'
                    />
                </FormControl>
                <Stack direction='row' gap='0.5em' alignItems='center'>
                    <Button variant='outlined' onClick={() => calendarControl(true)}
                            sx={{ borderRadius: (theme) => `${theme.spacing(3)} 0 0 ${theme.spacing(3)}`,
                                color: (theme) => theme.palette.action.active, fontWeight: 400,
                                borderColor: (theme) => theme.palette.action.disabled }}
                    >
                        {format(from, 'MM/dd/yy')}
                    </Button>
                    <Button variant='outlined' onClick={() => calendarControl(true)}
                            sx={{ borderRadius: (theme) => `0 ${theme.spacing(3)} ${theme.spacing(3)} 0`,
                                color: (theme) => theme.palette.action.active, fontWeight: 400,
                                borderColor: (theme) => theme.palette.action.disabled }}
                    >
                        {format(to, 'MM/dd/yy')}
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
}

export default WorkHistoryFilters;