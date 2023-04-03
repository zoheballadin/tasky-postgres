import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from './Header'
import { Navbar } from './Navbar'
import { Link } from 'react-router-dom'
export const AddTask = ({verifyToken}) => {
    let navigate = useNavigate()
    useEffect(()=>{
        verifyToken("user")
    },[])
    const [task, setTask] = useState({})
    let {deadline, task_name} = task
    
    const onChange = (e) => {
        setTask({ ...task, [e.target.id]: e.target.value });
        
      };

    const onSubmit = async(e) =>{
        e.preventDefault();
        let token = localStorage.getItem("token");
        token = JSON.parse(token)
        
        
        try {
            let {data} = await axios.post("/api/task/add", {task_name, deadline: Date.parse(deadline)}, {
                headers: {
                    "auth-token": token.token
                }
            })
            console.log(data)
            navigate("/tasks")
        } catch (error) {
          if(error.response.data.errors){
            let str = "";
            error.response.data.errors.forEach(item => {
              str+= item.msg + " \n "
            })
            alert(str)
          }else alert(error.response.data.error)
        }
    }
  return (
    <div className='Register'>
        
        
        
        <Header/>
        
        <form onSubmit={onSubmit}>
        <Link  to="/login"><button style={{padding: "1%"}}>Go back</button></Link>
        <h1 style={{textAlign: 'center', marginTop: "5%"}}>Add a task</h1>
        <label className='reglabel'  htmlFor="task_name">Task Name:</label>
        <input onChange={onChange} className='reginput' type="text" id="task_name" name="task_name"  required/>
        <label className='reglabel'  htmlFor="deadline">Deadline:</label>
        <input onChange={onChange} className='reginput' type="datetime-local" id="deadline" name="deadline" required />
        
        <input className='btn' type="submit" value="Submit" />
      </form>
    </div>
  )
}
