import React from 'react'
import { Link } from 'react-router-dom'
export const Navbar = () => {
  return (
    <div className="nav" style={{position: "fixed"}}>
      <input type="checkbox" id="nav-check" />
      <div className="nav-header">
        <div className="nav-title">Tasky</div>
      </div>
      <div className="nav-btn">
        <label htmlFor="nav-check">
          <span></span>
          <span></span>
          <span></span>
        </label>
      </div>

      <div className="nav-links">
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
        <Link to="/">Home</Link>
        
        
        
      </div>
    </div>
  )
}
