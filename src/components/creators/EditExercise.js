import React from "react"
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from '@mui/material/Select'; 
import MenuItem from '@mui/material/MenuItem';
import ListSubheader from '@mui/material/ListSubheader';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import {FirebaseContext} from "../../config/firebase";

const inputStyle = {
  backgroundColor: 'white',
  marginBottom: '.5em',
  width: '85vw',
  marginLeft: 1
}

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw',
  display: 'flex',
  justifyContent: 'center',
  backgroundColor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 24,
  padding: 12,
}

class EditExercise extends React.Component
{
  static contextType = FirebaseContext
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      id: this.props.exercise.id,
      exerciseName: this.props.exercise.name,
      dominantMuscle: this.props.exercise.dominantMuscle,
      synergisticMuscle: "",
      exerciseGuide: this.props.exercise.exerciseGuide,
      exerciseTutorial: "",
      exerciseSubType: this.props.exercise.exerciseSubType,
      img: "",
      openDialog: false,
      exercises: []
    }

    this.handleTextBoxChange = this.handleTextBoxChange.bind(this);
    this.handleMuscleChange = this.handleMuscleChange.bind(this);
    this.changeDialogState = this.changeDialogState.bind(this);
    // this.createExercise = this.createExercise.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.updateExercise = this.updateExercise.bind(this);
    this.deleteExercise = this.deleteExercise.bind(this);
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

  handleClose() {
    this.setState({open: !this.state.open})
  }

  async updateExercise() {
    const docRef = doc(this.context.database, "exercises", this.state.id);
    await updateDoc(docRef, {
      name: this.state.exerciseName,
      dominantMuscle: this.state.dominantMuscle,
      exerciseGuide: this.state.exerciseGuide,
      exerciseSubType: this.state.exerciseSubType,
      exerciseType: 'resistance'
    })

    this.setState({open: false})
  }

  async deleteExercise() {
    const docRef = doc(this.context.database, "exercises", this.state.id);
    this.setState({open: false})
    await deleteDoc(docRef).catch((error) =>{
      console.log(error);
    });

    
  }

  render() {
    return (
      <div>
      <Button onClick={this.handleClose}>
        Edit
      </Button>
      <Modal
        open={this.state.open}
        onClose={this.handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
      <Box style={modalStyle}>
        <Paper style={{margin: 2}}>
        <Typography variant='h5' style={{paddingTop: 6, paddingLeft: 8, marginBottom: '.5em'}}>
            Edit Exercise
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
          <div style={{display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 8}}>
          <Button 
            variant="contained" color="success" 
            onClick={this.updateExercise}
            >
            Save Exercise
          </Button>
          <Button 
            variant="contained" color="error" 
          
            onClick={this.deleteExercise}
            >
            Delete Exercise
          </Button>
          </div>
          </Paper>
      </Box>
      </Modal>
      </div>
    )
  }
}

export default EditExercise;