import React, { useState, useEffect } from "react";
import { Header } from "./Header";
import { Navbar } from "./Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export const Register = () => {
  let navigate = useNavigate();
  const [user, setUser] = useState({});
  const onChange = (e) => {
    setUser({ ...user, [e.target.id]: e.target.value });
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      let { data } = await axios.post("/api/user/register", user);
      console.log(data);
      navigate("/login");
    } catch (error) {
      
      if (error.response.data.errors) {
        let str = "";
        error.response.data.errors.forEach((item) => {
          str += item.msg + " \n ";
        });
        alert(str);
      } else alert(error.response.data.error);
    }
  };

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


  return (
    <div className="Register" >
      <Navbar />
      <Header />
      <form onSubmit={onSubmit}>
        <h1 style={{ textAlign: "center", marginTop: "5%" }}>Sign Up</h1>
        <label className="reglabel" htmlFor="firstname">
          First name:
        </label>
        <input
          onChange={onChange}
          className="reginput"
          type="text"
          id="firstname"
          name="firstname"
          required
        />
        <label className="reglabel" htmlFor="lastname">
          Last name:
        </label>
        <input
          onChange={onChange}
          className="reginput"
          type="text"
          id="lastname"
          name="lastname"
          required
        />
        <label className="reglabel" htmlFor="phone">
          Phone:
        </label>
        <input
          onChange={onChange}
          className="reginput"
          type="text"
          id="phone"
          name="phone"
          required
        />
        <label className="reglabel" htmlFor="address">
          Address:
        </label>
        <input
          onChange={onChange}
          className="reginput"
          type="text"
          id="address"
          name="address"
          required
        />
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
        <label className="reglabel" htmlFor="password2">
          Confirm Password:
        </label>
        <input
          onChange={onChange}
          className="reginput"
          type="password"
          id="password2"
          name="password2"
          required
        />
        <input className="btn" type="submit" value="Sign Up" />
      </form>
    </div>
  );
};
