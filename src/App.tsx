import React, { useEffect, useState } from 'react';
import './App.css';
import { AppBar, Button, Card, createStyles, Grid, IconButton, makeStyles, Paper, Theme, Toolbar, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import Divider from '@material-ui/core/Divider';
import { useSnackbar } from 'notistack';
import BackspaceIcon from '@material-ui/icons/Backspace';
import Attempt from './Attempt/attempt';

import Guess from './Guess/guess';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    root_two: {
      width: 'fit-content',
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.secondary,
      '& svg': {
        margin: theme.spacing(1.5),
      },
      '& hr': {
        margin: theme.spacing(0, 0.5),
      },
    },
  }),
  
);



const samePosition = (numb:number, pin:number[], pos:number) => {
  const index = pin.findIndex((item)=> item === numb);
  return pos === index ? true : false;
}


const evaluateNumber = (guessNumber:number, pin: number[],pos:number) => {  
    if(!pin.includes(guessNumber)){
      
      return { number:guessNumber,color: 'red'};
    }else{
      if(samePosition(guessNumber,pin,pos)){
        
        return { number:guessNumber,color: 'green'};
      }else{
        
        return { number:guessNumber,color: 'orange'};
      }
    }
}

const hasWon = (tempArray: any[]) => {
  let winner = true;
  for(let i = 0; i < tempArray.length; i++){
    if(tempArray[i].color !== 'green')
      winner = false
  }
  return winner;
}


const getRandomPin = () =>{
  let pin = [];
  let arr = [0,1,2,3,4,5,6,7,8,9];
  for(let i = 0; i < 4; i++){
    const rndInt = arr[Math.floor(Math.random() * arr.length)];
    pin.push(rndInt);
    arr.splice(arr.indexOf(rndInt), 1);
  }
  return pin;
}



function App() {

  const classes                         = useStyles();
  const [attempts,setAttempts]          = useState<any[]>([]);
  const { enqueueSnackbar }             = useSnackbar();
  const [won,setWon]                    = useState<boolean>(false);
  const [secondsLeft,setSecondsLeft]    = useState<number>(60);
  const [guess,setGuess]                = useState<any[]>([]);
  const numbers                         = [0,1,2,3,4,5,6,7,8,9]
  const [pin,setPin]                    = useState<number[]>([]);


  useEffect(() => {
    if(pin.length === 0)
      setPin(getRandomPin());
    if(secondsLeft === 10)
      enqueueSnackbar('10 seconds left', { variant: "warning", anchorOrigin: { horizontal: "right", vertical: "bottom" } });
    if(secondsLeft === 0 && !won){
      enqueueSnackbar('You could not crack code in time', { variant: "error", anchorOrigin: { horizontal: "right", vertical: "bottom" } });
    }
    if(won){
      setSecondsLeft(0);
    }

    if(secondsLeft > 0){
      const timerId = setTimeout(() => {
        if(guess.length === 4){
          let temp = [];
          for(let i = 0; i < guess.length; i++){
              let maping = evaluateNumber(guess[i],pin,i);
              temp.push(maping);
          }
          if(hasWon(temp)){
            enqueueSnackbar('You are a genius', 
              { 
                variant: "success", 
                anchorOrigin: { horizontal: "right", vertical: "bottom" } 
              }
            );
            setWon(true);
          }else{
            setAttempts([temp,...attempts]);
            setGuess([]);
          }
        }
        setSecondsLeft(secondsLeft - 1);
      },1000)
      return() => clearTimeout(timerId);
    }
  },[secondsLeft]);

  const addNumber = (numb:number) => {
    setGuess([...guess, numb]);
  }

  const reset = () => {
    setGuess([]);
    setPin([]);
    setAttempts([])
    setWon(false);
    setSecondsLeft(60);
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Crackpin
          </Typography>
          {/* <Button color="inherit">Login</Button> */}
        </Toolbar>
      </AppBar>

      <Typography style={{textAlign:'center'}} variant="h4">Guess the 4 digit pin</Typography>
      <Grid container>
        <Grid item xs={3}>

        </Grid>
        <Grid item xs={6}>
          <Guess guess={guess} />
        </Grid>
        
        <Grid item xs={3}>

        </Grid>
      </Grid>

      <Grid container alignItems="center" className={classes.root_two}>
        <Grid item xs={6}>
            {
              numbers.map( number => (
                <Button variant="contained" onClick={() => {addNumber(number)}}>{number}</Button>
              ))
              
            }
            <Button
              size="small"
              style={{zoom:'0.7'}}
              variant="contained"
              color="secondary"
              startIcon={<BackspaceIcon />}
              onClick = {() => { guess.pop()}}
            >
            </Button>
        </Grid>
        
        <Divider style={{color:'#FFFFFF'}} orientation="vertical" flexItem />
        {
          won ? 
          <Card>
            <Typography style={{color:'green'}} variant="h6">
              You cracked the code!!
            </Typography>
            <Button
              style={{margin:'auto'}}
              variant="contained"
              color="secondary"
              onClick = {() => {
                reset();
              }}
            >
              Play Again
            </Button>
          </Card>
          :
          <Grid item xs={5}>
            {
              secondsLeft > 0 ?
              <>
                <Typography variant="h6"> Previous attempts</Typography>
                <Paper>
                  <Grid container>
                    {
                      attempts.map(attempt => (
                        attempt.map((digit:any) => (
                          <Attempt number={digit.number} color={digit.color} />
                        ))
                        
                      ))
                    }
                  
                  </Grid>
                </Paper>
              </>
              :
              <Card>
                <Typography style={{color:'orange'}} variant="h6">Times Up</Typography>
                  <Button
                    style={{margin:'auto'}}
                    variant="contained"
                    color="secondary"
                    onClick = {() => {
                      reset();
                    }}
                  >
                    Play Again
                  </Button>
              </Card>
              
            }
            
          </Grid>
        }
      </Grid>
      {
        secondsLeft > 0 && !won ?
        <Typography>Time remaining: {secondsLeft}</Typography>
        :
        <div></div>
      }
      
  </>

  );
}

export default App;
