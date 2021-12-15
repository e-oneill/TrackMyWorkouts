import * as React from "react";
import { Paper } from "@material-ui/core";

export default function WorkoutInfo() {
  return (
    //Conditional Rendering

    // if (this.state)

    <div>
      <div className="WorkoutInfo">
        <Paper> Workout Booked:</Paper>
      </div>

      <div className="noWorkoutInfo">
        <Paper> No Workouts Booked</Paper>
      </div>
    </div>
  );
}
