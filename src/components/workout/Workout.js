import React, {useState, useContext, useEffect, useRef} from "react"
import {
  useParams
} from "react-router-dom";
import {FirebaseContext} from "../../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import WorkoutCard from "./WorkoutCard";
import RestTimer from './RestTimer';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

const timerBox = {
  position: 'absolute',
  marginTop: 8,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 150,
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 24,
  padding: 4,
  // overflow: 'scroll',
}

//This component is a functional component so we can access the useParams() funciton with React-Router-Dom
export default function Workout(props) {
  //Initialising state - user appears to be unnecessary
    // const [user, setUser] = useState(props.user)
    const [userWorkout, setUserWorkout] = useState();
    const [workout, setWorkout] = useState();
    const [exercisesArr, setExercisesArr] = useState([]);
    const [currSet, setCurrSet] = useState(1);
    const [currExercise, setCurrExercise] = useState(0);
    const [exercise, setExercise] = useState("");
    const [timer, setTimer] = useState(false);


    // let loadCompleted = false;
    let loadInProgress = useRef(false);
    // let exercisesLookup = false;
    const firebase = useContext(FirebaseContext)

    // The database ID of the user-workout is taken from the URL
    let {userWorkoutId} = useParams()
    const userWorkoutRef = doc(firebase.database, "user-workouts", userWorkoutId);
    async function getUserWorkout() {
      loadInProgress = true;
      // We get the reference of the user-workout in the database
      

      const docSnap = await getDoc(userWorkoutRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserWorkout(data);
        // console.log(data);
        //Calling the function to get the workout
        await getWorkout(data.workout)
        
      }

      


    }
    async function getWorkout(workoutId) {
      // loadInProgress = true;
      const docRef = workoutId;
      // console.log(userWorkout);
      const docSnap = await getDoc(docRef);
      //We try to use the data only if getDoc receives a response. In this case we have verified that the user has an associated record in the database
      if (docSnap.exists()) {
        // console.log(docRef);
        const data = docSnap.data();
        //We now set State inside this response, as we need to combine the records of the user from the Auth and the DB
        setWorkout(data);
        // console.log(data);
      } else {
      }
      
    }

    async function getExercises () {
      // console.log(userWorkout.exercises)
      let newExercisesArr = exercisesArr;
      
      for (let i = 0; i < userWorkout.exercises.length; i++)
      {
        let docRef = userWorkout.exercises[i].exerciseId;
          // console.log(userWorkout.exercises[i]);
          let docSnap = await getDoc(docRef);
          let data = docSnap.data();
          data.reps = workout.exercises[i].reps;
          data.weight = userWorkout.exercises[i].weight;
          newExercisesArr = newExercisesArr.concat(data);
          // console.log(docSnap.data());
          
        

        // console.log(docRef);
      }
      console.log(newExercisesArr);
      setExercisesArr(newExercisesArr);
      setExercise(newExercisesArr[currExercise].name);
      
      // loadCompleted = true;
      loadInProgress = false;
    }

    //Two code block below initialise the call of the functions above.
    //If workout is not set, we start the API call get getting the UserWorkout
    
    if (!workout)
    {
      getUserWorkout();
      
    }

    // getUserWorkout() calls getWorkout, which sets workout = true
    // useEffect checks each render if there is no load currently in progress 
    // If no load is in progress and workout = true, we init the exercises functions
    useEffect(() => {
      //
      if (!loadInProgress.current && workout) {
        loadInProgress.current = true;
        getExercises()
    }
    })

    function saveExercise(details, set, exerciseIndex) {

      userWorkout.exercises[exerciseIndex].sets[set - 1].weight = details.weight;
      userWorkout.exercises[exerciseIndex].sets[set - 1].reps = details.reps;
      let newExercisesArr = exercisesArr
      newExercisesArr[exerciseIndex].weight = details.weight;
      setExercisesArr(newExercisesArr);
      // console.log(exercisesArr)
      if (currSet + 1 <= workout.sets)
      {
        setCurrSet(currSet + 1)
      }
      else if (currExercise === exercisesArr.length - 1)
      {
        console.log("Workout Complete")
        // setCurrExercise(currExercise+1);
        setExercise("None")
      }
      else 
      {
        // console.log("Exercise Finished")
        setCurrExercise(currExercise+1);
        setExercise(exercisesArr[currExercise+1].name)
        setCurrSet(1)
      }

      setTimer(true)
      // console.log(currSet, currExercise, exercise)
    }

    async function finishWorkout() {
      userWorkout.completed = true;
      console.log(userWorkout);

      updateDoc(userWorkoutRef, userWorkout)
    }
    
    function startTimer() {
      setTimer(!timer)
    }
    
    return(
      <div style={{display: 'flex', justifyContent: 'center', marginBottom: '70px'}}>
        {(workout && exercisesArr.length > 0) ? 
        <div style={{display: 'grid', justifyContent: 'center'}}>
          <Typography variant="h5" style={{display: 'flex', justifyContent: 'center'}}>
            {workout.name}
            </Typography>
            {exercisesArr.map((s, index) => {
              return (
                <WorkoutCard id={"card-" + index } exerciseIndex={index} currExercise={exercise} saveExercise={saveExercise} currSet={currSet} details={s} sets={workout.sets} />
              )
            })}
          
          {exercise === "None" &&
            <Button variant="contained" onClick={finishWorkout}>
            Finish Workout
            </Button>
          }
          
          <Modal
          open={timer}
          onClose={startTimer}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description">
          <Box style={timerBox}>
            <Paper>
              {/* <Typography>Timer</Typography> */}
              <RestTimer duration={60}  startTimer={startTimer}/>
            </Paper>
          </Box>
        </Modal>  
        </div> :
        <div>
          Loading workout...
        </div>}
      </div>
    )
}

// export default Workout;