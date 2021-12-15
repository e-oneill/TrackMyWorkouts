import React from "react";

// Date and Time Imports
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import StaticDatePicker from "@mui/lab/StaticDatePicker";
import locale from "date-fns/locale/en-IE";
import TimePicker from "@mui/lab/TimePicker";

// Material UI Components
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";

//React-Router-Dom
import { Link as RouterLink } from "react-router-dom";

//Firebase Details
import { FirebaseContext } from "../../config/firebase";
import { collection, query, onSnapshot, doc, addDoc, getDoc, where, deleteDoc } from "firebase/firestore";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: "40vw",
  maxWidth: "80vw",
  bgcolor: "background.paper",
  border: "3x solid #000",
  boxShadow: 6000,
  p: 4
};

const style2 = {
  display: 'grid',
  justifyContent: "center",
  // marginLeft: 'auto'
  // minWidth: "80vw",
  // maxWidth: "80vw",
  // transform: "translate(-50%, -50%)",
  // bgcolor: "background.paper",
  // border: "12px solid #000",
  // boxShadow: 6000,
  // p: 4
};

class Calendar extends React.Component {
  static contextType = FirebaseContext;
  constructor(props) {
    super(props);
    let date = new Date();
    let dateString = "";
    dateString =
      date.getFullYear() + " " + (date.getMonth() + 1) + " " + date.getDate();
    this.state = {
      user: this.props.user,
      date: date,
      dateString: dateString,
      workouts: [],
      userWorkouts: [],
      workout: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.switchStartModalState = this.switchStartModalState.bind(this);
    this.openModal = this.openModal.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleWorkoutChange = this.handleWorkoutChange.bind(this);
    this.scheduleWorkout = this.scheduleWorkout.bind(this);
    this.getUserWorkouts = this.getUserWorkouts.bind(this);
  }

  handleChange(newDate) {
    let dateString =
      newDate.getFullYear() +
      " " +
      (newDate.getMonth() + 1) +
      " " +
      newDate.getDate();
    this.setState({ date: newDate, dateString: dateString }, () => this.getUserWorkouts() );
    
    // this.switchStartModalState();
  }

  handleWorkoutChange(event) {
    this.setState({ workout: event.target.value });
  }

  openModal() {
    this.setState({ scheduleWorkoutModal: true });
  }

  handleClose() {
    this.setState({ scheduleWorkoutModal: false });
  }

  handleOpen() {
    this.setState({ scheduleWorkoutModal: false });
  }

  switchStartModalState() {
    this.setState({ scheduleWorkoutModal: !this.state.scheduleWorkout });
  }


  //Firebase Pull to get User Information

  //This function is called when the date is changed. It carries out a database pull.
  //The snapshot is created so that the record of workouts is live and real time
  //If the query returns null, we set the state to an empty array.
  async getUserWorkouts() {
    // console.log("Function called. Date: " + this.state.dateString );
    const userRef = doc(this.context.database, "users", this.context.user.uid);
    const q2 = query(
      collection(this.context.database, "user-workouts"),
      where("user", "==", userRef),
      where("dateString", "==", this.state.dateString)
    );
    // this.setState({userWorkouts: []})
    const unsubscribe2 = onSnapshot(q2,  (querySnapshot) => {
      const userWorkouts = [];
      // console.log(querySnapshot);
      querySnapshot.forEach( async (doc) => {
        let data = doc.data();
        data.id = doc.id;
        
        // const workoutRef = doc(this.context.database, "workouts", data.workout)
        const workoutSnap = await getDoc(data.workout)
        const workout = workoutSnap.data();
        // console.log(workout);
        data.name = workout.name
        data.targetMuscleGroup = workout.targetMuscleGroup
        userWorkouts.push(data);
        this.setState({ userWorkouts: userWorkouts }
          // , () =>     console.log(this.state.userWorkouts)
          );
      });

      
    }, this.setState({userWorkouts: []}));
  }

  async componentDidMount() {
    this.setState({ creator: this.context.user.uid });
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
      // console.log(workouts)
      this.setState(
        { workouts: workouts }
        // , () => console.log(this.state.workouts)
      );
    });
    this.getUserWorkouts();
  }

  //Firebase Push to scheduleWorkout
  async scheduleWorkout() {
    // console.log(this.state.workout)
    const workout = this.state.workouts[this.state.workout];
    const exercises = workout.exercises;
    const workoutRef = doc(this.context.database, "workouts", workout.id);
    // console.log(workoutRef)
    const userRef = doc(this.context.database, "users", this.context.user.uid);
    exercises.forEach((exercise) => {
      const sets = [];
      for (let i = 0; i < workout.sets; i++) {
        let set = {};
        set.reps = exercise.reps;
        set.weight = 0;
        sets.push(set);
      }
      exercise.sets = sets;
    });

    const userWorkout = await addDoc(
      collection(this.context.database, "user-workouts"),
      {
        completed: false,
        date: this.state.date,
        dateString: this.state.dateString,
        exercises: exercises,
        user: userRef,
        workout: workoutRef
      }
    );
    // this.switchStartModalState();
    console.log("User Workout added to database: " + userWorkout.id);
    this.handleClose();
    // console.log(exercises)
  }

  async deleteWorkout(id) {
    // console.log(id)
    const docRef = doc(this.context.database, "user-workouts", id)
    await deleteDoc(docRef);
    this.getUserWorkouts();
  }

  render() {
    return (
      // Div for Entire Page
      <div style={{ display: "grid", justifyContent: "center", marginBottom: 66 }}>
        {/* // Card For Entire Page */}
        <Card
          sx={{
            // width: 320,
            maxWidth: "90vw",
            // padding: 1,
            margin: 1,
            display: "grid",
            justifyContent: "center"
          }}
        >
          {/* Calendar Component */}
          <LocalizationProvider dateAdapter={AdapterDateFns} locale={locale}>
            {/* <Paper style={{ overflow: "auto" }}> */}
            <StaticDatePicker
              orientation="portrait"
              openTo="day"
              value={this.state.date}
              onChange={this.handleChange}
              renderInput={(params) => <TextField {...params} />}
            />
            {/* Modal which will schedule workout */}
            <Modal
              open={this.state.scheduleWorkoutModal}
              onClose={this.handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              {/* Allow the Modal to fade in */}
              <Fade in={this.state.scheduleWorkoutModal}>
                <Box sx={style}>
                  {/* Card for the options within Box */}
                  {/* <Card
                    sx={{
                      width: 280,
                      maxWidth: "90vw",
                      padding: 1,
                      margin: 1,
                      display: "grid",
                      justifyContent: "center"
                    }}
                  > */}
                    <Grid container spacing={0.5} style={{ marginTop: "1em" }}>
                      <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="demo-simple-select-label">
                          Select Workout
                        </InputLabel>
                        <Select
                          label="Select Workout"
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={this.state.workout}
                          onChange={this.handleWorkoutChange}
                        >
                          {this.state.workouts.map((workout, index) => (
                            <MenuItem value={index}>{workout.name}</MenuItem>
                          ))}
                        </Select>
                        <TimePicker
                          value={this.state.date}
                          onChange={this.handleChange}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </FormControl>
                      {/* Grid for Buttons to confirm/cancel (close Modal) */}
                      <Grid item xs={12} style={{ display: "flex", gap: 1 }}>
                        <Button
                          size="small"
                          margin="center"
                          onClick={this.scheduleWorkout}
                          variant="contained"
                          style={{ float: "center" }}
                          color="success"
                          endIcon={<CheckIcon />}
                        >
                          Confirm
                        </Button>
                        <Button
                          size="small"
                          margin="center"
                          onClick={this.handleClose}
                          variant="contained"
                          style={{ float: "center" }}
                          color="error"
                          endIcon={<DeleteIcon />}
                        >
                          Cancel
                        </Button>
                      </Grid>
                    </Grid>
                  {/* </Card> */}
                </Box>
              </Fade>
            </Modal>
          </LocalizationProvider>

          {/* Conditional Rendering section to display User Workouts on a certain day: */}
          
            
              <div className="WorkoutInfo" style={style2}>
              <Card
              sx={{
                    width: 480,
                    // minWidth: '87%',
                    maxWidth: "75vw",
                    padding: 1,
                    margin: 1,
                    display: "grid",
                    justifyContent: "center"
              }}
            >
                {(this.state.userWorkouts.length > 0) && (
                  <div>
                  <Typography variant="button" style={{fontWeight: 750}}gutterBottom>
                    {(this.state.userWorkouts.length > 1)
                    ? "Workouts" : "Workout"}
                    
                  </Typography>
                  {this.state.userWorkouts.map((workout) => (
                    <div id={workout.id} style={{maxWidth: '80vw', marginBottom: 4, display:'flex', gap: 4, alignItems: 'center'}}>
                      <Typography variant="button" >
                        {workout.name}
                      </Typography>
                      <RouterLink to={`workout/${workout.id}`} color="white">
                      <Button size="small" variant="contained" color="success">
                        Start
                      </Button>
                      </RouterLink>
                      <Button size="small" variant="contained" color="error" onClick={() => this.deleteWorkout(workout.id)}>
                        Delete
                      </Button>
                    </div>
                    ))}
                  </div>
                )}

                {(!this.state.userWorkouts.length > 0) && (
                  <Typography variant="button" display="block" gutterBottom>
                    No Workouts Booked
                  </Typography>
                )}
              
              </Card>
            </div>
          <div style={{display: 'grid', justifyItems: 'center'}}>
          {/* A button is required to schedule workouts.  */}
          <Button
            color="success"
            variant="contained"
            onClick={this.switchStartModalState}
            sx={{
              width: 500,
              maxWidth: "80vw",
              
              padding: 1,
              margin: 1,
              // marginLeft: "3vw",
              display: "grid",
              justifyContent: "center",
              p: 1
            }}
          >
            Schedule Workout
          </Button>
          </div>
        </Card>
      </div>
    );
  }
}

export default Calendar;
