import React from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  TextField,
  Divider,
  Button,
  FormHelperText,
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
  const history = useHistory();

  const [state, setState] = React.useState({
    name: "",
    invalidName: false,
    email: "",
    invalidEmail: false,
    password: "",
    invalidPassword: false,
    confirm: "",
    invalidConfirm: false,
    signupError: "",
  });

  // Name handlers
  const handleUpdateName = (event) => {
    setState({ ...state, name: event.target.value });
  };

  const handleBlurName = (event) => {
    if (state.name.length < 3 || state.name.length > 64) {
      setState({ ...state, invalidName: true });
    } else {
      setState({ ...state, invalidName: false });
    }
  };

  // Email handlers
  const handleUpdateEmail = (event) => {
    setState({ ...state, email: event.target.value });
  };

  const handleBlurEmail = (event) => {
    if (!validateEmail(state.email)) {
      setState({ ...state, invalidEmail: true });
    } else {
      setState({ ...state, invalidEmail: false });
    }
  };

  // Password handlers
  const handleUpdatePassword = (event) => {
    setState({ ...state, password: event.target.value });
  };

  const handleBlurPassword = (event) => {
    if (state.password.length < 6 || state.password.length > 64) {
      setState({ ...state, invalidPassword: true });
    } else {
      setState({ ...state, invalidPassword: false });
    }
  };

  const handleUpdateConfirm = (event) => {
    setState({ ...state, confirm: event.target.value });
  };

  const handleBlurConfirm = (event) => {
    if (state.confirm !== state.password) {
      setState({ ...state, invalidConfirm: true });
    } else {
      setState({ ...state, invalidConfirm: false });
    }
  };

  // Signup submit handler
  const handleSignup = (event) => {
    event.preventDefault();

    axios
      .post("/api/v1/register", {
        username: state.name,
        login_email: state.email,
        password: state.password,
        confirm: state.confirm,
      })
      .then((res) => {
        history.push("/profile");
      })
      .catch((error) => {
        setState({
          ...state,
          signupError: error.response.data.error,
        });
      });
  };

  const signupErrorMessage = (
    <Grid item>
      <FormHelperText error>{state.signupError}</FormHelperText>
    </Grid>
  );

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

        <form autoComplete="off" onSubmit={handleSignup}>
          <Grid
            container
            spacing={2}
            xs={12}
            direction="column"
            alignItems="stretch"
          >
            {state.signupError.length != 0 ? signupErrorMessage : ""}
            <Grid item>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                required
                value={state.name}
                error={state.invalidName}
                helperText={
                  state.invalidName
                    ? "Name must be between 3 and 64 characters"
                    : ""
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
                required
                value={state.email}
                error={state.invalidEmail}
                helperText={
                  state.invalidEmail ? "Must be a valid email format" : ""
                }
                onChange={handleUpdateEmail}
                onBlur={handleBlurEmail}
              />
            </Grid>

            <Grid item>
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                required
                value={state.password}
                error={state.invalidPassword}
                helperText={
                  state.invalidPassword
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
                required
                value={state.confirm}
                error={state.invalidConfirm}
                helperText={state.invalidConfirm ? "Must match password" : ""}
                onChange={handleUpdateConfirm}
                onBlur={handleBlurConfirm}
              ></TextField>
            </Grid>

            <Grid item align="center">
              <Button
                type="submit"
                onSubmit={handleSignup}
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
