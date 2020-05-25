import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Divider,
  Button,
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

import NavBar from "../components/Navbar";

import { validateEmail } from "../util/validateEmail";

const useStyles = makeStyles((theme) => ({
  header: {
    padding: "2rem",
    borderBottom: "2px",
    borderBottomColor: theme.primary,
  },
  loginLink: {
    marginLeft: "2px",
  },
  subtitle: {
    padding: "2rem",
  },
  divider: {
    backgroundColor: theme.primary,
    height: "2px",
    width: "10%",
    margin: "auto",
  },
  button: {
    backgroundColor: theme.primary,
    marginTop: "4rem",
    marginBottom: "4rem",
    color: theme.bgcolor,
    height: "3rem",
    width: "60%",
  },
}));

function Signup(props) {
  const classes = useStyles();

  // State variables
  const [name, setName] = useState("");
  const [invalidName, setInvalidName] = useState(false);
  const [email, setEmail] = useState("");
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [password, setPassword] = useState("");
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [invalidConfirm, setInvalidConfirm] = useState(false);

  // Name handlers
  const handleUpdateName = (event) => {
    setName(event.target.value);
  };

  const handleBlurName = (event) => {
    const isInvalidName = name.length < 3 || name.length > 64;
    setInvalidName(isInvalidName);
  };

  // Email handlers
  const handleUpdateEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleBlurEmail = (event) => {
    setInvalidEmail(!validateEmail(email));
  };

  // Password handlers
  const handleUpdatePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleBlurPassword = (event) => {
    const isInvalidPassword = password.length < 6 || password.length > 64;
    setInvalidPassword(isInvalidPassword);
  };

  const handleUpdateConfirm = (event) => {
    setConfirm(event.target.value);
  };

  const handleBlurConfirm = (event) => {
    const isInvalidConfirm = confirm !== password;
    setInvalidConfirm(isInvalidConfirm);
  };

  // Signup submit handler
  const handleSignup = (event) => {
    /* TODO: call backend */
  };

  return (
    <div>
      <NavBar />
      <Container maxWidth="sm">
        <Typography variant="h2" align="center" className={classes.header}>
          <Box fontWeight="fontWeightMedium" fontSize={40}>
            Create an account
          </Box>
        </Typography>

        <Divider fullWidth classes={{ root: classes.divider }} />

        <Typography
          variant="subtitle1"
          align="center"
          className={classes.subtitle}
        >
          <Box fontWeight="fontWeightMedium" fontSize={16}>
            Already a member?
            <Link to="/login" className={classes.loginLink}>
              Login
            </Link>
          </Box>
        </Typography>

        <form autoComplete="off">
          <Grid
            container
            spacing={2}
            xs={12}
            direction="column"
            alignItems="stretch"
          >
            <Grid item>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                error={invalidName}
                helperText={
                  invalidName ? "Name must be between 3 and 64 characters" : ""
                }
                onChange={handleUpdateName}
                onBlur={handleBlurName}
              />
            </Grid>

            <Grid item>
              <TextField
                label="Email address"
                variant="outlined"
                fullWidth
                error={invalidEmail}
                helperText={invalidEmail ? "Must be a valid email format" : ""}
                onChange={handleUpdateEmail}
                onBlur={handleBlurEmail}
              />
            </Grid>

            <Grid item>
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                error={invalidPassword}
                helperText={
                  invalidPassword
                    ? "Password must be between 6 and 64 characters"
                    : ""
                }
                onChange={handleUpdatePassword}
                onBlur={handleBlurPassword}
              ></TextField>
            </Grid>

            <Grid item>
              <TextField
                label="Confirm password"
                variant="outlined"
                fullWidth
                error={invalidConfirm}
                helperText={invalidConfirm ? "Must match password" : ""}
                onChange={handleUpdateConfirm}
                onBlur={handleBlurConfirm}
              ></TextField>
            </Grid>

            <Grid item align="center">
              <Button
                className={classes.button}
                size="large"
                variant="contained"
              >
                CREATE ACCOUNT
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </div>
  );
}

export default Signup;