import React, { useState, useEffect } from 'react'
import axios from 'axios'

import NavBar from 'components/Navbar'

function Main(props) {
  const [currentUser, setCurrentUser] = useState(false)
  const [userProfile, setUserProfile] = useState('')
  const { isAuthenticated, handleUserLog } = props

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios(`/api/v1/me`)
        setUserProfile(`/profile/${res.data.user_id}`)
        setCurrentUser(res.data)
      } catch (err) {
        console.dir(err.response.data.error)
        setCurrentUser(false)
        setUserProfile('')
      }
    }
    fetchData()
  }, [isAuthenticated, handleUserLog])

  return <NavBar currentUser={currentUser} userProfile={userProfile} />
}

export default Main
