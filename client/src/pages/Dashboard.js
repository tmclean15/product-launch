import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'

import {
  Typography,
  Container,
  Box,
  Avatar,
  Button,
  Divider,
  Grid,
  IconButton,
  Tab,
} from '@material-ui/core'
import { TabPanel, TabContext, TabList } from '@material-ui/lab'
import LinkedInIcon from '@material-ui/icons/LinkedIn'
import { makeStyles } from '@material-ui/core/styles'
import EditProfileDialog from '../components/EditProfileDialog'
import ProjectCard from '../components/ProjectCard'
import LinkTo from '../components/navigation/LinkTo'
import angelco from '../staticImages/AngelList_Black_Victory_Hand.png'

const useStyles = makeStyles(theme => ({
  root: {
    color: 'black',
    height: '100vh',
  },
  userInfoShadow: {
    paddingTop: theme.spacing(3),
    boxShadow: '0px 0px 17px 6px rgba(200,200,200,.3)',
  },
  avatar: {
    width: theme.spacing(15),
    height: theme.spacing(15),
  },
  sendMessage: {
    padding: '.8rem 2rem',
  },
  roundButton: {
    borderRadius: '30px',
    padding: '0.2rem 1rem',
    fontSize: '0.7rem',
    margin: '1px',
    fontWeight: '600',
  },
  highlightButton: {
    borderRadius: '30px',
    padding: '0.2rem 1rem',
    fontSize: '0.7rem',
    marginRight: '0.5rem',
    fontWeight: '600',
    backgroundColor: theme.primary,
    color: 'white',
    border: '0px',
    '&:hover': {
      backgroundColor: theme.highlight,
    },
  },
  media: {
    height: theme.spacing(35),
  },
  ySpacing: {
    margin: '2rem 0',
  },
  projectContainer: {
    padding: '0 4rem',
  },
  cardTitle: {
    fontWeight: '500',
  },
  cardInvested: {
    fontWeight: '500',
  },
}))

function UserInfo(props) {
  const classes = useStyles()
  const user = props.user

  const [isOwnProfile, setIsOwnProfile] = useState(false)

  useEffect(() => {
    axios.get('/api/v1/me').then(res => {
      if (res.data.user_id === user.id) setIsOwnProfile(true)
    })
  }, [isOwnProfile])

  const handleLinkedin = event => {
    window.location.assign(user.linkedin)
  }

  const handleAngelco = event => {
    window.location.assign(user.angelco)
  }

  return (
    <Box height='100%' className={classes.userInfoShadow}>
      <Container align='center'>
        {/* Avatar */}
        {user.current_avatar > 0 || user.current_avatar === 0 ? (
          <Avatar
            className={classes.avatar}
            src={
              process.env.REACT_APP_AWS_ROOT +
              user.profile_pics[user.current_avatar]
            }
          />
        ) : (
          // Default avatar
          <Avatar className={classes.avatar} />
        )}
        {/* User Info */}
        <Box marginBottom='1rem' marginTop='1rem'>
          <Typography variant='h6' component='p'>
            {user.username}
          </Typography>
          <Typography color='textSecondary'>{user.location}</Typography>
        </Box>

        {isOwnProfile ? (
          <EditProfileDialog
            user={user}
            handleUserEdited={props.handleUserEdited}
          />
        ) : (
          <Box className={classes.ySpacing}>
            <Button
              className={classes.sendMessage}
              size='large'
              variant='outlined'
              disableElevation
            >
              Send a Message
            </Button>
          </Box>
        )}

        {/* Description */}
        <Box className={classes.ySpacing}>
          <Typography>{user.description}</Typography>
        </Box>

        {/* Expertise */}
        <Box marginTop={2}>
          <Typography fontWeight='fontWeightMedium'>Expertise</Typography>
          {user.expertise.map((value, step) => {
            return (
              <Button
                key={step}
                className={classes.roundButton}
                variant='outlined'
                size='small'
              >
                {value}
              </Button>
            )
          })}
        </Box>
      </Container>

      <Divider className={classes.ySpacing} />

      {/* Looking to Invest in */}
      <Box>
        <Container align='center'>
          <Typography fontWeight='fontWeightMedium'>
            Looking to invest in
          </Typography>

          {user.invest_in.map((value, step) => {
            return (
              <Button
                key={step}
                className={classes.highlightButton}
                variant='outlined'
                size='small'
              >
                {value}
              </Button>
            )
          })}
        </Container>
      </Box>

      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        margin='2rem'
      >
        {user.linkedin && (
          <IconButton onClick={handleLinkedin}>
            <LinkedInIcon fontSize='large' />
          </IconButton>
        )}

        {user.angelco && (
          <Button onClick={handleAngelco}>
            <img src={angelco} width='24' height='24' />
          </Button>
        )}
      </Box>
    </Box>
  )
}

