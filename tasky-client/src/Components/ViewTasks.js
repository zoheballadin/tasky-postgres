import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { TaskRow } from './TaskRow'
import { Link } from 'react-router-dom'
export const ViewTasks = ({verifyToken}) => {
    let [tasks, setTasks] = useState([])
    useEffect(()=>{
        verifyToken("user")
        getTasks()
    },[])
    const getTasks = async() =>{
        try {
            let token = localStorage.getItem("token");
            token = JSON.parse(token)
            let {data} = await axios.get("/api/user/tasks", {
                headers: {
                    "auth-token":token.token 
                }
            })
            setTasks(data)
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }
    return (
    <body className='tasksbody'>
        
        <Link to="/dashboard"><button style={{padding: "1%", marginTop: "1%" }}>Go Back</button></Link>
    <div className='Viewtasks'>
        
        <h1>Your Tasks</h1>
        <table className='table'>
            <th>
                <tr >
                    <td >Task Name</td>
                    <td>Deadline (GMT)</td>
                    <td>Status</td>
                    <td>Edit</td>
                    <td>Delete</td>
                </tr>
            </th>
            <tbody>
                {
                    tasks.map((item,index)=>{
                        return <TaskRow key={index} setTasks={setTasks} task={item}/>
                    })
                }
            </tbody>
        </table>
    </div>
    </body>
  )
}
