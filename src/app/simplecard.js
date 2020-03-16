import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
    root: {
        maxWidth: 345,
    },
});

export default function SimpleCard({id, url, first, last, button}) {
    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardMedia
                component="img"
                alt={`${first} ${last}`}
                image={url}
                height="300"
            />
            <CardActions>
                {button}
            </CardActions>
        </Card>
    );
}
