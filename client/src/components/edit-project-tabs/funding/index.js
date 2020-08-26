import React, { useState, useEffect } from "react";
import axios from "axios";
import MomentUtils from "@date-io/moment";
import moment from "moment";
import { Grid, Typography, TextField, Button } from "@material-ui/core";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { makeStyles } from "@material-ui/core/styles";

import BackForwardArrows from "../arrows/BackForwardArrows";

const useStyles = makeStyles((theme) => ({
  mainTitle: {
    fontWeight: 500,
    fontSize: 24,
  },
  primaryButton: {
    backgroundColor: theme.primary,
    color: theme.bgcolor,
    margin: "2rem 0",
    minWidth: "150px",
  },
}));

function Funding(props) {
  const classes = useStyles();
  const { userId, project } = props;

  const [fundingGoal, setFundingGoal] = useState(
    // This converts the money string provided by backend
    // to number that can be understood by TextField
    project.funding_goal
      ? Number(project.funding_goal.replace(/[^0-9.-]+/g, ""))
      : ""
  );
  const [equity, setEquity] = useState(
    project.equity ? project.equity * 100 : ""
  );
  const [deadline, setDeadline] = useState(
    project.deadline
      ? moment(project.deadline).format()
      : moment(new Date()).format()
  );

  const handleUpdateFundingGoal = (event) => {
    setFundingGoal(Number(event.target.value));
  };

  const handleUpdateEquity = (event) => {
    if (event.target.value > 100) setEquity(100);
    else if (event.target.value < 0) setEquity(0);
    else setEquity(Number(event.target.value));
  };

  const handleUpdateDeadline = (date) => {
    //const formatted = moment(date).toISOString();
    setDeadline(date.format());
  };

  const handleContinue = (event) => {
    axios
      .put(`/api/v1/users/${userId}/projects/${project.id}`, {
        funding_goal: fundingGoal,
        equity: equity / 100,
        deadline: deadline,
      })
      .then((res) => props.handleTabChange("Payment"))
      .catch((err) => console.log(err));
  };

  const handleBack = (event) => {
    props.handleTabChange("Story");
  };

  const handleForward = (event) => {
    props.handleTabChange("Payment");
  };

  useEffect(() => {
    const update = {
      funding_goal: fundingGoal.toString(),
      equity: equity / 100,
      deadline: deadline,
    };
    if (props.openPreview) {
      props.handleEditProject({ ...project, ...update });
    }
  }, [props.openPreview]);

  return (
    <Grid container spacing={4}>
      <BackForwardArrows
        handleBack={handleBack}
        handleForward={handleForward}
      />
      <Grid item xs={12}>
        <Typography className={classes.mainTitle} gutterBottom>
          How much funding are you looking to raise?
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Typography>Funding goal amount</Typography>
        <TextField
          type="number"
          variant="outlined"
          fullWidth
          value={fundingGoal}
          onChange={handleUpdateFundingGoal}
          InputProps={{ startAdornment: "$ " }}
          disabled={project.live}
        />
      </Grid>

      <Grid item xs={12}>
        <Typography>Equity represented by funding goal</Typography>
        <TextField
          type="number"
          min={0}
          max={100}
          variant="outlined"
          fullWidth
          value={equity}
          onChange={handleUpdateEquity}
          InputProps={{ endAdornment: "%" }}
          disabled={project.live}
        />
      </Grid>

      <Grid item xs={12}>
        <Typography>Funding deadline</Typography>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <KeyboardDatePicker
            value={deadline}
            onChange={(date) => handleUpdateDeadline(date)}
            minDate={moment(new Date()).toISOString()}
            format="DD/MM/yyyy"
            disabled={project.live}
          />
        </MuiPickersUtilsProvider>
      </Grid>

      <Grid item xs={12}>
        <Button
          variant="contained"
          onClick={handleContinue}
          className={classes.primaryButton}
        >
          {project.live ? "SAVE" : "CONTINUE"}
        </Button>
      </Grid>
    </Grid>
  );
}

export default Funding;
