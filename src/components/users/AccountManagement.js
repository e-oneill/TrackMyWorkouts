import React from "react";
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {FirebaseContext} from '../../config/firebase';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
// import TextField from '@mui/material/TextField';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";

const cardStyle = {
  backgroundColor: '#e0e0e0', 
  width: 'auto', 
  marginTop: 4, 
  padding: 4,
  }
const cardHeader = {display: 'grid', justifyContent: 'center'}
const passwordStyle = {m: 1, backgroundColor: 'white', minWidth: '46%'}
const accountButton = {
  marginLeft: 6, 
  marginBottom: 8, 
  minWidth: '94.5%'
}
const accountAlert = {
  marginLeft: 6, 
  marginBottom: 8, 
  maxWidth: '90%'
}

const textStyle = {m: 1, backgroundColor: 'white', width: '93.5%'}

class AccountManagement extends React.Component {
  static contextType = FirebaseContext;
  constructor(props){
    super(props)
    this.state = {
      user: this.props.user,
      currentPassword: "",
      showCurrentPassword: false,
      newPassword: "",
      confirmPassword: "",
      showNewPassword: false,
      passwordUpdated: false,
      updateFailure: false,
      failureMessage: "",
      openDeleteDialog: false,
      name: this.props.user.name,
      height: this.props.user.height,
      weight: this.props.user.weight,
    }

    this.handleTextBoxChange = this.handleTextBoxChange.bind(this);
    this.handleMouseDownShowCurrPassword = this.handleMouseDownShowCurrPassword.bind(this);
    this.handleMouseUpShowCurrPassword = this.handleMouseUpShowCurrPassword.bind(this);
    this.handleMouseDownShowNewPassword = this.handleMouseDownShowNewPassword.bind(this);
    this.handleMouseUpShowNewPassword = this.handleMouseUpShowNewPassword.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.deleteUserDialog = this.deleteUserDialog.bind(this);
    this.handleCloseDeleteDialog = this.handleCloseDeleteDialog.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }

  handleTextBoxChange(e) {
    if (e.target.id === 'current-password')
    {
      this.setState({currentPassword: e.target.value});
    }
    if (e.target.id === 'new-password')
    {
      this.setState({newPassword: e.target.value});
    }
    if (e.target.id === 'confirm-password')
    {
      this.setState({confirmPassword: e.target.value});
    }
    if (e.target.id === 'name')
    {
      this.setState({name: e.target.value});
    }
    if (e.target.id === 'height')
    {
      this.setState({height: e.target.value});
    }
    if (e.target.id === 'weight')
    {
      this.setState({weight: e.target.value});
    }
  }

  handleMouseDownShowCurrPassword(e)
  {
    e.preventDefault();
    this.setState({showCurrentPassword: true})
  }

  handleMouseUpShowCurrPassword()
  {
    this.setState({showCurrentPassword: false})
  }

  handleMouseDownShowNewPassword(e)
  {
    e.preventDefault();
    this.setState({showNewPassword: true})
  }

  handleMouseUpShowNewPassword()
  {
    this.setState({showNewPassword: false})
  }

  async updatePassword() {
    if (this.state.newPassword === this.state.confirmPassword && this.state.newPassword.length > 6)
    {
    var user = this.context.user;
    var currentPassword = this.state.currentPassword;
    // console.log(user);
    var credential = EmailAuthProvider.credential(user.email, currentPassword);
    // console.log(credential);
    await reauthenticateWithCredential(user, credential).then((userCredential) =>{
      this.context.authCredential = userCredential;
      this.context.user = userCredential.user;
      updatePassword(user, this.state.newPassword);
      this.setState({currentPassword:"", newPassword:"", confirmPassword:"", passwordUpdated: true})
    }).catch((error) => {
      this.setState({currentPassword:"", newPassword:"", confirmPassword:"", updateFailure: true, failureMessage: "Current password is incorrect."})
    });
    }
    else {
      this.setState({currentPassword:"", newPassword:"", confirmPassword:"", updateFailure: true, failureMessage: "New passwords do not match, or do not contain at least 6 characters."})
    }
  }

  deleteUserDialog() {
    this.setState({openDeleteDialog: true})
  }

  handleCloseDeleteDialog() {
    this.setState({openDeleteDialog: false})
  }

  async deleteUser() {
    this.props.deleteHandler();
    this.setState({openDeleteDialog: false})
  }

