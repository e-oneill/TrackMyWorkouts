import React from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from '@mui/material/Select'; 
import MenuItem from '@mui/material/MenuItem';
import ListSubheader from '@mui/material/ListSubheader';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import {FirebaseContext} from "../../config/firebase";
import { collection, addDoc, query, where, onSnapshot  } from "firebase/firestore";

const cardStyle = {
  display: 'grid',
  justifyContent: 'center',
  backgroundColor: '#e0e0e0', 
  padding: 6,
  paddingBottom: 16,
  paddingTop: 16,
  margin: 4,
  width: '90vw'
}

const inputStyle = {
  backgroundColor: 'white',
  marginBottom: '.5em',
  width: '85vw'
}

class CreateExercise extends React.Component 
{
  static contextType = FirebaseContext;
  constructor(props) {
    super(props);
    this.state = {
      exerciseName: "",
      dominantMuscle: "",
      synergisticMuscle: "",
      exerciseGuide: "",
      exerciseTutorial: "",
      exerciseSubType: "",
      img: "",
      openDialog: false,
      exercises: []
    }

    this.handleTextBoxChange = this.handleTextBoxChange.bind(this);
    this.handleMuscleChange = this.handleMuscleChange.bind(this);
    this.changeDialogState = this.changeDialogState.bind(this);
    this.createExercise = this.createExercise.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
  }

  async componentDidUpdate() {
    const q = query(collection(this.context.database, "exercises"), where("exerciseType", "==", "resistance"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const exercises = [];
      querySnapshot.forEach((doc) => {
          let data = doc.data();
          exercises.push({data});
      });
      // console.log("Exercises: ", exercises.join(", "));
      if (exercises.length !== this.state.exercises.length)
      {
        this.setState({exercises: exercises})
      }
    });

    
  }

  handleTextBoxChange(e){
    if (e.target.id === "exercise-name")
    {
      this.setState({exerciseName: e.target.value})
    }
    if (e.target.id === "exercise-guide")
    {
      this.setState({exerciseGuide: e.target.value})
    }
  }

  handleMuscleChange(e) {
    this.setState({dominantMuscle: e.target.value})
  }

  handleTypeChange(e) {
    this.setState({exerciseSubType: e.target.value})
  }

  changeDialogState() {
    this.setState({openDialog: !this.state.openDialog})
  }

  async createExercise() {
    console.log("Creating Exercise...")
    if (this.props.modalCloser)
    {
      this.props.modalCloser();
    }

    const docRef = await addDoc(collection(this.context.database, "exercises"), {
      name: this.state.exerciseName,
      dominantMuscle: this.state.dominantMuscle,
      exerciseGuide: this.state.exerciseGuide,
      exerciseSubType: this.state.exerciseSubType,
      exerciseType: 'resistance'
    })
    
    console.log("Document added to Firestore: " + docRef.id);
    this.changeDialogState();
    
  }

  render() {
    return (
      <div style={{display:'grid', justifyContent: 'center'}}>
        <Card style={cardStyle}>
          <Typography variant='h5' style={{marginBottom: '.5em'}}>
            Create Exercise
          </Typography>
          <FormControl sx={inputStyle} variant="outlined" required>
            <InputLabel htmlFor="outlined-name">Name</InputLabel>
            <OutlinedInput
              id="exercise-name"
              type="text"
              value={this.state.exerciseName}
              onChange={this.handleTextBoxChange}
              label="Name"
            />
          </FormControl>
          <FormControl sx={inputStyle} variant="outlined" required>
            <InputLabel htmlFor="outlined-adornment-password">Primary Muscle</InputLabel>
            <Select
              labelId="primary-muscle-select-label"
              id="primary-muscle-select"
              value={this.state.dominantMuscle}
              label="Primary Muscle"
              onChange={this.handleMuscleChange}
              >
                <ListSubheader>Shoulders, Chest and Back</ListSubheader>
                <MenuItem value="Shoulders">Shoulders</MenuItem>
                <MenuItem value="Traps">Traps</MenuItem>
                <MenuItem value="Chest">Chest</MenuItem>
                <MenuItem value="Lats">Lats</MenuItem>
                <ListSubheader>Arms</ListSubheader>
                <MenuItem value="Triceps">Triceps</MenuItem>
                <MenuItem value="Biceps">Biceps</MenuItem>
                <ListSubheader>Core</ListSubheader>
                <MenuItem value="Abs">Abs</MenuItem>
                <MenuItem value="Obliques">Obliques</MenuItem>
                <MenuItem value="Spinal Erectors">Spinal Erectors</MenuItem>
                <ListSubheader>Legs</ListSubheader>
                <MenuItem value="Quads">Quads</MenuItem>
                <MenuItem value="Hamstrings">Hamstrings</MenuItem>
                <MenuItem value="Calves">Calves</MenuItem>
                <MenuItem value="Glutes">Glutes</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={inputStyle} variant="outlined" required>
            <InputLabel htmlFor="outlined-adornment-password">Exercise Type</InputLabel>
            <Select
              labelId="primary-muscle-select-label"
              id="primary-muscle-select"
              value={this.state.exerciseSubType}
              label="Exercise Type"
              onChange={this.handleTypeChange}
              >
                
                <MenuItem value="Compound Lift">Compound Lift</MenuItem>
                <MenuItem value="Isolation">Isolation Exercise</MenuItem>
                <MenuItem value="Machine">Machine</MenuItem>
                <MenuItem value="Core">Core</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={inputStyle} variant="outlined" required>
                <TextField
                id="exercise-guide"
                label="Exercise Guide"
                multiline
                rows={4}
                value={this.state.exerciseGuide}
                placeholder="Enter a guide for the exercise here"
                onChange={this.handleTextBoxChange}
              />
          </FormControl>
          <Button variant="contained" color="success" onClick={this.changeDialogState}>
            Create Exercise
          </Button>
        </Card>
        <Dialog
          open={this.state.openDialog}
          onClose={this.changeDialogState}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">
                {"Create new exercise?"}
            </DialogTitle>
            <DialogContent>
              <Typography>
                <b>Exercise Name:</b> {this.state.exerciseName} <br />
              </Typography>
              <Typography>
                <b>Target Muscle:</b> {this.state.dominantMuscle} <br />
              </Typography>
              <Typography>  
                <b>Exercise Guide:</b> {this.state.exerciseGuide} <br />
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.changeDialogState}>Disagree</Button>
              <Button onClick={this.createExercise} autoFocus>
                Agree
              </Button>
            </DialogActions>
        </Dialog>
        
        
      </div>
    )
  }
}

export default CreateExercise;
