import React, { useState } from "react";
//import Material UI Dependancies
import {
  Button,
  Modal,
  Box,
  Typography,
  Paper,
  TextField,
  Grid,
  Stack
} from "@mui/material";

import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import StaticDatePicker from "@mui/lab/StaticDatePicker";
import Fade from "@mui/material/Fade";

import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DateTimePicker from "@mui/lab/DateTimePicker";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { ExpandMoreIcon, CancelIcon } from "@mui/icons-material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: "80vw",
  maxWidth: "80vw",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4
};

const spreadbox = {
  justifyContent: "space-around",
  alignItems: "center"
};

export default function MyCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setOpen(true);
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //Set the minimum and maximum date a user can select
  const minDate = new Date("2020-01-01T00:00:00.000");
  const maxDate = new Date("2034-01-01T00:00:00.000");

  const [value, setValue] = React.useState(new Date("2020-11-28T12:00:00"));
  const handleChange = (newValue) => {
    setValue(newValue);
  };

  return (
    //Static Calendar that provides view & Date&Time
    //Initiates a modal when date clicked
    //Allows user to schedule a workout from that day
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper style={{ overflow: "auto" }}>
        <StaticDatePicker
          orientation="portrait"
          openTo="day"
          minDate={minDate}
          maxDate={maxDate}
          value={selectedDate}
          onChange={handleDateChange}
          renderInput={(params) => <TextField {...params} />}
        />
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          BackdropProps={{
            timeout: 500
          }}
        >
          <Fade in={open}>
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Workouts:
              </Typography>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Schedule Workout
                  </Typography>
                </AccordionSummary>

                <Stack container spacing={0.5} item xs={12} direction="row">
                  {/* {children} */}
                  <DateTimePicker
                    showToolbar={false}
                    label="Select Date & Time"
                    value={value}
                    onChange={handleChange}
                    renderInput={(params) => <TextField {...params} />}
                  />
                  <Button
                    size="Large"
                    margin="right"
                    onClick={handleOpen}
                    variant="contained"
                    startIcon={<AddCircleOutlineOutlinedIcon />}
                  >
                    Confirm
                  </Button>
                  {/* {children} */}
                  <Button
                    color="error"
                    size="Large"
                    margin="right"
                    onClick={handleClose}
                    variant="contained"
                    startIcon={<AddCircleOutlineOutlinedIcon />}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Accordion>
            </Box>
          </Fade>
        </Modal>
      </Paper>
    </LocalizationProvider>
  );
}
