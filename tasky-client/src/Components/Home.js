import React from 'react'
import { Navbar } from './Navbar'
import { Header } from './Header'
export const Home = () => {
  return (
    <div className='Home'>
        <Navbar/>
        <Header/>
        <h1 className='h1h'>Tasky Scheduler</h1>
    </div>
  )
}
