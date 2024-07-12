import { FC, useState } from 'react';
import { Card, CardProps, CardHeader, Avatar, IconButton, IconButtonProps, CardContent, Collapse, styled } from '@mui/material';
import { Paragraph, Small } from 'components/Typography';

import BuildCircleOutlinedIcon from '@mui/icons-material/BuildCircleOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ExpandButton = styled((props: { expand: boolean } & IconButtonProps ) => {
    const { expand, ...other } = props;
    return <IconButton {...other} ><ExpandMoreIcon /></IconButton>;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: theme.spacing(2),
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

interface TechnicianNotesProps extends CardProps { completedBy: string | null, description: string | null }

const TechnicianNotes: FC<TechnicianNotesProps> = ({ completedBy, description, ...props }) => {

    const [expand, setExpand] = useState(false);
    const handleExpandClick = () => { setExpand(!expand) };

    return(
        <Card {...props}>
            <CardHeader avatar={<Avatar sx={{ bgcolor: 'secondary.main' }}>
                                {completedBy ? completedBy.charAt(0) : <BuildCircleOutlinedIcon/>}
                                </Avatar>}
                        title={completedBy ? `From ${completedBy}` : 'From Technician'}
                        subheader={<Small>{'View Description'}</Small>}
                        action={<ExpandButton expand={expand} onClick={handleExpandClick}/>}
            />
            <Collapse in={expand} timeout="auto" unmountOnExit>
                <CardContent>

                    <Paragraph>
                        { description ?? 'No description given.' }
                    </Paragraph>
                </CardContent>
            </Collapse>
        </Card>
    );
}

export default TechnicianNotes;