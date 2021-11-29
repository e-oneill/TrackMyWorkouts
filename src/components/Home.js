import React from "react"
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

import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';

//This home page exists only to test that the user is being logged in correctly and user is available in props for use elsewhere in application.
class Home extends React.Component
{
  constructor(props){
    super(props)
    this.state = {
      user: this.props.user
    }

    // console.log(this.props.user)
  }
  render() {
    return (
        
      <div style={{ display:'grid', justifyContent:'center' }}>
      {(this.props.user.name) ?
        <Card sx={{width:320, maxWidth: "90vw", padding: 1, margin: 1, display:'grid', justifyContent:'center'}}>
        <Typography variant="h3">
        Hello {this.props.user.name}!
        </Typography>
        </Card>:
        <p>You must be logged in to see this site.</p>
        }

      </div>
    )
  }
} 

export default Home;