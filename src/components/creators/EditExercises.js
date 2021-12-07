import React from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
// import TableSortLabel from '@mui/material/TableSortLabel';
import Button from '@mui/material/Button';
// import { DataGrid } from '@mui/x-data-grid';
import {FirebaseContext} from "../../config/firebase";

import EditExercise from "./EditExercise";
import CreateExercise from "./CreateExercise";
import { collection, query, where, onSnapshot  } from "firebase/firestore";

const tableHead = {
  fontWeight: 550
}

// const columns = [
//   {field: 'name', headerName: 'Name', width: 180, editable: true},
//   {field: 'dominantMuscle', headerName: 'Target Muscle', width: 170, editable: true},
//   {field: 'exerciseSubType', headerName: 'Exercise Type', width: 170, editable: true},
//   {field: 'exerciseGuide', headerName: 'Exercise Guide', width: 1200, editable: true}
// ]

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw',
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

class EditExercises extends React.Component
{
  static contextType = FirebaseContext;
  constructor(props){
    super(props);
    this.state = {
      creator: "",
      exercises: [],
      selectedExercises: [],
      rowsPerPage: 10,
      page: 0,
      exerciseCreateOpen: false
    }

    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    this.switchModalState = this.switchModalState.bind(this);
  }
  async componentDidMount() {
    this.setState({creator: this.context.user.uid})
    const q = query(collection(this.context.database, "exercises"), where("exerciseType", "==", "resistance"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const exercises = [];
      querySnapshot.forEach((doc) => {
          let data = doc.data();
          data.id = doc.id;
          // console.log(doc.id);
          exercises.push(data);
      });
      // console.log("Exercises: ", exercises.join(", "));
      // if (exercises.length !== this.state.exercises.length)
      // {
        this.setState({exercises: exercises})
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
    this.setState({exerciseCreateOpen: !this.state.exerciseCreateOpen})
  }

  render () {
    return (
      <div style={{marginBottom: 66}}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow id="header-row">
                <TableCell><Typography style={tableHead}>Exercise Name</Typography></TableCell>
                <TableCell><Typography style={tableHead}>Exercise Type</Typography></TableCell>
                <TableCell><Typography style={tableHead}>Target Muscle</Typography></TableCell>
                <TableCell><Typography style={tableHead}></Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.exercises.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((row) => (
                <TableRow id={row.id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.exerciseSubType}</TableCell>
                  <TableCell>{row.dominantMuscle}</TableCell>
                  <TableCell>
                    <EditExercise exercise={row} />
                  </TableCell>
                </TableRow>
              ))

              }
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={this.state.exercises.length}
          rowsPerPage={this.state.rowsPerPage}
          page={this.state.page}
          onPageChange={this.handleChangePage}
          onRowsPerPageChange={this.handleChangeRowsPerPage}
        />
        <Button variant="contained" onClick={this.switchModalState} style={{marginRight: 4}}>
          Add New Exercise
        </Button>
        
        <Modal
          open={this.state.exerciseCreateOpen}
          onClose={this.switchModalState}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description">
            <Box style={modalStyle}>
              <CreateExercise
                modalCloser={this.switchModalState} />
            </Box>
        </Modal>
      </div>
    )
  }
}

export default EditExercises;