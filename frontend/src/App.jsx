import React from 'react'
import Home from './pages/Home'
import { useEffect } from 'react'
import getCurrentUser from './features/getCurrentUser'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from './redux/userSlice'

function App() {

  // const reduxState = useSelector((state) => state);
  // console.log("Redux State:", reduxState);

  const dispatch=useDispatch()

  useEffect(()=> {
    const getUser=async () => {
      const data=await getCurrentUser()
      dispatch(setUserData(data))
    }
    getUser()
  },[])
  return (
    <>
      <Home/>
    </>
  )
}

export default App