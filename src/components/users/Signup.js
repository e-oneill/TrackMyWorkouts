import React from "react"

import { withStyles } from '@mui/styles';
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
import CircularProgress from '@mui/material/CircularProgress';
import MuiAccordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip';

const Accordion = withStyles({
  root: {
    "&$expanded": {
      marginLeft: 8,
      marginRight: 8
    }
  },
  expanded: {}
})(MuiAccordion);

const modalBox = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  display:'grid', 
  justifyContent:'center',
  transform: 'translate(-50%, -50%)',
  width: 320,
  bgcolor: 'background.paper',
  // border: '1px solid #000',
  boxShadow: 24,
  p: 4,
};

const stopPropagationForTab = (event) => {
  if (event.key === "Tab") {
    event.stopPropagation();
  }
};


class SignUp extends React.Component {
  constructor(props)
  {
    super(props)
    this.state = {
      name: "",
      email: "",
      password: "",
      height: "",
      weight: "",
      showPassword: false,
      signingUp: false,
      tooltip: [],
      canSubmit: true,
      errorMessage: '',
      open: this.props.open
    }

    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleClickShowPassword = this.handleClickShowPassword.bind(this);
    this.handleMouseDownShowPassword = this.handleMouseDownShowPassword.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleHeightChange = this.handleHeightChange.bind(this);
    this.handleWeightChange = this.handleWeightChange.bind(this);
    this.openModal = this.openModal.bind(this);
    this.handleModalStateChange = this.handleModalStateChange.bind(this);
    this.handleSignUpProcessing = this.handleSignUpProcessing.bind(this);
    this.checkIfValid = this.checkIfValid.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
    
  }

  componentDidMount() {
    this.checkIfValid()

  }

  checkIfValid() {
    let invalid = false;
    let tooltip = [];
    const emailRegex = new RegExp(/^\w+([.-]*\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)
    if (this.state.name.length === 0)
      {
        invalid = true;
        tooltip.push("Please enter a name");
      }
    if (!emailRegex.test(this.state.email))
      {
        invalid = true;
        tooltip.push("Please enter a valid email address");
      }
    if (this.state.password.length < 6)
      {
        invalid = true;
        tooltip.push("Please enter a password with more than 6 characters");
      }
    if (invalid === false)
    {
      tooltip = ["You may now submit for signing up"]
    }
      this.setState({canSubmit: invalid, tooltip: tooltip})
      

    
  }

  receiveError(errorFromApp) {
    this.setState({errorMessage: errorFromApp})
  }

  handleSignUpProcessing() {
    this.setState({signingUp: !this.state.signingUp})
  }

  openModal() {
    this.setState({open: true})
  }

  handleModalStateChange() {
    this.setState({open: !this.state.open})
    this.props.closeMenu();
  }

  handlePasswordChange(e) {
    this.setState({password: e.target.value}, () => this.checkIfValid())
  }

  handleEmailChange(e) {
    this.setState({email: e.target.value}, () => this.checkIfValid())
  }

  handleNameChange(e) {
    this.setState({name: e.target.value}, () => this.checkIfValid())
  }

  handleHeightChange(e) {
    this.setState({height: e.target.value})
  }

  handleWeightChange(e) {
    this.setState({weight: e.target.value})
  }

  handleClickShowPassword() {
    this.setState({showPassword: !this.state.showPassword})
  }

  handleMouseDownShowPassword(e) {
    e.preventDefault();
  }

  render() {
    const signUpHandler = this.props.appSignUpHandler;
    const signUpSubmit = this.props.signUpSubmit;
    return (
      <div style={{ display:'flex', justifyContent:'center' }}>
        <Button color="success" variant="contained" sx={{margin: 1}} onClick={this.openModal}>
        Sign Up
        </Button>
        <Modal 
        open={this.state.open}
        onClose={this.handleModalStateChange}
        onKeyDown={stopPropagationForTab}>
        <Box sx={modalBox} >
        <Typography variant="h4" sx={{marginLeft: "auto", marginRight: "auto"}}>
          Sign Up
        </Typography>
        {(this.state.signingUp) ? 
          <div>
          <div>
          <Typography>
            Sign up processing...
          </Typography>
          </div>
          <div style={{ display:'grid', justifyContent:'center', marginTop: '1em'}}>
          <CircularProgress />
          </div>
          </div> :

      
        <div style={{ display:'grid', justifyContent:'center' }}>
        <FormControl sx={{ m: 1, width: 'auto' }} variant="outlined">
          <InputLabel htmlFor="outlined-email">Your Name (will default to email)</InputLabel>
          <OutlinedInput
            id="outlined-name"
            type="text"
            value={this.state.name}
            onChange={this.handleNameChange}
            label="Your Name (will default to email)"
            
          />
        </FormControl>
        <FormControl sx={{ m: 1, width: 'auto' }} variant="outlined" required>
          <InputLabel htmlFor="outlined-email">Email</InputLabel>
          <OutlinedInput
            id="outlined-email"
            type="text"
            value={this.state.email}
            onChange={this.handleEmailChange}
            label="Email"
          />
        </FormControl>
        <FormControl sx={{ m: 1, width: 'auto' }} variant="outlined" required>
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
        <Accordion  sx={{ m: 1, width: 'auto' , "&&expanded" : {
          margin: 1,
          
        }}}>
            <AccordionSummary>
              <Typography>
                Personal Details (Optional)
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{marginTop: -1, marginBottom:1, fontSize: 14 }} color="text.secondary">
                This info will help us provide reports on your strength.
              </Typography>
              <FormControl sx={{marginBottom:1,  width: 'auto' }} variant="outlined">
          <InputLabel htmlFor="outlined-email">Height (cm)</InputLabel>
          <OutlinedInput
            id="outlined-email"
            type="number"
            value={this.state.height}
            onChange={this.handleHeightChange}
            label="Height (cm)"
          />
        </FormControl>
        <FormControl sx={{ width: 'auto' }} variant="outlined">
          <InputLabel htmlFor="outlined-email">Weight (kg)</InputLabel>
          <OutlinedInput
            id="outlined-email"
            type="number"
            value={this.state.weight}
            onChange={this.handleWeightChange}
            label="Weight (kg)"
          />
        </FormControl>
            </AccordionDetails>
          </Accordion>
          {(this.state.errorMessage) && 
        <Alert severity="error" sx={{margin: 1, marginTop: 0, width: 'auto' }} onClose={() => {this.setState({errorMessage: ""})}}>
          {this.state.errorMessage}
        </Alert>
        }
        
        
        
        <Tooltip title={this.state.tooltip.map(x => 
          <p id={x}>{x}</p>
        )}>
        <span style={{width:'100%'}}>
        <Button sx={{margin: 1, width: '95%'}} variant="contained" 
          disabled={this.state.canSubmit}
        onClick={async () => {signUpSubmit(this.state.name, 
          this.state.email,
          this.state.password,
          this.state.weight,
          this.state.height); this.handleSignUpProcessing()}
        }
        >
          Create Account
        </Button>
        </span>
        </Tooltip>
        </div>}
        {/* <Button sx={{margin: 1}} variant="contained" onClick={signUpHandler}>Back to Log In</Button> */}
       </Box>
      </Modal>
      </div>
    )
  }
}

export default SignUp;