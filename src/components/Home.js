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
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user
    };

    // console.log(this.props.user)
  }
  render() {
    return (
      <div style={{ display: "grid", justifyContent: "center" }}>
        {this.props.user.name ? (
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
              height="200"
              src="/imgs/tmw_logo.JPG"
              // {tmw_logo}
            />
            <Typography variant="h5">Hello {this.props.user.name}!</Typography>
            <Typography
              sx={{ fontSize: 25 }}
              color="text.secondary"
              gutterBottom
            >
              Today's Workout:
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              Upper Body{" "}
              <Button variant="outlined" size="medium">
                Start Workout{" "}
              </Button>
            </Typography>
            <CardActions>
              <Button
                orientation="vertical"
                variant="contained"
                size="large"
                fullWidth
              >
                Custom Workout{" "}
              </Button>
            </CardActions>
            <CardActions>
              <Button
                orientation="vertical"
                variant="contained"
                size="large"
                fullWidth
              >
                My Calendar
              </Button>
            </CardActions>
            <CardActions>
              <RouterLink to="/myworkouts" style={homeButton}>
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
            <CardActions>
              <Button
                orientation="vertical"
                variant="contained"
                size="large"
                fullWidth
              >
                Workout History{" "}
              </Button>
            </CardActions>
          </Card>
        ) : (
          <p>You must be logged in to see this site.</p>
        )}
      </div>
    );
  }
}

export default Home;
