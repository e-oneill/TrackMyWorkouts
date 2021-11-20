import React from "react";

//region Material UI Imports
import Button from '@mui/material/Button';

class Logout extends React.Component{
  
  constructor(props)
  {
    super(props)
    this.state = {
    }

  }

  render() {
    const logOut = this.props.appLogoutHandler;
    return (
      <Button variant="contained" color="error" onClick={logOut}>
          Log Out
      </Button>
    )
  }
  
}

export default Logout;