import React, { useState, useEffect } from "react";
import { ThemeProvider } from "@material-ui/styles";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

import { theme } from "./themes/theme";
import ProtectedRoute from "./components/ProtectedRoute";

import UserDashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Project from "./pages/Project";
import CreateProject from "./pages/CreateProject";
import EditProject from "./pages/EditProject";
import FundProject from "./pages/FundProject";
import NotFound from "./pages/404NotFound";
import Main from "./pages/Main";
import Logout from "./pages/Logout";
import Explore from "./pages/Explore";

import "./App.css";

function App() {
  // True: User signed in, False: User Logged Out
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuth") ? true : false
  );
  async function handleUserLog(isAuth) {
    await localStorage.setItem("isAuth", isAuth);
    await setIsAuthenticated(isAuth);
  }

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Route
          path="/"
          render={(props) => (
            <Main
              {...props}
              handleUserLog={handleUserLog}
              isAuthenticated={isAuthenticated}
            />
          )}
        />
        <Switch>
          <Route
            path="/profile/:profileId/projects/:projectId/edit"
            component={EditProject}
          />
          <Route
            path="/profile/:id/projects/create"
            component={CreateProject}
          />

          <ProtectedRoute
            path="/profile/:id"
            component={UserDashboard}
            isAuthenticated={isAuthenticated}
          />

          <Route path="/project/:projectId/fund" component={FundProject} />
          <Route path="/project" component={Project} />

          <Route
            path="/signup"
            render={(props) => (
              <Signup {...props} handleUserLog={handleUserLog} />
            )}
          />
          <Route
            path="/login"
            render={(props) => (
              <Login {...props} handleUserLog={handleUserLog} />
            )}
          />
          <Route
            path="/logout"
            render={(props) => (
              <Logout {...props} handleUserLog={handleUserLog} />
            )}
          />

          <Route path="/" exact component={Explore} />
          <Route path="/404" component={NotFound} />
          <Redirect from="*" to="/404" />
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
