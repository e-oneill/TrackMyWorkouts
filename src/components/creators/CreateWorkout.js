import React from "react";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { DataGrid } from '@mui/x-data-grid';
import { Redirect } from 'react-router-dom';
import CreateExercise from "./CreateExercise";

import {FirebaseContext} from "../../config/firebase";
import { collection, doc, addDoc, query, where, onSnapshot  } from "firebase/firestore";

const inputStyle = {
  backgroundColor: 'white',
  // marginBottom: '.5em'
  // width: '85vw'
}

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  overflowY: 'auto'
}

const columns = [
  {field: 'name', headerName: 'Name', width: 200},
  {field: 'dominantMuscle', headerName: 'Target Muscle', width: 170},
  {field: 'exerciseSubType', headerName: 'Exercise Type', width: 170}
]

class CreateWorkout extends React.Component 
{
  static contextType = FirebaseContext;
  constructor(props) {
    super(props);
    this.state = {
      workoutName: "",
      workoutLength: 45,
      workoutSets: 3,
      workoutReps: 10,
      muscleGroup: '',
      intensity: '',
      creator: '',
      exercises: [],
      selectedExercises: [],
      exerciseCreateOpen: false,
      redirect: false
    }

    this.handleTextBoxChange = this.handleTextBoxChange.bind(this);
    this.handleMuscleGroupChange = this.handleMuscleGroupChange.bind(this);
    this.handleIntensityChange = this.handleIntensityChange.bind(this);
    this.createWorkout = this.createWorkout.bind(this);
    this.openModal = this.openModal.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleTextBoxChange(e) {
    if (e.target.id === "workout-name")
    {
      this.setState({workoutName: e.target.value})
    }
    if (e.target.id === "workout-length")
    {
      this.setState({workoutLength: e.target.value})
    }
    
    if (e.target.id === "workout-sets")
    {
      let sets = e.target.value;
      if (sets < 1) { sets = 1}
      if (sets > 8) { sets = 8}
      this.setState({workoutSets: sets})
    }

    if (e.target.id === "workout-reps")
    {
      let reps = e.target.value;
      if (reps < 1) { reps = 1}
      this.setState({workoutReps: reps})
    }
  }

  handleMuscleGroupChange(e) {
    this.setState({muscleGroup: e.target.value})
  }

  handleIntensityChange(e) {
    this.setState({intensity: e.target.value})
  }

  async createWorkout() {
    if (this.props.modalCloser)
    {
      this.props.modalCloser();
    }
    console.log("Creating workout...")
    let exercises = [];

    for (let i = 0; i < this.state.selectedExercises.length; i++)
    {
      let exerciseMap = {};
      let docRef = doc(this.context.database, "exercises", this.state.selectedExercises[i]);
      exerciseMap['exerciseId'] = docRef
      exerciseMap['reps'] = this.state.workoutReps
      exercises.push(exerciseMap);
    }

    // console.log(exercises)

    const docRef = await addDoc(collection(this.context.database, "workouts"), {
      name: this.state.workoutName,
      sets: this.state.workoutSets,
      length: this.state.workoutLength,
      intensity: this.state.intensity,
      targetMuscleGroup: this.state.muscleGroup,
      exercises: exercises
    })

    console.log("Document added to Firestore: " + docRef.id);
    this.setState({redirect: true})
  }

  valuetext(value) {
    return `${value}°C`;
  }

  openModal() {
    this.setState({exerciseCreateOpen: true})
  }

  handleClose() {
    this.setState({exerciseCreateOpen: false})
  }

  async componentDidMount() {
    this.setState({creator: this.context.user.uid})
    const q = query(collection(this.context.database, "exercises"), where("exerciseType", "==", "resistance"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const exercises = [];
      querySnapshot.forEach((doc) => {
          let data = doc.data();
          data.id = doc.id;
          // console.log(doc.id);
          exercises.push(data);
      });
      // console.log("Exercises: ", exercises.join(", "));
      if (exercises.length !== this.state.exercises.length)
      {
        this.setState({exercises: exercises})
      }
    });

    
  }
  

  render() {
    return (
      <div style={{display:'flex', marginBottom: 66, justifyContent: 'center', height: '100%'}}>
      {(this.state.redirect) && <Redirect push to={`edit-workouts`} />}
      <Grid container spacing={1}>
        <Grid item xs={12}>
        {/* <Typography variant="h4" style={{display:'flex', justifyContent: 'center'}}>
          Create a Workout
        </Typography> */}
        </Grid>
        <Grid item xs={8}>
          <FormControl sx={inputStyle} fullWidth variant="outlined" required>
            <InputLabel htmlFor="outlined-name">Workout Name</InputLabel>
            <OutlinedInput
              id="workout-name"
              type="text"
              
              value={this.state.workoutName}
              onChange={this.handleTextBoxChange}
              label="Workout Name"
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
        <FormControl sx={inputStyle} fullWidth variant="outlined" required>
            <InputLabel htmlFor="outlined-adornment-password">Target Muscle Group</InputLabel>
            <Select
              labelId="primary-muscle-select-label"
              id="muscle-group-select"
              value={this.state.muscleGroup}
              label="Target Muscle Group"
              onChange={this.handleMuscleGroupChange}
              >
                <MenuItem value="Full Body">Full Body</MenuItem>
                <MenuItem value="Chest">Chest</MenuItem>
                <MenuItem value="Shoulders">Shoulders</MenuItem>
                <MenuItem value="Back">Back</MenuItem>
                <MenuItem value="Arms">Arms</MenuItem>
                <MenuItem value="Core">Core</MenuItem>
                <MenuItem value="Legs">Legs</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl sx={inputStyle} fullWidth variant="outlined" required>
            {/* <InputLabel htmlFor="outlined-name">Workout Length (mins)</InputLabel>
            <OutlinedInput
              id="workout-length"
              type="number"
              value={this.state.workoutLength}
              onChange={this.handleTextBoxChange}
              label="Workout Length (mins)"
            /> */}
            <Typography>
              Length (Minutes)
            </Typography>
            <Slider
              id="workout-length"
              aria-label="Length"
              style={{width: '95%'}}
              defaultValue={45}
              getAriaValueText={this.valuetext}
              valueLabelDisplay="auto"
              step={15}
              marks
              min={0}
              max={180}
              onChange={this.handleTextBoxChange}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={2}>
          <FormControl sx={inputStyle} fullWidth variant="outlined" required>
            <InputLabel htmlFor="outlined-name">Sets</InputLabel>
            <OutlinedInput
              id="workout-sets"
              type="number"
              value={this.state.workoutSets}
              onChange={this.handleTextBoxChange}
              label="Sets"
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={2}>
          <FormControl sx={inputStyle} fullWidth variant="outlined" required>
            <InputLabel htmlFor="outlined-name">Reps</InputLabel>
            <OutlinedInput
              id="workout-reps"
              type="number"
              value={this.state.workoutReps}
              onChange={this.handleTextBoxChange}
              label="Reps"
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
        <FormControl sx={inputStyle} fullWidth variant="outlined" required>
            <InputLabel htmlFor="outlined-adornment-password">Workout Intensity</InputLabel>
            <Select
              labelId="primary-muscle-select-label"
              id="workout-intensity"
              value={this.state.intensity}
              label="Workout Intensity"
              onChange={this.handleIntensityChange}
              >
                <MenuItem value="1">Light</MenuItem>
                <MenuItem value="2">Medium</MenuItem>
                <MenuItem value="3">Heavy</MenuItem>
                <MenuItem value="4">Extreme</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          {/* <Typography variant="h6" style={{marginTop: 4, display:'flex', justifyContent: 'center'}}>
            Exercises
          </Typography> */}
          {(this.state.exercises.length > 0) &&
          <div>
          <DataGrid
          rows={this.state.exercises}
          columns={columns}
          autoHeight
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          onSelectionModelChange={(selectedId) => {
            this.setState({selectedExercises: selectedId}, () => console.log(this.state.selectedExercises))
          }}
          />
          </div>
          }
          
        </Grid>
        <Grid item xs={12} style={{display:'flex', justifyContent: 'center', marginTop: 4, marginBottom: 8}}>
        <Button variant="contained" onClick={this.openModal} style={{marginRight: 4}}>
          Add New Exercise
        </Button>
        
        <Modal
          open={this.state.exerciseCreateOpen}
          onClose={this.handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description">
            <Box style={modalStyle}>
              <CreateExercise />
            </Box>
        </Modal>
        <Button variant="contained" color="success" 
        disabled={(this.state.workoutName.length > 0 
                    && this.state.muscleGroup.length > 0 
                    && this.state.intensity.length > 0
                    && this.state.selectedExercises.length > 0) ? false : true } 
        onClick={this.createWorkout}>
          Create Workout
        </Button>
        </Grid>
      </Grid>
      </div>
    )
  }
}

export default CreateWorkout;