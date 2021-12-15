import React from "react";
import { Link as RouterLink} from "react-router-dom";
import Link from '@mui/material/Link';

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";

import Login from "./users/Login";
import SignUp from "./users/Signup";

class Splash extends React.Component {
  render() {
    return(
      <div style={{display: 'flex', justifyContent: 'center'}}>
       <Card
       sx={{
        width: 320,
        maxWidth: "90vw",
        padding: 1,
        // margin: 1,
        display: "grid",
        justifyContent: "center"
      }}>
        <CardMedia
              component="img"
              height="200"
              style={{width: '95%' , marginLeft: 7, marginBottom: 8}}
              src="/imgs/tmw_logo.JPG"
              // {tmw_logo}
            />
        <Typography sx={{m: 1, display: 'flex', justifyContent: 'center'}}>
          Create and plan your workouts
        </Typography>
        <Typography sx={{m: 1, display: 'flex', justifyContent: 'center'}}>
          Log in or sign up to get started
        </Typography>
        <Login  
          closeMenu={null} buttonFlag={true} 
          ref={this.props.loginRef} 
          appLoginHandler={this.props.appLoginHandler}
          />
        <SignUp 
          splash={true} 
          appSignUpHandler={this.props.showSignUp}
          signUpSubmit={this.props.signUpSubmit}
          ref={this.props.signUpRef}
          signUpOpen={this.props.signUp}/>
       </Card>
      </div>
    )
  }
}

export default Splash;