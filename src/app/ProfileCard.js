import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
    root: {
        height: 400,
        width: 600,
    },
});

export default function ProfileCard({id, url, first, last, bio, button, clickHandler}) {
    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardMedia
                component="img"
                alt={`${first} ${last}`}
                image={url}
                height="200"
                width="200"
                onClick={clickHandler}
            />
            <CardContent>
                <Typography variant="h4">
                    {first} {last}
                </Typography >
                <Typography variant="p">
                    {bio}
                </Typography >
            </CardContent>
            <CardActions>
                {button}
            </CardActions>
        </Card>
    );
}
