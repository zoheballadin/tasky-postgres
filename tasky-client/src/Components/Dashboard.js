import React, { useEffect } from 'react'
import { Header } from './Header'
import { Link } from 'react-router-dom'
export const Dashboard = ({verifyToken}) => {
    useEffect(()=>{
        verifyToken("user")
    })
  return (
    
    <div className='dashparent'>
        <Header/>
        <div className="Dashboard">
            <Link style={{marginTop: "4%"}} to="/tasks"><button>View Tasks</button></Link>
            <Link to="/task/add"><button>Add a Task</button></Link>
            <Link to="/signout"><button>Sign out</button></Link>
        </div>
    </div>
  )
}
