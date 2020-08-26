import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import moment from 'moment'

import {
  Typography,
  Container,
  Box,
  Avatar,
  Button,
  Card,
  CardMedia,
  Divider,
  Tabs,
  Tab,
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

import axios from 'axios'

moment.updateLocale('en', { relativeTime: { future: '%s to go' } })

const useStyles = makeStyles(theme => ({
  root: {
    color: 'black',
  },
  avatar: {
    width: theme.spacing(15),
    height: theme.spacing(15),
  },
  projectMainImage: {
    height: theme.spacing(60),
    objectFit: 'contain',
  },
  userPanel: {
    padding: '1rem 0',
    borderTop: '6px solid black',
  },
  userDividerTop: {
    marginTop: theme.spacing(3),
  },
  userDividerBottom: {
    marginBottom: theme.spacing(3),
  },
  fundButton: {
    backgroundColor: theme.primary,
    color: theme.bgcolor,
    margin: '1rem 0',
    width: '80%',
  },
  messageButton: {
    width: '80%',
    marginTop: '1rem',
  },
  tab: {
    minWidth: theme.spacing(15),
  },
  highlightButton: {
    borderRadius: '30px',
    padding: '0.2rem 1rem',
    fontSize: '0.7rem',
    fontWeight: '600',
    backgroundColor: theme.primary,
    color: 'white',
    border: '0px',
    '&:hover': {
      backgroundColor: theme.highlight,
    },
  },
}))

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`project-tabpanel-${index}`}
      aria-labelledby={`project-tab-${index}`}
      {...other}
    >
      {value === index && (
        // You want everything in here to have lots of vertical space from each other, ideally without wrapping every single component in a spacing box
        <Box p={3} textAlign='left'>
          {children}
        </Box>
      )}
    </div>
  )
}

