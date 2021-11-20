import React from "react";

//region Material UI Imports
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
// import Link from '@mui/material/Link';
import CircularProgress from '@mui/material/CircularProgress';

//endregion;
import {FirebaseContext} from '../../config/firebase';


const boxStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  display:'grid', 
  justifyContent:'center',
  transform: 'translate(-50%, -50%)',
  width: 270,
  maxWidth: '80vw',
  bgcolor: 'background.paper',
  // border: '1px solid #000',
  boxShadow: 24,
  p: 2,
};



const inputStyle = { m: 1, width: '25ch' }

const stopPropagationForTab = (event) => {
  if (event.key === "Tab") {
    event.stopPropagation();
  }
};

//This login class has styleing based on https://mui.com/components/text-fields/
class Login extends React.Component{
  
  constructor(props)
  {
    super(props)
    this.state = {
      open: this.props.open,
      email: "",
      password: "",
      showPassword: false,
      loggingIn: this.props.loggingIn,
      errorMessage: ""
    }

    

    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleClickShowPassword = this.handleClickShowPassword.bind(this);
    this.handleMouseDownShowPassword = this.handleMouseDownShowPassword.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleModalStateChange = this.handleModalStateChange.bind(this);
    this.openModal = this.openModal.bind(this);
  }
  openModal() {
    // this.props.closeMenu();
    this.setState({open: true});
    
  }
  handleModalStateChange() {
    
    this.setState({open: !this.state.open})
    this.props.closeMenu();
  }

  handlePasswordChange(e) {
    this.setState({password: e.target.value})
  }

  handleEmailChange(e) {
    this.setState({email: e.target.value})
  }

  handleClickShowPassword() {
    this.setState({showPassword: !this.state.showPassword})
  }

  handleMouseDownShowPassword(e) {
    e.preventDefault();
  }

  handleSubmit() {
    // console.log(this.context);
    this.setState({loggingIn: !this.state.loggingIn});
    
    // this.props.updateUser(this.context.user);
  }

  
  receiveError(errorFromApp) {
    let errorDesc = "";
    switch (errorFromApp)
    {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        errorDesc = "Incorrect Email / Password";
        break;
      case 'auth/timeout':
        errorDesc = "Connection timed out, please try again"
        break;
      default:
        errorDesc = "Sorry, log in failed, please try again.";
        break;
    }
    
    this.setState({errorMessage: errorDesc})
  }

  static contextType = FirebaseContext;
  render() {
    const loginHandler = this.props.appLoginHandler;
    // const signUpHandler = this.props.appSignUpHandler;
    return (
      <div style={{display:'grid', justifyContent:'center'}}>
        <MenuItem onClick={() => {this.openModal(); }}>Log In</MenuItem>
      {/* <Button variant="contained" color="success" sx={{margin: 1}} onClick={this.handleModalStateChange}> */}
        {/* Log In
      </Button> */}
      <Modal 
      open={this.state.open}
      onClose={this.handleModalStateChange}
      onKeyDown={stopPropagationForTab}>
       <Box sx={boxStyle} >
        <Typography variant="h4" sx={{marginLeft: "auto", marginRight: "auto"}}>
          Login
        </Typography>
        {(this.state.loggingIn) ? 
        <div style={{ display:'grid', justifyContent:'center', marginTop: '1em'}}>
          <div>
          <Typography>
            Attempting to log in...
          </Typography>
          </div>
          <div style={{ display:'grid', justifyContent:'center', marginTop: '1em'}}>
          <CircularProgress />
          </div>
        </div> :
        <div style={{ display:'grid', justifyContent:'center'}}>
        <FormControl sx={inputStyle} variant="outlined">
          <InputLabel htmlFor="outlined-email">Email</InputLabel>
          <OutlinedInput
            id="outlined-email"
            type="text"
            value={this.state.email}
            onChange={this.handleEmailChange}
            label="Email"
          />
        </FormControl>
        <FormControl sx={inputStyle} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={this.state.showPassword ? 'text' : 'password'}
            value={this.state.password}
            onChange={this.handlePasswordChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={this.handleClickShowPassword}
                  onMouseDown={this.handleMouseDownShowPassword}
                  edge="end"
                >
                  {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>
        {(this.state.errorMessage) && 
        <Alert severity="error" sx={{margin: 1, marginTop: 0, width: '21ch' }} onClose={() => {this.setState({errorMessage: ""})}}>
          {this.state.errorMessage}
        </Alert>
        }
        <Button variant="contained" 
        sx={{marginLeft: 1, marginRight: 1}}
        onClick={async () => {loginHandler(this.state.email,this.state.password); this.handleSubmit()}}
        >
          Log In
        </Button>
          {/* <Link href="#" sx={{marginLeft: "auto", marginRight: "auto", marginTop: 1}} >Forgotten Password</Link> */}
          {/* <Link href="#" sx={{marginLeft: "auto", marginRight: "auto", marginTop: 1}} onClick={signUpHandler}>Don't have an account? Sign up</Link> */}
        </div>
        }
      </Box>
       
      </Modal>
      </div>
    )
  }
}

export default Login;