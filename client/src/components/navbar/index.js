import React from 'react'
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Link,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import logo from 'staticImages/ic-logo.png'

import LinkTo from 'components/navigation/LinkTo'

const useStyles = makeStyles(theme => ({
  appBar: {
    background: 'white',
    color: 'black',
    elevation: 0,
    zIndex: theme.zIndex.drawer + 1,
  },
  logo: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    marginRight: theme.spacing(1),
  },
  title: {
    flexGrow: 1,
  },
  titleLink: {
    '&:hover': {
      textDecoration: 'None',
    },
  },
}))

function NavBar({ currentUser, userProfile }) {
  const classes = useStyles()
  return (
    <Box mb={8}>
      <AppBar variant='outlined' className={classes.appBar} position='fixed'>
        <Toolbar>
          <Link component={LinkTo} to='/'>
            <img
              className={classes.logo}
              src={logo}
              alt='Product Launch Logo'
            ></img>
          </Link>
          <Typography variant='h6' className={classes.title} component='h1'>
            <Link
              component={LinkTo}
              to='/'
              className={classes.titleLink}
              color='inherit'
            >
              Product Launch
            </Link>
          </Typography>

          {currentUser && (
            <Button color='inherit' component={LinkTo} to={userProfile}>
              {currentUser.login_email}
            </Button>
          )}

          <Button color='inherit' component={LinkTo} to={'/'}>
            Explore
          </Button>
          <Button
            color='inherit'
            component={LinkTo}
            to={userProfile ? `${userProfile}/projects/create` : '/signup'}
          >
            Create
          </Button>
          {!currentUser && (
            <div>
              <Button color='inherit' component={LinkTo} to='/login'>
                Login
              </Button>
              <Button color='inherit' component={LinkTo} to='/signup'>
                Signup
              </Button>
            </div>
          )}
          {currentUser && (
            <div>
              <Button color='inherit' component={LinkTo} to='/logout'>
                Logout
              </Button>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default NavBar
