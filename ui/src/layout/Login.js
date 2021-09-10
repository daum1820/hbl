import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Grid } from '@material-ui/core';
import bgImage from 'assets/img/sidebar.jpeg';
import Common from './Common';


const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  }
}));


export default function Login(props) {
  const classes = useStyles();
  return (
    <div>
      <Common />
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={9} className={classes.image} style={{ backgroundImage: 'url(' + bgImage + ')' }}/>
        <Grid item xs={12} sm={8} md={3} component={Paper} elevation={6} square>
          <div className={classes.paper}>
            {props.children}
          </div>
        </Grid>
      </Grid>
    </div>
  );
}