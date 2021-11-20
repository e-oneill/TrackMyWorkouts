//This file will contain the tab bar for the bottom of the screen when the sight is viewed on mobile or tablet
import React from 'react';
// import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';

// import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
// import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Fab from '@mui/material/Fab';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Avatar from '@mui/material/Avatar';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import MoreIcon from '@mui/icons-material/MoreVert';
import Link from '@mui/material/Link';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircle from '@mui/icons-material/AccountCircle';

import Logout from '../users/Logout';
import Login from '../users/Login';
import SignUp from '../users/Signup';
import AccountManagement from "../users/AccountManagement";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link as RouterLink,
  useRouteMatch,
  useParams
} from "react-router-dom";

const LinkBehavior = React.forwardRef((props, ref) => (
  <RouterLink ref={ref} to="/getting-started/installation/" {...props} />
));
let loginOpen = false;
class AppTabBar extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {user: this.props.user, anchorEl: null, open: false, openAccountMenu: false, accountAnchorEl: null};
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.handleAccountClick = this.handleAccountClick.bind(this);
    this.handleAccountClose = this.handleAccountClose.bind(this);
  }

  handleModalClose() {
    loginOpen = true;
    this.setState({anchorEl: null, open: false});
  }

  handleAccountClick(e) {
    this.setState({accountAnchorEl: e.currentTarget, openAccountMenu: true});
  }

  handleAccountClose() {
    this.setState({elementAnchorEl: null, openAccountMenu: false })
  }
  
  handleClick(e) {
    this.setState({anchorEl: e.currentTarget, open: true});
  }

  handleClose() {
    this.setState({anchorEl: null, open: false});
  }

  render() {
    loginOpen = this.props.loginOpen;
    return(
      <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
        <Toolbar>
          <IconButton 
            color="inherit" 
            aria-label="open drawer"
            aria-controls="tab-menu"
            aria-haspopup="true"
            aria-expanded={this.state.open}
            onClick={this.handleClick}>
          <MenuIcon />
          </IconButton>
          
          <Menu
            id="tab-menu"
            anchorEl={this.state.anchorEl}
            open={this.state.open}
            onClose={this.handleClose}
            >
              {(this.props.user.name) ?
              <div>
              <Link component={RouterLink} to="/"><MenuItem onClick={this.handleClose}>My Home</MenuItem></Link>
              <MenuItem onClick={() => {this.props.appLogoutHandler(); this.handleAccountClose();}}>Log Out</MenuItem>
              </div>:
              <div>
                <Login 
                    appLoginHandler={this.props.appLoginHandler} 
                    open={loginOpen}
                    loggingIn = {this.props.loggingIn}
                    closeMenu={this.handleModalClose}
                    //passing ref into the component to allow us to call functions on the child from the parent
                    ref = {this.props.loginRef}
                />
                <SignUp 
                    appSignUpHandler={this.props.appSignUpHandler} 
                    signUpSubmit={this.props.signUpSubmit} 
                    open={this.props.signUpOpen}
                    closeMenu={this.handleModalClose}
                    ref = {this.props.signUpRef}/>
              </div>}
          </Menu>
          
          <Box sx={{ flexGrow: 1 }} />
          
          {/* We use  */}
          {(this.props.user.name !== null) ? 
           <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={this.handleAccountClick}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="account-menu"
                anchorEl={this.state.accountAnchorEl}
                open={this.state.openAccountMenu}
                onClose={this.handleAccountClose}
              >
                <Link component={RouterLink} to="/account-management"><MenuItem onClick={this.handleAccountClose}>Manage Account</MenuItem></Link>
                <MenuItem onClick={() => {this.props.appLogoutHandler(); this.handleAccountClose();}}>Log Out</MenuItem>
              </Menu>
             
           </div>
          
          :
          <div style={{display: 'flex'}}>
          
          
          </div>
          }
          
          {/* <IconButton color="inherit">
            <SearchIcon />
          </IconButton>
          <IconButton color="inherit">
            <MoreIcon />
          </IconButton> */}
        </Toolbar>
      </AppBar>
    )
  }
}

export default AppTabBar;