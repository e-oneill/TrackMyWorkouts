import React from "react";
import DateTimePicker from '@mui/lab/DateTimePicker';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import locale from 'date-fns/locale/en-IE';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import {FirebaseContext} from "../../config/firebase";
import { collection, doc, addDoc, query, where, onSnapshot, deleteDoc  } from "firebase/firestore";

const smallModalStyle = {
  position: 'absolute',
  marginTop: 8,
  top: '20%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw',
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 24,
  padding: 4,
  display: 'flex', 
  justifyContent: 'center', 
  flexDirection: 'column', 
  gap: 12
}

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
    this.switchStartModalState = this.switchStartModalState.bind(this);
  }

  handleChange(newDate) {
    
    this.setState({date: newDate})

    
  }

  switchStartModalState() {
    this.setState({startWorkoutOpen: !this.state.startWorkoutOpen})
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
    this.switchStartModalState();
    console.log("User Workout added to database: " + userWorkout.id)
  }

  render() {
    return (
      <div>
        <Button onClick={this.switchStartModalState}>
                      Start Workout
        </Button>
        <Modal
            open={this.state.startWorkoutOpen}
            onClose={this.switchStartModalState}
            aria-labelledby={this.props.workout.id}
            aria-describedby={this.props.workout.name}>
            <Box style={smallModalStyle}>
              <Paper style={{padding: 12, display: 'flex', 
                    justifyContent: 'center', 
                    flexDirection: 'column', 
                    gap: 12}}>
            <Typography variant="h4">
              Schedule Workout
            </Typography>
            <Typography variant="h5">
            
            {this.props.workout.name}
            </Typography>
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
        </Paper>
      </Box>
      </Modal>
      </div>
    )
  }
}

export default CreateUserWorkout;