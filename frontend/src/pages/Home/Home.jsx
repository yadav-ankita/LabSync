import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'

const Home = () => {
  const {currentUser}=useAppContext();
  return (
   <>
       {currentUser && <Navigate to='/labIncharge-dashboard' /> }
       <div>Home Page</div>
   </>
  )
}

export default Home
