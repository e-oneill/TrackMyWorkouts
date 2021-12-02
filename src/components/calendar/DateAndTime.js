import * as React from "react";

import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DateTimePicker from "@mui/lab/DateTimePicker";
import { Box, Paper, TextField } from "@mui/material";

import DateAdapter from "@mui/lab/AdapterDateFns";

export default function dateandtime({ children }) {
  const [value, setValue] = React.useState(new Date("2020-11-28T12:00:00"));

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  return (
    <Box textAlign="center">
      <Paper>
        <LocalizationProvider dateAdapter={DateAdapter}>
          {children}
          <DateTimePicker
            label="Select Date & Time"
            value={value}
            onChange={handleChange}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </Paper>
    </Box>
  );
}
