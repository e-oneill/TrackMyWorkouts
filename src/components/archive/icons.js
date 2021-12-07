import * as React from "react";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import { Button, Modal, Box, Typography, Paper } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4
};

export default function Icons() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Box textAlign="center">
        <Paper
          container
          direction="column"
          justifyContent="space-evenly"
          alignItems="baseline"
          sx={{
            "& > :not(style)": {
              m: 2
            }
          }}
        >
          <Button
            margin="normal"
            onClick={handleOpen}
            variant="contained"
            startIcon={<AddCircleOutlineOutlinedIcon />}
            Book
            Workout
            endIcon={<ArrowForwardIosOutlinedIcon />}
          >
            Book Workout
          </Button>

          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Workout Booked
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <h4> Date and Time: </h4>
              </Typography>
            </Box>
          </Modal>
        </Paper>
      </Box>
    </div>
  );
}