function AboutTab(props) {
  return (
    <div>
      <Typography variant='h4' component='h3'>
        About
      </Typography>
      <Box my={3}>
        <Typography>{props.description}</Typography>
      </Box>
    </div>
  )
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

function Header(props) {
  const classes = useStyles()
  const project = props.project
  return (
    <Box margin='2rem'>
      {project.industry.length !== 0 ? (
        <Button
          variant='outlined'
          size='large'
          className={classes.highlightButton}
        >
          {project.industry.map(ind => {
            return ind.name
          })}
        </Button>
      ) : (
        ''
      )}
      <Typography variant='h2'>
        <Box fontWeight='fontWeightMedium'>{project.title}</Box>
      </Typography>
      <Typography variant='h3' color='textSecondary'>
        {project.subtitle}
      </Typography>
    </Box>
  )
}

function ProjectPanel(props) {
  const classes = useStyles()
  const [listTabs, setListTabs] = useState([
    'ABOUT',
    'TEAM',
    'MARKET SIZE',
    'TRACTION',
    'GOALS',
    'INVESTMENT',
  ])
  const [currentTab, setCurrentTab] = useState(0)
  const handleUpdateTab = (event, newValue) => {
    setCurrentTab(newValue)
  }

  const project = props.project

  return (
    <Card>
      <CardMedia
        component='img'
        src={
          project.photos[0]
            ? process.env.REACT_APP_AWS_ROOT + project.photos[0]
            : ''
        }
        className={classes.projectMainImage}
      ></CardMedia>
      <Container>
        <Tabs
          value={currentTab}
          onChange={handleUpdateTab}
          aria-label='Project Tabs'
          variant='fullWidth'
          style={{ justifyContent: 'space-between' }}
        >
          {listTabs.map((tab, step) => {
            return (
              <Tab className={classes.tab} label={tab} {...a11yProps(step)} />
            )
          })}
        </Tabs>
      </Container>

      <TabPanel value={currentTab} index={0}>
        <AboutTab description={project.description} />
      </TabPanel>
    </Card>
  )
}

function UserInfo(props) {
  const classes = useStyles()
  const history = useHistory()

  const project = props.project
  const user = props.user
  const fromNow = moment(project.deadline).fromNow()

  const [isOwnProfile, setIsOwnProfile] = useState(false)

  useEffect(() => {
    axios.get('/api/v1/me').then(res => {
      if (res.data.user_id === user.id && !props.preview) setIsOwnProfile(true)
    })
  }, [isOwnProfile])

  const handleFund = () => {
    history.push({
      pathname: `/project/${project.id}/fund`,
      state: {
        title: project.title,
      },
    })
  }

  const handleEditProject = () => {
    history.push({
      pathname: `/profile/${user.id}/projects/${project.id}/edit`,
      state: {
        title: project.title,
      },
    })
  }

  const avatar = user.profile_pics
    ? process.env.REACT_APP_AWS_ROOT + user.profile_pics[user.current_avatar]
    : ''

  return (
    <Card className={classes.userPanel}>
      <Typography display='inline'>{project.current_funding}</Typography>
      <Typography color='textSecondary' display='inline'>
        {' / ' + project.funding_goal}
      </Typography>
      <Typography variant='body2' color='textSecondary'>
        Equity exchange: {project.equity * 100}%
      </Typography>

      <Divider className={classes.userDividerTop} />
      <Grid
        container
        alignItems='center'
        justify='space-evenly'
        style={{ height: '50px' }}
      >
        <Typography variant='body2' color='textSecondary'>
          {project.backers} backers
        </Typography>
        <Divider orientation='vertical' flexItem />
        <Typography variant='body2' color='textSecondary'>
          {fromNow}
        </Typography>
      </Grid>

      <Divider className={classes.userDividerBottom} />

      <Avatar src={avatar} className={classes.avatar}></Avatar>
      {/* User Info */}
      <Box>
        <Typography variant='h6' component='p'>
          {user.username}
        </Typography>
        <Typography color='textSecondary'>{user.location}</Typography>
      </Box>

      {isOwnProfile && (
        <Button
          size='large'
          variant='outlined'
          disableElevation
          onClick={handleEditProject}
        >
          Edit Project
        </Button>
      )}
      {!isOwnProfile && (
        <Box>
          <Button
            size='large'
            variant='outlined'
            disableElevation
            className={classes.messageButton}
          >
            Send a Message
          </Button>
          <Button
            size='large'
            variant='outlined'
            disableElevation
            onClick={handleFund}
            className={classes.fundButton}
          >
            Fund This Project
          </Button>
        </Box>
      )}
    </Card>
  )
}

function Project(props) {
  const [project, setProject] = useState()
  const [user, setUser] = useState()
  const [error, setError] = useState()
  const history = useHistory()

  const project_id = !props.preview ? props.match.params.projectId : ''

  const handleUpdateProject = project => {
    setProject(project)
  }

  const handleUpdateUser = user => {
    setUser(user)
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const projectRes = await axios(`/api/v1/projects/${project_id}`)
        setProject(projectRes.data)
        const userRes = await axios(
          `/api/v1/users/${projectRes.data.user_id}/profile`
        )
        setUser(userRes.data)
      } catch (err) {
        console.dir(err)
        setError(err)
      }
    }
    async function fetchPreviewData() {
      try {
        setProject(props.project)
        const userRes = await axios(
          `/api/v1/users/${props.project.user_id}/profile`
        )
        setUser(userRes.data)
      } catch (err) {
        console.dir(err)
        setError(err)
      }
    }
    if (!props.preview) {
      fetchData()
    } else {
      fetchPreviewData()
    }
  }, [project_id])

  if (error) {
    history.push('/404')
    return null
  } else {
    return (
      <Container align='center'>
        <div>
          {project && user && (
            <div>
              <Header project={project} />
              <Grid container spacing={5}>
                <Grid item xs={9}>
                  <ProjectPanel project={project} />
                </Grid>
                <Grid item xs={3}>
                  <UserInfo
                    user={user}
                    project={project}
                    preview={props.preview}
                  />
                </Grid>
              </Grid>
            </div>
          )}
        </div>
      </Container>
    )
  }
}

export default Project
