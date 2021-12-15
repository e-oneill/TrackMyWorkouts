import React, {useEffect, useState} from "react"
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';



const inputStyle = {
  marginTop: 1,
  marginBottom: 1,
  width: 80
}

function RestTimer({duration, startTimer}) {
  const [started, setStarted] = useState(false);
  const [remaining, setRemaining] = useState(duration);

  useEffect(() => {
    if (started === true)
    {
      const timer = setTimeout(() => {
        setRemaining(remaining - 1)
      }, 1000)
  
      if (remaining === 0)
      {
        clearTimeout(timer);
        startTimer();
      }

      return () => clearTimeout(timer)
    }
    

  
  })

function handleChange(e) {
  setRemaining(e.target.value)
}

  

  return(
    <div style={{display:'flex', alignItems: 'center', gap: 4, flexDirection: 'column', padding: 5}}>
      <Typography variant="h5">
        Rest
      </Typography>
      {(started) ? 
      
      <Typography variant="h4">
        {remaining}
      </Typography>
      
      : <div style={{display:'flex', alignItems: 'center', gap: 4, flexDirection: 'column', padding: 5}}>
          <Typography>Set Timer</Typography>
          <FormControl sx={inputStyle} fullWidth variant="outlined" required>
            <InputLabel htmlFor="outlined-name">Seconds</InputLabel>
            <OutlinedInput
              id="timer-length"
              type="number"
              
              value={remaining}
              onChange={handleChange}
              label="Seconds"
            />
          </FormControl>
        </div>
      }
      
      {(started) ? <Button size="small" onClick={startTimer} variant="contained">Finish</Button>
      : <Button size="small" onClick={() => setStarted(true)} variant="contained" color="success"> Start Timer </Button>  
      }
      
    </div>
  )
}

export default RestTimer;