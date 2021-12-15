import React from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';



import Grid from '@mui/material/Grid';



const cardStyle = {
  // display: 'grid',
  // justifyContent: 'center',
  backgroundColor: '#e0e0e0', 
  padding: 4,
  margin: 4,
  maxWidth: '100%'
}

const setHeader = {
  fontWeight: 500,
  display: 'flex',
  justifyContent: 'center'
}

const exerciseInput = {
  m: 1, 
  // width: '30%',
  backgroundColor: 'white'
}

const exerciseButton = {
  display: 'flex',
  margin: 1,
  
  width: '97.5%',
  height: '1.4375em',
  padding: '16.5px 14px',
  fontSize: '1rem'
}



class Exercise extends React.Component {
  constructor(props)
  {
    super(props);
    let currSet = true;
    this.props.details.set = this.props.set;
    // console.log("Current Set: ", this.props.currSet, " This Set: ", this.props.set);
    if (this.props.set === this.props.currSet && this.props.currExercise === this.props.details.name)
    {
      currSet = false;
      
    }

    this.state = {
      currSet: currSet,
      weight: this.props.details.weight,
      reps: this.props.details.reps,
      overrideWorkoutSet: false
    }

    
    // console.log(this.props)
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  

  handleTextChange(e) 
  {
    if (e.target.id === "outlined-weight")
    {
      this.setState({weight: e.target.value})
      this.props.details.weight = parseFloat(e.target.value, 10);
    }
    if (e.target.id === "outlined-reps")
    {
      this.setState({reps: e.target.value})
      this.props.details.reps = parseFloat(e.target.value, 10)
      
    }
  }

  handleDoubleClick()
  {
    // console.log("Double click")
    this.setState({currSet: false, overrideWorkoutSet: true})
  }

  handleBlur()
  {
    if (this.state.overrideWorkoutSet)
    {
      this.setState({currSet: true, overrideWorkoutSet: false})
    
    }
  }

  componentDidUpdate() {
    // console.log(this.state.currSet);
    if (this.props.currSet === this.props.set && this.state.currSet 
      && this.props.currExercise === this.props.details.name
      )
    {  
      this.setState({currSet: false})
    }
    else if (!this.state.overrideWorkoutSet && !this.state.currSet && (this.props.currSet !== this.props.set 
      || this.props.currExercise !== this.props.details.name)
      ) 
    {
      this.setState({currSet: true})
    }
  }


  render() {
    const blurFunction = (this.state.overrideWorkoutSet) ? () => {this.props.saveExercise(this.props.details, this.props.set, this.props.exerciseIndex); this.handleBlur()} : null;
    return (
      
      <Grid item xs={12} id={this.state.Exercise + "-" + this.props.set} onBlur={blurFunction} onDoubleClick={this.handleDoubleClick} style={{display:'flex', alignItems: 'center', flexDirection: 'column'}}>
         <Grid container spacing={1} style={{width: '100%', display: 'flex', flexDirection: 'row'}}>
          {/* {(this.state.currSet) &&
              <div id={this.props.details.name+"-"+this.props.set} 
              style={{
                      // width:'100%', 
                      
                      position: 'absolute', 
                      height:'100%', 
                      // left: '0px', 
                      // right: '0px', 
                      // bottom: '0px', 
                      // top: '0px', 
                      zIndex: '99999'}}>

                      </div>
          } */}
          <Grid item xs={8}>
          <FormControl fullWidth sx={exerciseInput}  variant="outlined">
          <InputLabel htmlFor="outlined-email">Weight (kg)</InputLabel>
          <OutlinedInput
            id="outlined-weight"
            type="number"
            value={this.props.details.weight}
            onChange={this.handleTextChange}
            label="Weight (KG)"
            disabled={this.state.currSet}
          />
          </FormControl>
          </Grid>
          <Grid item xs={4}>
          <FormControl sx={exerciseInput}  variant="outlined">
          <InputLabel htmlFor="outlined-email">Reps</InputLabel>
          <OutlinedInput
            id="outlined-reps"
            type="number"
            value={this.state.reps}
            onChange={this.handleTextChange}
            label="Reps"
            disabled={this.state.currSet}
            
          />
          </FormControl>
          </Grid>
          </Grid>
          
          {(!this.state.currSet && !this.state.overrideWorkoutSet ) && 
          // <div>
          <Button disabled={(this.state.weight > 0 || this.props.details.weight) ? false : true} variant="contained"  onClick={() => {this.props.saveExercise(this.props.details, this.props.set, this.props.exerciseIndex)}} style={exerciseButton}>
            Save Set
          </Button>
          // </div>
}
        </Grid>
    )
  }
}

function Sets(props) {
  var set = [];
  for (let i = 0; i < props.sets; i++)
  {
    set.push(<Grid item xs={12}><Exercise currExercise={props.currExercise} exerciseIndex={props.exerciseIndex} saveExercise={props.saveExercise} set={i+1} currSet={props.currSet} details={props.details}/></Grid>);
  }

  return <Card style={cardStyle}>
          <Grid item xs={12}>
          <Typography style={setHeader}>{props.details.name}</Typography>
          </Grid>
          <Grid item xs={12}>
          <Accordion  sx={{ m: 1, width: 'auto' , "&&expanded" : {
          margin: 1,
          
        }}}>
            <AccordionSummary>
              <Typography>
                Expand for info

              </Typography>
            </AccordionSummary>
            <AccordionDetails style={{display:'grid', alignItems:'center'}}>
              <img src={props.details.img} alt={props.details.name} style={{width:'100%', height: '100%'}} />
              <Typography style={{marginBottom: 12}}>
                Target Muscle: {props.details.dominantMuscle} <br />
                {/* Tips: {props.details.cues} */}
              </Typography>
              <Button variant="contained" color="success">
                See More
              </Button>
              
            </AccordionDetails>
          </Accordion>
          </Grid>
          
          {set}
          
          </Card>;
}

class WorkoutCard extends React.Component {
  // constructor(props)
  // {
  //   super(props);
    
  // }

  
  
  render() {
    // console.log(this.props.details);
    return (
      <Grid container>
        <Grid item xs={12}>
        
        {<Sets currExercise={this.props.currExercise} exerciseIndex={this.props.exerciseIndex} saveExercise={this.props.saveExercise} currSet={this.props.currSet} details={this.props.details} sets={this.props.sets} />}
        </Grid>
        
      </Grid>
    )
  }
}

export default WorkoutCard;