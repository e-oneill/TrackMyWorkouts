import React from "react";
import Grid from  "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

import {
  Link as RouterLink
} from "react-router-dom";

const gridStyle = {
  height: 150,
  marginBottom: 12
}

const cardPaper = {
  height: '80%',
  padding: 20,
  paddingLeft: 40,
  paddingRight: 40,
  marginTB: 10
}

const cardHeader = {
  width: '100%',
  padding: 1,
  paddingLeft: 5,
  display: 'flex',
  justifyContent: 'center',
  // gap: '2em',
  fontWeight: 550
}

const cardText = {
  fontSize: '1.15em',
  display: 'flex',
  justifyContent: 'center'
}

class CreationCenter extends React.Component
{
  render () {
    return (
      <Grid container spacing={2} style={{marginBottom: 64}}>
        <Grid item xs={12} sm={6}  style={gridStyle}>
          <Link component={RouterLink} to="/create-workout" style={{textDecoration: 'none'}}>
          <Paper style={cardPaper}>
          <Typography style={cardHeader}>
            Create Workout
          </Typography>
          <Typography style={cardText}>
            Create a new workout, that users will be able to select to do.
          </Typography >
          </Paper>
          </Link>
        </Grid>
        <Grid item xs={12} sm={6} style={gridStyle}>
          <Link component={RouterLink} to="/create-exercise" style={{textDecoration: 'none'}}>
          <Paper style={cardPaper}>
          <Typography style={cardHeader}>
            Create Exercise
          </Typography>
          <Typography style={cardText}>
            Create a new exercise, that will be available when creating a workout.
          </Typography >
          </Paper>
          </Link>
        </Grid>
        <Grid item xs={12} sm={6} style={gridStyle}>
          <Link component={RouterLink} to="/edit-exercises" style={{textDecoration: 'none'}}>
          <Paper style={cardPaper}>
          <Typography style={cardHeader}>
            Edit Exercises
          </Typography>
          <Typography style={cardText}>
            Make changes to the existing exercises.
          </Typography >
          </Paper>
          </Link>
        </Grid>
        <Grid item xs={12} sm={6} style={gridStyle}>
          <Link component={RouterLink} to="/edit-workouts" style={{textDecoration: 'none'}}>
          <Paper style={cardPaper}>
          <Typography style={cardHeader}>
            Edit Workouts
          </Typography>
          <Typography style={cardText}>
            Make changes to the existing workouts.
          </Typography >
          </Paper>
          </Link>
        </Grid>
      </Grid>
    )
  }
}

export default CreationCenter;