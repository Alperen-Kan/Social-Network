import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
    root: {
        height: 200,
        width: 150,
    },
});

export default function OnlineCard({id, url, first, last, clickHandler}) {
    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardMedia
                component="img"
                alt={`${first} ${last}`}
                image={url}
                height="100"
                onClick={clickHandler}
            />
            <CardContent>
                <Typography variant="h6">
                    {first}
                    <br />
                    {last}
                </Typography >
            </CardContent>
        </Card>
    );
}
