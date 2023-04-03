import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
export const PrivateRoute = () => {
    let token = localStorage.getItem("token")
  return (
    token ? <Outlet/> : <Navigate to="login"/>
  )
}
