import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(theme => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: 200,
        }
    }
}));

export default function BasicTextFields(props) {
    const classes = useStyles();

    return (
        <form className={classes.root} noValidate autoComplete="off" onKeyDown={props.keyHandler}>
            <TextField
                id="outlined-multiline-static"
                label="Type here"
                multiline
                rows="4"
                variant="outlined"
            />
        </form>
    );
}
