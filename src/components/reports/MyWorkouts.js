import React from "react"

import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';

import {FirebaseContext} from "../../config/firebase";
import { collection, query, onSnapshot, doc, getDoc, where  } from "firebase/firestore";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));



const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

// const handleChange = (panel) => (event, newExpanded) => {
//   console.log(this.state.expanded)
  
//   // this.setState({expanded: newExpanded ? panel : false});
// }

// let workoutsFetched = false;

class MyWorkouts extends React.Component
{
  static contextType = FirebaseContext;
  constructor(props) {
    super(props);
    this.state = {
      workouts: [],
      expanded: ''
    }
    this.handleChange = this.handleChange.bind(this);

    // const tableHead =  {

    // }
  }

  handleChange(panel)
  {
    if (panel === this.state.expanded)
    {
      panel = false
    }

    this.setState({expanded: panel})
  }

  async componentDidMount() {
    const userRef = await doc(this.context.database, "users", this.context.user.uid)
    // console.log(this.state.dateString);

     //This is a complicated database pull
    //This is three nested database calls, that combine documents from the:
    //user-workouts, workouts and exercises collection.
    //This is like a three-table SQL join, at the end of which we have a user workout record with all the info we need
    let workouts = [];
    const q = query(collection(this.context.database, "user-workouts"), where("user", "==", userRef), where("completed", "==", true));
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      
      // console.log(querySnapshot)
      querySnapshot.forEach(async (doc) => 
      {
          // console.log(doc);
          let data = doc.data();
          data.id = doc.id;
          let date = new Date()
          date.setTime(data.date.seconds * 1000);
          data.date.date = date;
          let workoutRef = data.workout
          let workoutSnap = await getDoc(workoutRef)
          let workout = workoutSnap.data();
          // console.log(workout)
          data.workout = workout
          data.workout.ref = workoutRef
          let newExercises = []
          for (let i = 0; i < data.exercises.length; i++)
          {
            let exerciseSnap = await getDoc(data.exercises[i].exerciseId)
            let exercise = exerciseSnap.data()
            exercise.sets = data.exercises[i].sets
            exercise.exerciseId = data.exercises[i].exerciseId
            newExercises.push(exercise)
            // console.log(newExercises)
          }
          data.exercises = newExercises
          // console.log(newExercises)
          workouts.push(data);
            this.setState({workouts: workouts}
              // , () => console.log(this.state.workouts)
              )
          
        

      });
      // console.log("Snapshot done")
      
    });
    // this.setState({creator: this.context.user.uid})
    
    
    // console.log(this.state.workouts)
  }

  async componentDidUpdate() {

  }

  


  render() {
    return (
      <div>
        <Accordion id="header" expanded={false} >
          <MuiAccordionSummary aria-controls="panel1d-content" id="panel1d-header">
            <Typography style={{cursor: 'default', width: 200, paddingLeft: '1.25em', marginRight: 6}}>Workout</Typography>
            <Typography style={{width: 120, marginRight: 6}}>Target</Typography>
            <Typography style={{width: 120, marginRight: 6}}>Date</Typography>
            
          </MuiAccordionSummary>

        </Accordion>
        {this.state.workouts.map((userWorkout) => (
          <Accordion id={userWorkout.id} expanded={this.state.expanded === userWorkout.id} onChange={() => this.handleChange(userWorkout.id)}>
          <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
            <Typography style={{width: 200, marginRight: 6}}>{userWorkout.workout.name}</Typography>
            <Typography style={{width: 120, marginRight: 6}}>{userWorkout.workout.targetMuscleGroup}</Typography>
            <Typography style={{width: 120, marginRight: 6}}>{userWorkout.date.date.getDate()}/{userWorkout.date.date.getMonth()}/{userWorkout.date.date.getFullYear()}</Typography>
            
          </AccordionSummary>
          <AccordionDetails>
            <Table size="small">
              <TableHead>
                <TableRow style={{}}>
                  <TableCell style={{width: 150, fontWeight: 600}}>
                    Exercise
                  </TableCell>
                  
                  <TableCell style={{width: 110, fontWeight: 600}}>
                    Target Muscle
                  </TableCell>
                  <TableCell style={{width: 50, fontWeight: 600, display: (userWorkout.exercises[0].sets.length >= 1) ? '' : 'none'}}>
                    Set 1
                  </TableCell>
                  <TableCell style={{width: 50, fontWeight: 600, display: (userWorkout.exercises[0].sets.length >= 2) ? '' : 'none'}}>
                    Set 2
                  </TableCell>
                  <TableCell style={{width: 50, fontWeight: 600, display: (userWorkout.exercises[0].sets.length >= 3) ? '' : 'none'}}>
                    Set 3
                  </TableCell>
                  <TableCell style={{width: 50, fontWeight: 600, display: (userWorkout.exercises[0].sets.length >= 4) ? '' : 'none'}}>
                    Set 4
                  </TableCell>
                  <TableCell style={{width: 50, fontWeight: 600, display: (userWorkout.exercises[0].sets.length >= 5) ? '' : 'none'}}>
                    Set 5
                  </TableCell>
                  <TableCell style={{width: 50, fontWeight: 600, display: (userWorkout.exercises[0].sets.length >= 6) ? '' : 'none'}}>
                    Set 6
                  </TableCell>
                  <TableCell style={{width: 50, fontWeight: 600, display: (userWorkout.exercises[0].sets.length >= 7) ? '' : 'none'}}>
                    Set 7
                  </TableCell>
                  <TableCell style={{width: 50, fontWeight: 600, display: (userWorkout.exercises[0].sets.length >= 8) ? '' : 'none'}}>
                    Set 8
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {userWorkout.exercises.map((exercise) => (
                <TableRow>
                  <TableCell style={{width: 150}}>
                  {exercise.name} 
                  </TableCell>
                  <TableCell style={{width: 110}}>
                  {exercise.dominantMuscle} 
                  </TableCell>
                  {exercise.sets.map((set, index) => (
                  <TableCell style={{width: 50}}>
                    {set.weight} kg
                  </TableCell>
                ))}
                </TableRow>
                
              ))}
              </TableBody>
            </Table>
          </AccordionDetails>
        </Accordion>
        ))}
      </div>
    )
  }
}

export default MyWorkouts;