import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));

export default function BasicTextFields(props) {
    const classes = useStyles();

    return (
        <form className={classes.root} autoComplete="off">
            <TextField id="outlined-basic" label={props.label} onChange={props.change} variant="outlined" />
        </form>
    );
}
