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
  width: '30%',
  backgroundColor: 'white'
}

const exerciseButton = {
  display: 'inline-flex',
  m: 1,
  width: '10%',
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
      // console.log(this.props)
    }

    this.state = {
      currSet: currSet,
      weight: "",
      reps: this.props.details.reps,
      overrideWorkoutSet: false
    }

    

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
      
      <div id={this.state.Exercise + "-" + this.props.set} onBlur={blurFunction} onDoubleClick={this.handleDoubleClick} style={{display:'flex', alignItems: 'center'}}>
         
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
          <FormControl  sx={exerciseInput} style={{width: '50%'}} variant="outlined">
          <InputLabel htmlFor="outlined-email">Weight (kg)</InputLabel>
          <OutlinedInput
            id="outlined-weight"
            type="number"
            value={this.state.weight}
            onChange={this.handleTextChange}
            label="Weight (KG)"
            disabled={this.state.currSet}
          />
          </FormControl>
          <FormControl sx={exerciseInput} variant="outlined">
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
          {(!this.state.currSet && !this.state.overrideWorkoutSet ) && 
          <Button variant="contained" onClick={() => {this.props.saveExercise(this.props.details, this.props.set, this.props.exerciseIndex)}} style={exerciseButton}>
            Save
          </Button>
}
        </div>
    )
  }
}

function Sets(props) {
  var set = [];
  for (let i = 0; i < props.sets; i++)
  {
    set.push(<Exercise currExercise={props.currExercise} exerciseIndex={props.exerciseIndex} saveExercise={props.saveExercise} set={i+1} currSet={props.currSet} details={props.details}/>);
  }

  return <Card style={cardStyle}>
          <Typography style={setHeader}>{props.details.name}</Typography>
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
          {set}
          </Card>;
}

class WorkoutCard extends React.Component {
  // constructor(props)
  // {
  //   super(props);

  //   // this.populateSets = this.populateSets.bind(this);
  // }
  
  render() {
    // console.log(this.props.details);
    return (
      <div>
        {<Sets currExercise={this.props.currExercise} exerciseIndex={this.props.exerciseIndex} saveExercise={this.props.saveExercise} currSet={this.props.currSet} details={this.props.details} sets={this.props.sets} />}
      </div>
    )
  }
}

export default WorkoutCard;