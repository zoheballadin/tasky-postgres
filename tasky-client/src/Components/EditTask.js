import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Header } from './Header'
import { Navbar } from './Navbar'
import { Link } from 'react-router-dom'
export const EditTask = ({verifyToken}) => {
  let navigate = useNavigate()
  let {task_id} = useParams()
  // console.log(task_id)
  const[task, setTask] = useState({});
  const [isCompleted, setCompleted] = useState(false)
  let {task_name, deadline} = task
  
  const getTask = async() =>{
    let token = localStorage.getItem("token");
    token = JSON.parse(token)
    let {data} = await axios.get(`/api/task/${task_id}`, {
      headers: {
        "auth-token": token.token
      }
    })
    setTask({task_name: data.task_name})
  }

  const onSubmit = async(e) =>{
    e.preventDefault();
    try {
      let token = localStorage.getItem("token");
      token = JSON.parse(token)
      let {data} = await axios.put(`/api/task/${task_id}`, {task_name, deadline: Date.parse(deadline), ...isCompleted}, {
        headers: {
          "auth-token" : token.token
        }
      })
      console.log(data)
      navigate("/tasks")

    } catch (error) {
      console.log(error)
      alert(error.response.data.error)
    }
  }

  const onChange = (e) =>{
    setTask({
      ...task, [e.target.id]: e.target.value 
    })
  }

  const onCheck = (e) =>{
    setCompleted({isCompleted:e.target.checked})
  }
  useEffect(()=>{
    verifyToken("user")
    getTask()
  },[])
  return (
    <div className='Register'>
        
        
        <Header/>
        <form onSubmit={onSubmit}>
        <Link  to="/login"><button style={{padding: "1%"}}>Go back</button></Link>
        <h1 style={{textAlign: 'center', marginTop: "5%"}}>Edit a task</h1>
        <label className='reglabel'  htmlFor="task_name">Task Name:</label>
        <input onChange={onChange} value={task_name} className='reginput' type="text" id="task_name" name="task_name" required />
        <label className='reglabel'  htmlFor="deadline">Deadline: (Leave blank if you dont want to update)</label>
        <input onChange={onChange} value={deadline} className='reginput' type="datetime-local" id="deadline" name="deadline"  />
        <label className='reglabel'  htmlFor="isCompleted">Did you complete this task?</label>
        <input onChange={onCheck} value={isCompleted} style={{height: "20px"}} className='reginput' type="checkbox" id="isCompleted" name="isCompleted"  />
        <input className='btn' type="submit" value="Submit" />
      </form>
    </div>
  )
}
