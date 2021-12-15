import React from "react";
// import Logout from "./users/Logout";

// import AppTabBar from "./standard-page-parts/AppTabBar";
// import {
//   BrowserRouter as Router,
//   Switch,
//   Route,
//   Link,
//   useRouteMatch,
//   useParams
// } from "react-router-dom";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import {FirebaseContext} from "../config/firebase";
import { collection, query, doc, getDoc, where, onSnapshot  } from "firebase/firestore";
import Login from "./users/Login";

//This home page exists only to test that the user is being logged in correctly and user is available in props for use elsewhere in application.
import {
  // BrowserRouter as Router,
  // Switch,
  // Route,
  Link as RouterLink
  // useRouteMatch,
  // useParams
} from "react-router-dom";

const homeButton = {
  width: "100%",
  textDecoration: "none"
};

class Home extends React.Component {
  static contextType = FirebaseContext;
  
  constructor(props) {
    super(props);
    let date = new Date();
    let dateString = "";
    dateString = date.getFullYear() + " " +  (date.getMonth()+1) + " " + date.getDate();
    this.state = {
      user: this.props.user,
      workouts: [],
      date: date,
      dateString: dateString,
      fetchComplete: false
    };
    
    // console.log(this.props.user)
  }

  async componentDidMount() {
    this.setState({creator: this.context.user.uid})
    const userRef = await doc(this.context.database, "users", this.context.user.uid)
    // console.log(this.state.dateString);
    const q = query(collection(this.context.database, "user-workouts"), where("user", "==", userRef), where("dateString", "==", this.state.dateString), where("completed", "==", false));
    const unsubscribe = await onSnapshot(q, (querySnapshot) => {
      const workouts = [];
      querySnapshot.forEach((doc) => {
          let data = doc.data();
          data.id = doc.id;
          
          
         workouts.push(data);
      });

      
      // console.log("Exercises: ", exercises.join(", "));
      // if (exercises.length !== this.state.exercises.length)
      // {
        this.setState({workouts: workouts})
      // }
    });

    
  }

  async componentDidUpdate() {
    if (this.state.workouts[0] && !this.state.workouts[0].name)
    {
    const docSnap = await getDoc(this.state.workouts[0].workout);
    // console.log(docSnap.data())
    let newWorkouts = []
    newWorkouts.push(this.state.workouts[0]);
    newWorkouts[0].name = docSnap.data().name
    // console.log(newWorkouts[0])
    this.setState({workouts: newWorkouts, fetchCompleted: true })
    
    // this.state.workouts[0].push(docSnap)
    }
  }

  render() {
    return (
      <div style={{ display: "grid", justifyContent: "center", marginBottom: 64 }}>
          <Card
            sx={{
              width: 320,
              maxWidth: "90vw",
              padding: 1,
              margin: 1,
              display: "grid",
              justifyContent: "center"
            }}
          >
            <CardMedia
              component="img"
              height="180"
              style={{width: '95%' , marginLeft: 7, marginBottom: 8}}
              src="/imgs/tmw_logo.JPG"
              // {tmw_logo}
            />
            
            {(this.state.workouts[0]) &&
            
            
            <Card style={{width: '95%', marginLeft: 7, backgroundColor: '#629365', color: 'white'}} >
            <Grid container >
              <Grid item xs={12} style={{display: 'flex', justifyContent: 'center'}}>
            <Typography
              sx={{ fontSize: '2em', color: 'white' }}
              color="text.secondary"
            >
              Today's Workout:
            </Typography>
            </Grid>
            <Grid item xs={12} style={{display: 'flex', justifyContent: 'center'}}>
            <Typography sx={{ fontSize: '1.5em', mb: 1, color: 'white' }} color="text.secondary">
              {this.state.workouts[0].name}
              </Typography>
            </Grid>
            <Grid item xs={12} style={{display: 'flex', justifyContent: 'center'}}>
            <RouterLink to={`workout/${this.state.workouts[0].id}`} style={{textDecoration: 'none', display: 'flex', justifyContent: 'center'}}>
              <Button variant="contained" color="success" size="medium" style={{textDecoration: 'none', marginBottom: 8}}>
                Start Now
              </Button>
            </RouterLink>
              </Grid>
            </Grid>
          </Card>
            }
            <CardActions>
            <RouterLink to="/create-custom-workout" style={homeButton}>
              <Button
                orientation="vertical"
                variant="contained"
                size="large"
                fullWidth
              >
                Start a Workout
              </Button>
              </RouterLink >
            </CardActions>
            <CardActions>
            <RouterLink to="/my-calendar" style={homeButton}>
              <Button
                orientation="vertical"
                variant="contained"
                size="large"
                fullWidth
              >
                My Calendar
              </Button>
            </RouterLink>
            </CardActions>
            <CardActions>
              <RouterLink to="/browse-workouts" style={homeButton}>
                <Button
                  orientation="vertical"
                  variant="contained"
                  size="large"
                  fullWidth
                >
                  Browse Workouts
                </Button>
              </RouterLink>
            </CardActions>
            <CardActions>
            <RouterLink to="/creation-center" style={homeButton}>
              <Button
                orientation="vertical"
                variant="contained"
                size="large"
                fullWidth
              >
                Creation Center
              </Button>
            </RouterLink>
            </CardActions>
            <CardActions>
            <RouterLink to="/my-workouts" style={homeButton}>
              <Button
                orientation="vertical"
                variant="contained"
                size="large"
                fullWidth
              >
                My Workouts
              </Button>
            </RouterLink>
            </CardActions>
          </Card>
         
      </div>
    );
  }
}

export default Home;
