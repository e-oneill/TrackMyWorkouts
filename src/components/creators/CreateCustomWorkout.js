import React from "react";

import CreateUserWorkout from "../user-workouts/CreateUserWorkout.js";
import WorkoutSelector from "./WorkoutSelector"

import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import locale from 'date-fns/locale/en-IE';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { Redirect } from 'react-router-dom';
import {FirebaseContext} from "../../config/firebase";
import { collection, doc, addDoc, query, where, onSnapshot, deleteDoc  } from "firebase/firestore";

const inputStyle = {
  
}

class CreateCustomWorkout extends React.Component
{
  static contextType = FirebaseContext;
  constructor(props) {
    super(props)
    let date = new Date();
    let dateString = "";
    dateString = date.getFullYear() + " " +  (date.getMonth()+1) + " " + date.getDate();
    this.state = {
      date : date,
      dateString: dateString,
      sets: null,
      workout: null,
      exercises: [],
      userWorkout: ""
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleTextBoxChange = this.handleTextBoxChange.bind(this);
    this.startWorkout = this.startWorkout.bind(this);
    this.updateWorkout = this.updateWorkout.bind(this);
  }

  handleChange(newDate) {
    this.setState({date: newDate})
  }

  handleTextBoxChange(e) {
    if (e.target.id === "sets")
    {
      if (e.target.value > 0)
      {
        this.setState({sets: e.target.value});
      }
    }
  }

  updateWorkout(workout,exercises) {
    this.setState({workout: workout, exercises: exercises})
  }

  async startWorkout() 
  {
    // console.log(this.state)
    const exercises = this.state.exercises
    const workoutRef = doc(this.context.database, "workouts", this.state.workout.id);
    const userRef = doc(this.context.database, "users", this.context.user.uid)
    exercises.forEach(exercise => {
      const sets = [];
      for (let i = 0; i < this.state.workout.sets; i++)
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
      dateString: this.state.dateString,
      exercises: exercises,
      user: userRef,
      workout: workoutRef
    });
    // this.switchStartModalState();
    console.log("User Workout added to database: " + userWorkout.id)
    this.setState({redirect: true, userWorkout: userWorkout.id})
    // window.location.assign("workout/" + userWorkout.id);
  }

  render() {
    return (
      
      <Grid container spacing={2} style={{marginBottom: 66}} >
        {(this.state.redirect) && <Redirect push to={`workout/${this.state.userWorkout}`} />}
        <Grid item xs={12} style={{display: 'flex', justifyContent: 'center'}}>
        <Typography variant="h4">
        {/* Start a Workout */}
        </Typography>
        </Grid>
        <Grid item xs={12} sm={12} lg={12} style={{display:'flex', flexDirection: 'column', gap: 8}}>
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={locale}>
            <DateTimePicker
              label="Pick a Date and Time"
              value={this.state.date}
              onChange={this.handleChange}
              
              renderInput={(params) => <TextField fullWidth style={inputStyle} {...params} />}
            />
        </ LocalizationProvider>
        
        </Grid>
        <Grid item xs={12} sm={12}>
          <WorkoutSelector updateWorkout={this.updateWorkout} />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={this.startWorkout} disabled={(this.state.workout) ? false : true } color="success" style={{width: '100%'}}>
              Start Workout
          </Button>
        </Grid>
      </Grid>
    )
  }
}

export default CreateCustomWorkout