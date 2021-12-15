import React from "react";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Grid from '@mui/material/Grid';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import {FirebaseContext} from "../config/firebase";
import { collection, query, onSnapshot  } from "firebase/firestore";


import MyAccordion from "./accordion"

const inputStyle = {
  backgroundColor: "white",
  marginBottom: ".5em",
  width: "40vw"
};


const modalStyle = {
  position: 'absolute',
  marginTop: 8,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw',
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 24,
  padding: 4,
  overflow: 'scroll',
  // overflowY: 'auto'
}

class Workouts extends React.Component {
  static contextType = FirebaseContext;

  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      search: "",
      muscleGroup: "",
      workouts: [],
      startWorkoutOpen: false
    };
    this.handleSearchBoxChange = this.handleSearchBoxChange.bind(this)
    this.handleMuscleGroupChange = this.handleMuscleGroupChange.bind(this)
    this.switchModalState = this.switchModalState.bind(this);
    // console.log(this.props.user)
  }

  async componentDidMount() {
    this.setState({creator: this.context.user.uid})
    const q = query(collection(this.context.database, "workouts"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const workouts = [];
      querySnapshot.forEach((doc) => {
          let data = doc.data();
          data.id = doc.id;
          
          workouts.push(data);
      });
      // console.log("Exercises: ", exercises.join(", "));
      // if (exercises.length !== this.state.exercises.length)
      // {
        console.log(workouts)
        this.setState({workouts: workouts})
      // }
    });
    
  }
  handleMuscleGroupChange(e) {
    this.setState({muscleGroup: e.target.value})
  }

  
  handleSearchBoxChange(e) {
    if (e.target.id === "search")
    {
      this.setState({search: e.target.value})
    }
  }

  filterByMuscleGroup(muscleGroup) {
    return function (workout) {
      if (muscleGroup !== "")
      {
        return workout.targetMuscleGroup === muscleGroup
      }
      else
      {
        return true;
      }
    }
  }

  


  filterBySearch(search)
  {
    return function (workout) {
      if (search !== "")
      {
        return (
          workout.name.toLowerCase().includes(search.toLowerCase()) ||
          workout.targetMuscleGroup.toLowerCase().includes(search.toLowerCase())
          
        )
      }
      else return true;
    }
  }

  handleChangePage(event, newPage) {
    this.setState({page: newPage})
  }


  switchModalState() {
    this.setState({workoutCreateOpen: !this.state.workoutCreateOpen})
  }
  
  render() {
    return (
      <div style={{ display: "grid", justifyContent: "center", marginBottom: 66, width: "100%" }}>
        <Card
          sx={{
            width: 600,
            maxWidth: "90vw",
            padding: 1,
            margin: 1,
            display: "grid",
            justifyContent: "center"
          }}
        >
          {/* <Typography  variant="h5">
        My Workouts  
        </Typography> */}
        <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            id="search"
            label="Search Workouts"
            type="search"
            onChange={this.handleSearchBoxChange}
          />
          </Grid>
          <Grid item xs={6}>
          <FormControl fullWidth variant="outlined" required>
            <InputLabel htmlFor="outlined-adornment-password">
              Target Muscle Group
            </InputLabel>
            <Select
              labelId="primary-muscle-select-label"
              id="muscle-group-select"
              value={this.state.muscleGroup}
              label="Target Muscle Group"
              onChange={this.handleMuscleGroupChange}
            >
               <MenuItem value="">All</MenuItem>
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
          
          <Grid item xs={12}>
          <Accordion disabled
          
          >
            <AccordionSummary
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography sx={{ width: "45%", flexShrink: 0 }}>
                Workout 
              </Typography>
              <Typography
                sx={{ color: "text.secondary", width: "35%", flexShrink: 0 }}
              >
                Target Muscle
              </Typography>
              <Typography
                sx={{ color: "text.secondary", width: "20%", flexShrink: 0 }}
              >
                Duration
              </Typography>
            </AccordionSummary>
          </Accordion>
          {this.state.workouts.filter(this.filterBySearch(this.state.search))
          .filter(this.filterByMuscleGroup(this.state.muscleGroup)).map((workout) => (
            < MyAccordion workout={workout} />
          )
            
          )}

          
          </Grid>
          </Grid>
        </Card>
      </div>
    );
  }
}

export default Workouts;
