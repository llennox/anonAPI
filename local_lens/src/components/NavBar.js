import React from 'react';
import Hello from './Hello';
import LandingContainer from './LandingContainer';
import {
  Switch,
  Route
} from 'react-router-dom';
import { Navbar, Nav, NavItem } from 'react-bootstrap';

//const isMobile = window.innerWidth <= 500;

const NavBar = () => {
  return (
     <div>
       <Navbar inverse>
    <Navbar.Header>
      <Navbar.Brand>
        <a href="/">geeps</a>
      </Navbar.Brand>
    </Navbar.Header>
    <Nav>
      <NavItem eventKey={1} href="/about">
        about
      </NavItem>
    </Nav>
  </Navbar>
   <div>
     <Switch>
    <Route path="/about" component={Hello}/>
     <Route path="/" component={LandingContainer}/>
     </Switch>
   </div>
    </div>

  )
}


export default NavBar
