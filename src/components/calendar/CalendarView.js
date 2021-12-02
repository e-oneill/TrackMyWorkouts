import React from "react";

import { Paper } from "@material-ui/core";
import MyCalendar from "../calendar/Calendar.js";
import BottomAppBar from "../calendar/BottomBar";
import workoutInfo from "../calendar/WorkoutInfo.js";

class calendarView extends React.Component {
  render() {
    return (
      <Paper style={{ overflow: "hidden" }}>
        <MyCalendar />
        <BottomAppBar />
        <workoutInfo />
      </Paper>
    );
  }
}

export default calendarView;