  render() {
    return (
      <div style={{display: 'grid', justifyContent: 'center'}}>
       <Typography variant="h5" sx={cardHeader}>
         Account Management
        </Typography>
        <Card style={cardStyle}>
          <Typography variant="h6" sx={cardHeader}>
            Change Your Password
          </Typography>
          <div style={{width:'auto'}}>
          <FormControl sx={passwordStyle} variant="outlined" required>
          <InputLabel htmlFor="outlined-adornment-password">Current Password</InputLabel>
          <OutlinedInput
            id="current-password"
            type={this.state.showCurrentPassword ? 'text' : 'password'}
            value={this.state.currentPassword}
            onChange={this.handleTextBoxChange}
            endAdornment={
              <InputAdornment id="show-current" position="end">
                <IconButton
                  id="show-current"
                  aria-label="toggle password visibility"
                  onMouseUp={this.handleMouseUpShowCurrPassword}
                  onMouseDown={this.handleMouseDownShowCurrPassword}
                  edge="end"
                >
                  {this.state.showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Current Password"
          />
        
        </FormControl>
        </div>
        <FormControl sx={passwordStyle} variant="outlined" required>
          <InputLabel htmlFor="outlined-adornment-password">New Password</InputLabel>
          <OutlinedInput
            id="new-password"
            type={this.state.showNewPassword ? 'text' : 'password'}
            value={this.state.newPassword}
            onChange={this.handleTextBoxChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onMouseUp={this.handleMouseUpShowNewPassword}
                  onMouseDown={this.handleMouseDownShowNewPassword}
                  edge="end"
                >
                  {this.state.showNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="New Password"
          />
        
        </FormControl>
        <FormControl sx={passwordStyle} variant="outlined" required>
          <InputLabel htmlFor="outlined-adornment-password">Confirm New Password</InputLabel>
          <OutlinedInput
            id="confirm-password"
            type={this.state.showNewPassword ? 'text' : 'password'}
            value={this.state.confirmPassword}
            onChange={this.handleTextBoxChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onMouseUp={this.handleMouseUpShowNewPassword}
                  onMouseDown={this.handleMouseDownShowNewPassword}
                  edge="end"
                >
                  {this.state.showNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Confirm New Password"
          />
        
        </FormControl>
        { (this.state.passwordUpdated) &&
        <Alert onClose={() => {this.setState({passwordUpdated: false})}} style={accountAlert}>Password Successfully Updated</Alert>
        }
        {
          (this.state.updateFailure) &&
          <Alert onClose={() => {this.setState({updateFailure: false})}} style={accountAlert} severity="error">{this.state.failureMessage}</Alert>
        }
        <Button variant="contained" onClick={this.updatePassword} style={accountButton}>Update Password</Button>
        </Card>
        <Card style={cardStyle} >
        <Typography variant="h6" sx={cardHeader}>
            Change Your Details
        </Typography>
        <FormControl sx={textStyle} variant="outlined">
          <InputLabel htmlFor="outlined-email">Your Name</InputLabel>
          <OutlinedInput
            id="name"
            type="text"
            value={this.state.name}
            onChange={this.handleTextBoxChange}
            label="Your Name"
            
          />
        </FormControl>
        <FormControl sx={textStyle} variant="outlined">
          <InputLabel htmlFor="outlined-height">Your Height (cm)</InputLabel>
          <OutlinedInput
            id="height"
            type="number"
            value={this.state.height}
            onChange={this.handleTextBoxChange}
            label="Your Height (cm)"
            
          />
        </FormControl>
        <FormControl sx={textStyle} variant="outlined">
          <InputLabel htmlFor="outlined-weight">Your Weight (kg)</InputLabel>
          <OutlinedInput
            id="weight"
            type="number"
            value={this.state.weight}
            onChange={this.handleTextBoxChange}
            label="Your Weight (cm)"
            
          />
        </FormControl>
        <Button variant="contained" style={accountButton} onClick={() => this.props.updateUserDetails(this.state.name, this.state.weight, this.state.height)}>Update Details</Button>
        </Card>
        <Card style={cardStyle} sx={{marginBottom: '60px'}}>
        <Typography variant="h6" sx={cardHeader}>
            Delete Your Account
        </Typography>
        <Typography sx={cardHeader} >
          DANGER: this cannot be undone
        </Typography>
        <Button onClick={this.deleteUserDialog} variant="contained" color="error" style={accountButton} sx={{marginTop:1}} >Delete Account</Button>
        </Card>
        <Dialog
        open={this.state.openDeleteDialog}
        onClose={this.handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        >
        <DialogTitle id="alert-dialog-title">
          {"Delete your user account?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You are deleting your account. Your data will be removed from our records, and cannot be retrieved.
          </DialogContentText>
          <FormControl sx={passwordStyle} style={{width:'90%'}} variant="outlined" required>
          <InputLabel htmlFor="outlined-adornment-password">Current Password</InputLabel>
          <OutlinedInput
            id="current-password"
            type={this.state.showCurrentPassword ? 'text' : 'password'}
            value={this.state.currentPassword}
            onChange={this.handleTextBoxChange}
            endAdornment={
              <InputAdornment id="show-current" position="end">
                <IconButton
                  id="show-current"
                  aria-label="toggle password visibility"
                  onMouseUp={this.handleMouseUpShowCurrPassword}
                  onMouseDown={this.handleMouseDownShowCurrPassword}
                  edge="end"
                >
                  {this.state.showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Current Password"
          />
        
        </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCloseDeleteDialog}>Disagree</Button>
          <Button onClick={this.deleteUser} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      </div>
    )
  }
}

export default AccountManagement;