function UserDashboard(props) {
  const classes = useStyles()

  const [tab, setTab] = useState('1')
  const [user, setUser] = useState()
  const [projects, setProjects] = useState([])
  const [fundedProjects, setFundedProjects] = useState([])
  const [error, setError] = useState()
  const history = useHistory()

  const handleUserEdited = user => {
    setUser(user)
  }

  const id = props.match.params.id

  useEffect(() => {
    async function fetchUser() {
      const userRes = await axios(`/api/v1/users/${id}/profile`)
      setUser(userRes.data)
    }
    async function fetchProject() {
      const projRes = await axios(`/api/v1/users/${id}/projects`)
      setProjects(projRes.data)
    }
    async function fetchFundedProject() {
      const projFundRes = await axios(`/api/v1/users/${id}/projects/funded`)
      setFundedProjects(projFundRes.data)
    }
    async function fetchData() {
      try {
        await Promise.all([fetchUser(), fetchProject(), fetchFundedProject()])
      } catch (err) {
        console.dir(err)
        setError(err)
      }
    }
    fetchData()
  }, [id])

  const handleTabChange = (event, newTab) => {
    setTab(newTab)
  }

  if (error) {
    history.push('/404')
    return null
  } else {
    return (
      <Grid container className={classes.root}>
        {/* User Information Sidebar */}
        <Grid item xs={3}>
          {user ? (
            <UserInfo user={user} handleUserEdited={handleUserEdited} />
          ) : (
            ''
          )}
        </Grid>
        {/* Invested in and Personal Projects */}

        <Grid item xs={9}>
          <Container>
            <Grid container>
              <TabContext value={tab}>
                <Grid item xs={12}>
                  <TabList onChange={handleTabChange} variant='fullWidth'>
                    <Tab value='1' label='Projects' />
                    <Tab value='2' label='Invested In' />
                  </TabList>
                </Grid>

                <Grid item xs={12}>
                  <TabPanel value='1'>
                    <Grid container spacing={4} direction='row'>
                      {projects.length
                        ? projects.map((value, step) => {
                            return (
                              <Grid item xs={6} key={step}>
                                <ProjectCard key={step} project={value} />
                              </Grid>
                            )
                          })
                        : ''}
                    </Grid>
                  </TabPanel>

                  <TabPanel value='2'>
                    <Grid container spacing={4} direction='row'>
                      {fundedProjects.length
                        ? fundedProjects.map((value, step) => {
                            return (
                              <Grid item xs={6} key={step}>
                                <ProjectCard key={step} project={value} />
                              </Grid>
                            )
                          })
                        : ''}
                    </Grid>
                  </TabPanel>
                </Grid>
              </TabContext>
            </Grid>
          </Container>

          {/* <Container className={classes.projectContainer}>
            <Typography className={classes.ySpacing} variant="h2">
              <Box fontWeight="fontWeightMedium">Projects: </Box>
            </Typography>
            <Grid container spacing={6}>
              {projects.length
                ? projects.map((value, step) => {
                    return (
                      <Grid item xs={6} key={step}>
                        <ProjectCard key={step} project={value} />
                      </Grid>
                    );
                  })
                : ""}
            </Grid>
            {fundedProjects.length ? (
              <Typography className={classes.ySpacing} variant="h2">
                <Box fontWeight="fontWeightMedium">Invested In: </Box>
              </Typography>
            ) : (
              ""
            )}
            <Typography className={classes.ySpacing} variant="h2">
              <Box fontWeight="fontWeightMedium">Invested In: </Box>
            </Typography>
            <Grid container spacing={6}>
              {fundedProjects.length ? (
                fundedProjects.map((value, step) => {
                  return (
                    <Grid item xs={6} key={step}>
                      <ProjectCard key={step} project={value} />
                    </Grid>
                  );
                })
              ) : (
                <Button color="inherit" component={LinkTo} to={"/"}>
                  Explore
                </Button>
              )}
            </Grid>
          </Container> */}
        </Grid>
      </Grid>
    )
  }
}

export default UserDashboard
