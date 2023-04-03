import React, {useEffect, useState} from "react";
import { Header } from "./Header";
import { Navbar } from "./Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export const Login = () => {
  let navigate = useNavigate();
  const [user, setUser] = useState({});
  useEffect(()=>{
    let token = localStorage.getItem("token");
    if(token){
        token = JSON.parse(token);
        if(token.role == "user"){
            return navigate("/dashboard")
        }
        localStorage.removeItem("token");
        
    }
  },[])
  const onChange = (e) => {
    setUser({ ...user, [e.target.id]: e.target.value });
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      let { data } = await axios.post("/api/user/login", user);
      console.log(data);
      let tokenData = {
        token: data.token,
        role: data.role
      }
      localStorage.setItem("token", JSON.stringify(tokenData))
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      if(error.response.data.errors){
            let str = "";
            error.response.data.errors.forEach(item => {
              str+= item.msg + " \n "
            })
            alert(str)
          }else alert(error.response.data.error)
    }
  };
  return (
    <div className="Register">
      <Navbar />
      <Header />
      <form onSubmit={onSubmit}>
        <h1 style={{ textAlign: "center", marginTop: "5%" }}>Log in</h1>

        <label className="reglabel" htmlFor="email">
          Email:
        </label>
        <input
        onChange={onChange}
          className="reginput"
          type="email"
          id="email"
          name="email"
          required
        />
        <label className="reglabel" htmlFor="password">
          Password:
        </label>
        <input
        onChange={onChange}
          className="reginput"
          type="password"
          id="password"
          name="password"
          required
        />
        <input className="btn" type="submit" value="Login" />
      </form>
    </div>
  );
};
