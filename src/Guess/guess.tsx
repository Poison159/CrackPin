import { Card, Grid, Paper, Typography } from "@material-ui/core";
import React from "react";

export interface GuessProps{
    guess: any[];
   
}

const Guess : React.FC<GuessProps> = ({guess}) => {
    return(
        <Card style={{border:'solid 1px',height:'35px',width:'100%'}}>
            <Grid container>
            
              {
                guess.map(numb => (
                  <Grid item xs={3}>
                    
                      <Paper style={{textAlign:'center',backgroundColor:"#3f51b5"}}>
                        <Typography  variant="h5">{numb}</Typography>
                      </Paper>
                  </Grid>
                ))
              }
              
            </Grid>
          </Card>
    );
}

export default Guess;