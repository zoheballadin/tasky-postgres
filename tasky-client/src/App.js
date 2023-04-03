import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Dashboard } from './Components/Dashboard';
import { Login } from './Components/Login';
import { PrivateRoute } from './Components/PrivateRoute';
import { Register } from './Components/Register';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AddTask } from './Components/AddTask';
import { ViewTasks } from './Components/ViewTasks';
import {EditTask} from "./Components/EditTask"
import { Signout } from './Components/Signout';
import { Home } from './Components/Home';
function App() {
  let navigate = useNavigate()
  const verifyToken = async(role) =>{
    let token = localStorage.getItem("token");
    token = JSON.parse(token);
    if(token.role != role){
      localStorage.removeItem("token");
      return navigate("/login")
    }
    
    try {
      let {data} = await axios.get("/api/user/auth", {
        headers: {
          "auth-token": token.token
        }
      })
      console.log(data)

      if(data.role != role){
        localStorage.removeItem("token");
        return navigate("/login")
      }
    } catch (error) {
      console.log(error)
      localStorage.removeItem("token");
      navigate("/login")
    }
  }
  return (
    <Routes>
      <Route path='/register' element={<Register/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/signout' element={<Signout/>}/>
      <Route path='/' element={<Home/>}/>

      <Route element={<PrivateRoute/>}>
        <Route path='/dashboard' element={<Dashboard verifyToken={verifyToken}/>}/>
        <Route path='/task/add' element={<AddTask verifyToken={verifyToken}/> }/>
        <Route path='/tasks' element={<ViewTasks verifyToken={verifyToken}/> }/>
        <Route path='/task/edit/:task_id' element={<EditTask verifyToken={verifyToken}/>}/>
      </Route>
    </Routes>
  );
}

export default App;
