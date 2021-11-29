import React from "react";
import DateTimePicker from '@mui/lab/DateTimePicker';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import locale from 'date-fns/locale/en-IE';
import Button from '@mui/material/Button';

import {FirebaseContext} from "../../config/firebase";
import { collection, doc, addDoc, query, where, onSnapshot, deleteDoc  } from "firebase/firestore";

class CreateUserWorkout extends React.Component 
{
  static contextType = FirebaseContext;
  constructor(props)
  {
    super(props);
    this.state = {
      date : new Date()
    }

    
    this.handleChange = this.handleChange.bind(this);
    this.scheduleWorkout = this.scheduleWorkout.bind(this);
  }

  handleChange(newDate) {
    
    this.setState({date: newDate})

    
  }

  async scheduleWorkout() {
    const exercises = this.props.workout.exercises
    const workoutRef = doc(this.context.database, "workouts", this.props.workout.id);
    const userRef = doc(this.context.database, "users", this.context.user.uid)

    exercises.forEach(exercise => {
      const sets = [];
      for (let i = 0; i < this.props.workout.sets; i++)
      {
        let set = {}
        set.reps = exercise.reps
        set.weight = 0
        sets.push(set)
      }
      exercise.sets = sets;
    })

    // console.log(workoutRef)
    // console.log(userRef)
    // console.log(exercises)

    const userWorkout = await addDoc(collection(this.context.database, "user-workouts"), {
      completed: false,
      date: this.state.date,
      exercises: exercises,
      user: userRef,
      workout: workoutRef
    });
    this.props.modalStateChanger();
    console.log("User Workout added to database: " + userWorkout.id)
  }

  render() {
    return (
      <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: 12}}>
        {/* <Grid container spacing={1} >
          <Grid item xs={12}> */}
            <Typography variant="h4">
              Schedule Workout
            </Typography>
          {/* </Grid>
          <Grid item xs={12}> */}
            <Typography variant="h5">
            {this.props.workout.name}
            </Typography>
          {/* </Grid>
          <Grid item xs={12}> */}
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={locale}>
            <DateTimePicker
              label="Pick a Date and Time"
              value={this.state.date}
              onChange={this.handleChange}
              
              renderInput={(params) => <TextField {...params} />}
            />
            </ LocalizationProvider>
            <Button variant="contained" color="success" onClick={this.scheduleWorkout}>
              Schedule Workout
            </Button>
          {/* </Grid>
          
        </Grid> */}
      </div>
    )
  }
}

export default CreateUserWorkout;