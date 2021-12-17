import React from "react"

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import {FirebaseContext} from "../../config/firebase";
import { collection, query, onSnapshot  } from "firebase/firestore";

import EditWorkout from "./EditWorkout";
import CreateWorkout from "./CreateWorkout";
import CreateUserWorkout from "../user-workouts/CreateUserWorkout";

const tableHead = {
  fontWeight: 550
}

const modalStyle = {
  position: 'absolute',
  marginTop: 8,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw',
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 24,
  padding: 4,
  overflow: 'scroll',
  // overflowY: 'auto'
}



class EditWorkouts extends React.Component
{
  // This component produces a table of the workout templates
  // There are buttons to edit a workout, which opens an edit workout component
  static contextType = FirebaseContext;
  constructor(props) {
    super(props)
    this.state = {
      workouts: [],
      rowsPerPage: 10,
      page: 0,
      workoutCreateOpen: false,
      startWorkoutOpen: false
    }

    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    this.switchModalState = this.switchModalState.bind(this);
    // this.switchStartModalState = this.switchStartModalState.bind(this);
  }

  async componentDidMount() {
    this.setState({creator: this.context.user.uid})
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
      // {
        // console.log(workouts)
        this.setState({workouts: workouts})
      // }
    });

    
  }

  handleChangePage(event, newPage) {
    this.setState({page: newPage})
  }

  handleChangeRowsPerPage(event) {
    this.setState({rowsPerPage: parseInt(event.target.value, 10), page: 0});

  }

  switchModalState() {
    this.setState({workoutCreateOpen: !this.state.workoutCreateOpen})
  }

  

  render() {
    return (
      <div style={{marginBottom: 64}}>
        <TableContainer>
          <Table>
            <TableHead  >
              <TableRow id="header-row" >
                <TableCell >
                  <Typography style={tableHead}>Workout Name</Typography>
                </TableCell>
                <TableCell>
                <Typography style={tableHead}>Target Muscle Group</Typography>
                </TableCell>
                <TableCell>
                <Typography style={tableHead}>Sets</Typography>
                </TableCell>
                { (!this.props.selectorList) &&
                <React.Fragment>
                <TableCell>
                </TableCell>
                <TableCell>
                </TableCell>
                </React.Fragment>
                }
              </TableRow>
            </TableHead>
            <TableBody>
            {this.state.workouts.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((row, i) => (
                <TableRow id={row.id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.targetMuscleGroup}</TableCell>
                  <TableCell>{row.sets}</TableCell>
                  { (!this.props.selectorList) &&
                  <React.Fragment>
                  <TableCell>
                    <EditWorkout workout={row} />
                  </TableCell>
                  <TableCell>
                          < CreateUserWorkout workout={row} modalStateChanger={this.switchStartModalState}/>

                  </TableCell>
                  </React.Fragment>
                  }
                </TableRow>
              ))
              

              }
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={this.state.workouts.length}
          rowsPerPage={this.state.rowsPerPage}
          page={this.state.page}
          onPageChange={this.handleChangePage}
          onRowsPerPageChange={this.handleChangeRowsPerPage}
        />
        <Button variant="contained" onClick={this.switchModalState} style={{marginRight: 4}}>
          Create New Workout
        </Button>
        
        <Modal
          open={this.state.workoutCreateOpen}
          onClose={this.switchModalState}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description">
            <Box style={modalStyle}>
              <Paper style={{paddingLeft: 12, paddingRight: 12, paddingTop: 12}}>
              <CreateWorkout
                modalCloser={this.switchModalState} />
              </Paper>
            </Box>
        </Modal>
      </div>
    )
  }
}

export default EditWorkouts;