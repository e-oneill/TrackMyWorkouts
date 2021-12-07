import React, { useState } from "react";

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import StaticDatePicker from "@mui/lab/StaticDatePicker";
import locale from 'date-fns/locale/en-IE';
import DateTimePicker from '@mui/lab/DateTimePicker';

import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import Grid from "@mui/material/Grid";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

import Button from "@mui/material/Button";


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

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(new Date());

  const minDate = new Date("2020-01-01T00:00:00.000");
  const maxDate = new Date("2034-01-01T00:00:00.000");

  function handleDateChange(date) {
    setSelectedDate(date);
    setOpen(true);
  };

  function handleOpen() {
    setOpen(true);
  } 
  
  function handleClose() {
    setOpen(false);
  }

  function handleChange(newValue) {
    setValue(newValue);
  };

  

  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDateFns} locale={locale}>
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
        >
          <Fade in={open}>
            <Box sx={style}>
            <Accordion>
              <AccordionSummary>
                <Typography>
                  Select a Workout:
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Workout
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Grid container spacing={1} style={{marginTop: '1em'}}>
              <Grid item xs={12}>
              <DateTimePicker
                    
                    showToolbar={false}
                    label="Select Date & Time"
                    value={value}
                    onChange={handleChange}
                    renderInput={(params) => <TextField fullWidth {...params} />}
                  />
              </Grid>
              <Grid item xs={12} style={{display:'flex', gap: 8}}>
                <Button
                size="Large"
                margin="right"
                onClick={handleOpen}
                variant="contained"
                style={{width: '16em'}}
                color="success">
                  Schedule Workout
                  </Button>
                <Button
                size="Large"
                margin="right"
                onClick={handleClose}
                variant="contained"
                color="error"
                style={{float: 'right'}}>
                  Cancel
                </Button>
              </Grid>
            </Grid>
            </Box>
          </Fade>
          
        </Modal>
      
      </Paper>
      </LocalizationProvider>
    </div>
  )
}