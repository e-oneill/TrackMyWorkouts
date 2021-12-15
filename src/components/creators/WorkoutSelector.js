import React from "react";
import {FirebaseContext} from "../../config/firebase";
import { collection, query, onSnapshot  } from "firebase/firestore";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Grid from '@mui/material/Grid';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';


class WorkoutSelector extends React.Component
{
  static contextType = FirebaseContext;
  constructor(props) {
    super(props)
    this.state = {
      workouts: [],
      rowsPerPage: 5,
      page: 0,
      selected: null,
      muscleGroup: "",
      search: ""
    }

    this.handleClick = this.handleClick.bind(this)
    this.handleChangePage = this.handleChangePage.bind(this)
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this)
    this.handleMuscleGroupChange = this.handleMuscleGroupChange.bind(this)
    this.handleTextBoxChange = this.handleTextBoxChange.bind(this)
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

  filterByMuscleGroup(muscleGroup) {
    return function (workout) {
      if (muscleGroup !== "")
      {
        return workout.targetMuscleGroup === muscleGroup
      }
      else
      {
        return true;
      }
    }
  }

  filterBySearch(search)
  {
    return function (workout) {
      if (search !== "")
      {
        return (
          workout.name.toLowerCase().includes(search.toLowerCase()) ||
          workout.targetMuscleGroup.toLowerCase().includes(search.toLowerCase())
        )
      }
      else return true;
    }
  }

  handleChangePage(event, newPage) {
    this.setState({page: newPage})
  }

  handleChangeRowsPerPage(event) {
    this.setState({rowsPerPage: parseInt(event.target.value, 10), page: 0});

  }

  handleMuscleGroupChange(e) {
    this.setState({muscleGroup: e.target.value})
  }

  handleClick(event, row)
  {
      if (row.id === this.state.selected)
      {
        this.setState({selected: null});
        this.props.updateWorkout(null, [])
      }
      else 
      {
        this.setState({selected: row.id})
        this.props.updateWorkout(row, row.exercises )
      }
  }

  handleTextBoxChange(e) {
    if (e.target.id === "search")
    {
      this.setState({search: e.target.value})
    }
  }
  render() {
    return (
      <Grid container spacing={2}>
        <Grid item xs={6}>
        <TextField fullWidth id="search" onChange={this.handleTextBoxChange} label="Search" variant="outlined" />
        </Grid>
        <Grid item xs={6}>
        
        <FormControl fullWidth>
        <InputLabel htmlFor="primary-muscle-select-label">Target Muscle Group</InputLabel>
        <Select
              labelId="primary-muscle-select-label"
              id="muscle-group-select"
              value={this.state.muscleGroup}
              label="Target Muscle Group"
              fullWidth
              onChange={this.handleMuscleGroupChange}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Full Body">Full Body</MenuItem>
                <MenuItem value="Chest">Chest</MenuItem>
                <MenuItem value="Shoulders">Shoulders</MenuItem>
                <MenuItem value="Back">Back</MenuItem>
                <MenuItem value="Arms">Arms</MenuItem>
                <MenuItem value="Core">Core</MenuItem>
                <MenuItem value="Legs">Legs</MenuItem>
            </Select>
        </FormControl>
        </Grid>
        <Grid item xs={12}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>

              </TableCell>
              <TableCell>
                  Name
              </TableCell>
              <TableCell>
                  Muscle Group
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {this.state.workouts
          .filter(this.filterBySearch(this.state.search))
          .filter(this.filterByMuscleGroup(this.state.muscleGroup))
          .slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage)
          .map((row, i) => (
                <TableRow id={row.id} onClick={(event) => this.handleClick(event, row)}>
                  <TableCell>
                   <Checkbox
                          color="primary"
                          checked={(row.id === this.state.selected) ? true : false}
                          inputProps={{
                            'aria-labelledby': row.id,
                          }}
                        />
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.targetMuscleGroup}</TableCell>
                </TableRow>
          ))}
          </TableBody>
          
        </Table>
        <TablePagination
          style={{width:'99%', scroll: 'none'}}
          rowsPerPageOptions={[]}
          component="div"
          count={this.state.workouts.length}
          rowsPerPage={this.state.rowsPerPage}
          page={this.state.page}
          onPageChange={this.handleChangePage}
          onRowsPerPageChange={this.handleChangeRowsPerPage}
        />
        </Grid>
      </Grid>
    )
  }
}

export default WorkoutSelector;