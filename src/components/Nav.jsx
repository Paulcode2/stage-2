import React, { useState, useEffect } from "react";
import "./Nav.css";
import logo from "../assets/logo.png";

const Nav = () => {
  const [isMobile, setIsMobile] = useState(false);

  // Function to update the state based on screen width
  const updateScreenSize = () => {
    if (window.innerWidth <= 768) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  // Add event listener for window resize
  useEffect(() => {
    updateScreenSize(); // Initial check
    window.addEventListener("resize", updateScreenSize);
    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <img src={logo} alt="" />
      </div>
      <ul className="nav-links">
        {!isMobile && (
          <>
            <li>
              <a href="/events">Events</a>
            </li>
            <li>
              <a href="/my-tickets">My Tickets</a>
            </li>
            <li>
              <a href="/about">About</a>
            </li>
            <li>
              <a href="/projects">Projects</a>
            </li>
          </>
        )}
      </ul>
      <div className="nav-my-tickets">
        <a href="/my-tickets">MY TICKETS →</a>
      </div>
    </nav>
  );
};

export default Nav;