import React from "react";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Divider from "@material-ui/core/Divider";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import {FirebaseContext} from "../config/firebase";
import { collection, getDoc, query, onSnapshot  } from "firebase/firestore";



const inputStyle = {
  backgroundColor: "white",
  marginBottom: ".5em",
  width: "50vw"
};

class MyAccordion extends React.Component {
  static contextType = FirebaseContext;
  constructor(props) {
    super(props);
    
    this.state = {
      user: this.props.user,
      exercises: this.props.workout.exercises
    };
    
  }
  
  async componentDidMount() {
    // this.setState({creator: this.context.user.uid})
    // const q = query(collection(this.context.database, "exercises"));
    // const unsubscribe = onSnapshot(q, (querySnapshot) => {
    //   const exercises = [];
    //   querySnapshot.forEach((doc) => {
    //       let data = doc.data();
    //       data.id = doc.id;
    //       // console.log(doc.id);
    //       exercises.push(data);
    //   });
    //   console.log(exercises)
    //   // console.log("Exercises: ", exercises.join(", "));
    //     this.setState({exercises: exercises})
      
    // });
    let newExercises = []
    for (let i = 0; i < this.state.exercises.length; i++)
    {
      let exerciseSnap = await getDoc(this.state.exercises[i].exerciseId)
      let exercise = exerciseSnap.data()
      exercise.sets = this.state.exercises[i].sets
      exercise.exerciseId = this.state.exercises[i].exerciseId
      newExercises.push(exercise)
    }

    this.setState({exercises: newExercises}
      // , () => console.log(this.state.exercises)
      )
  }


  
  render() {
    return (
      <Accordion id={this.props.workout.id}>
            <AccordionSummary
              aria-controls="panel2a-content"
              id="panel2a-header"
              fullWidth
              sx={{
                '&:hover': {
                bgcolor: 'primary.dark', // use summary hover background
                color: 'primary.light', // use summary hover color
                }
                }}

            >
              <Typography sx={{ fontSize: 14, width: "50%", flexShrink: 0 }}>
              {this.props.workout.name} 
              </Typography>
              <Typography
                sx={{
                  fontSize: 14,
                  color: "text.secondary",
                  width: "30%",
                  flexShrink: 0
                }}
              >
                {this.props.workout.targetMuscleGroup}

              </Typography>
              <Typography
                sx={{
                  fontSize: 14,
                  color: "text.secondary",
                  width: "33%",
                  flexShrink: 0
                }}
              >
               {this.props.workout.length} Mins
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
            
            <Button size="small" variant="contained" style={{margin: 2}}>Start Workout</Button>
              <Typography sx={{ fontSize: 15 }}>
                Sets: {this.props.workout.sets} Reps: {this.props.workout.exercises[0].reps}
              </Typography>
              <Divider />
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Exercises:</TableCell>
                    <TableCell>Target Muscle:</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                    {this.state.exercises.map((s, index) => (
                    <TableRow key={s.id}>
                      <TableCell>{s.name}</TableCell>
                      <TableCell>{s.dominantMuscle}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

            </AccordionDetails>
          </Accordion>
    );
    
  }
}

export default MyAccordion;
