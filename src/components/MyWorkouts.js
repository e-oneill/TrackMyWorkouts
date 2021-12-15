import React from "react";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { withStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Divider from "@material-ui/core/Divider";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Workout1Array } from "/src/components/Workout1.js";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
const localWorkout1Array = Workout1Array;

const inputStyle = {
  backgroundColor: "white",
  marginBottom: ".5em",
  width: "50vw"
};

class Workouts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      wArray: localWorkout1Array,
      searchTerm: ""
    };
    this.onChangeSearchBox = this.onChangeSearchBox.bind(this);
    // console.log(this.props.user)
  }

  onChangeSearchBox(event) {
    this.setState({ searchTerm: event.target.value });
  }
  render() {
    return (
      <div style={{ display: "grid", justifyContent: "center", width: "100%" }}>
        <Card
          sx={{
            width: 600,
            maxWidth: "90vw",
            padding: 1,
            margin: 1,
            display: "grid",
            justifyContent: "center"
          }}
        >
          <Typography variant="h3">My Workouts</Typography>
          <TextField
            sx={inputStyle}
            id="outlined-search"
            label="Search Workouts"
            type="search"
          />
          <FormControl sx={inputStyle} variant="outlined" required>
            <InputLabel htmlFor="outlined-adornment-password">
              Target Muscle Group
            </InputLabel>
            <Select
              labelId="primary-muscle-select-label"
              id="muscle-group-select"
              value={this.state.muscleGroup}
              label="Target Muscle Group"
              onChange={this.handleMuscleGroupChange}
            >
              <MenuItem value="Full Body">Full Body</MenuItem>
              <MenuItem value="Chest">Chest</MenuItem>
              <MenuItem value="Shoulders">Shoulders</MenuItem>
              <MenuItem value="Back">Back</MenuItem>
              <MenuItem value="Arms">Arms</MenuItem>
              <MenuItem value="Core">Core</MenuItem>
              <MenuItem value="Legs">Legs</MenuItem>
            </Select>
          </FormControl>
          <Accordion>
            <AccordionSummary
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography sx={{ width: "40%", flexShrink: 0 }}>
                Workout Name
              </Typography>
              <Typography
                sx={{ color: "text.secondary", width: "40%", flexShrink: 0 }}
              >
                Workout Type
              </Typography>
              <Typography
                sx={{ color: "text.secondary", width: "33%", flexShrink: 0 }}
              >
                Duration
              </Typography>
            </AccordionSummary>
          </Accordion>
          <Accordion>
            <AccordionSummary
              aria-controls="panel2a-content"
              id="panel2a-header"
              fullWidth
            >
              <Typography sx={{ fontSize: 15, width: "40%", flexShrink: 0 }}>
                Workout 1
              </Typography>
              <Typography
                sx={{
                  fontSize: 15,
                  color: "text.secondary",
                  width: "40%",
                  flexShrink: 0
                }}
              >
                Back
              </Typography>
              <Typography
                sx={{
                  fontSize: 15,
                  color: "text.secondary",
                  width: "33%",
                  flexShrink: 0
                }}
              >
                45 Mins
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{ fontSize: 14 }}>Sets: 3 Reps: 5</Typography>
              <Button size="small">Start Workout</Button>
              <Divider />
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Exercise</TableCell>
                    <TableCell>Target Muscle</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.wArray.map((s, index) => (
                    <TableRow key={s.exercise}>
                      <TableCell>{s.exercise}</TableCell>
                      <TableCell>{s.targetarea}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography sx={{ fontSize: 15, width: "40%", flexShrink: 0 }}>
                Workout 2
              </Typography>
              <Typography
                sx={{
                  fontSize: 15,
                  color: "text.secondary",
                  width: "40%",
                  flexShrink: 0
                }}
              >
                Shoulders
              </Typography>
              <Typography
                sx={{
                  fontSize: 15,
                  color: "text.secondary",
                  width: "33%",
                  flexShrink: 0
                }}
              >
                45 Mins
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{ fontSize: 14 }}>Sets: 3 Reps: 5</Typography>
              <Typography sx={{ fontSize: 14 }}>Exercises:</Typography>
              <Typography sx={{ fontSize: 14 }}>Bench Press</Typography>
              <Typography sx={{ fontSize: 14 }}>Push Press</Typography>
              <Typography sx={{ fontSize: 14 }}>Bent Over Row</Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              aria-controls="panel3a-content"
              id="panel3a-header"
            >
              <Typography sx={{ fontSize: 15, width: "40%", flexShrink: 0 }}>
                Workout 3
              </Typography>
              <Typography
                sx={{
                  fontSize: 15,
                  color: "text.secondary",
                  width: "40%",
                  flexShrink: 0
                }}
              >
                Quads
              </Typography>
              <Typography
                sx={{
                  fontSize: 15,
                  color: "text.secondary",
                  width: "33%",
                  flexShrink: 0
                }}
              >
                45 Mins
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>Sets: 3</Typography>
              <Typography>Reps: 5</Typography>
              <Button variant="contained" size="medium">
                Start Workout
              </Button>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              aria-controls="panel1a-content"
              id="panel1a-header"
              fullWidth
            >
              <Typography sx={{ fontSize: 15, width: "40%", flexShrink: 0 }}>
                Workout 4
              </Typography>
              <Typography
                sx={{
                  fontSize: 15,
                  color: "text.secondary",
                  width: "40%",
                  flexShrink: 0
                }}
              >
                Lower Body
              </Typography>
              <Typography
                sx={{
                  fontSize: 15,
                  color: "text.secondary",
                  width: "33%",
                  flexShrink: 0
                }}
              >
                45 Mins
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>Sets: 3 Reps: 5</Typography>
              <Typography>Exercises:</Typography>
              <Typography sx={{ fontSize: 14 }}>Bench Press</Typography>
              <Typography sx={{ fontSize: 14 }}>Push Press</Typography>
              <Typography sx={{ fontSize: 14 }}>Bent Over Row</Typography>
              <Divider />
              <Button size="small">Start Workout</Button>
              <Typography></Typography>
            </AccordionDetails>
          </Accordion>
        </Card>
      </div>
    );
  }
}

export default Workouts;
