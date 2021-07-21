import { Grid, List, ListItem, ListItemText, Paper, Typography } from "@material-ui/core";
import React from "react";

export interface AttemptProps{
    color: string;
    number: number;
}
const Attempt : React.FC<AttemptProps> = ({color, number}) => {

    return (
        <Grid item xs={3}>
            <Paper style={{textAlign:'center',backgroundColor:color}}>
                <Typography  variant="h5">{number}</Typography>
            </Paper>
        </Grid>
    );
}

export default Attempt;