import React, { Component } from 'react';
import { connect } from 'react-redux';
import Hello from './Hello';
import LandingContainer from './LandingContainer';
import {
  Switch,
  Route
} from 'react-router-dom';
import { authModalChangeState } from '../actions'
import { Navbar, Nav, NavItem, Button } from 'react-bootstrap';
import apple from './../assets/apple.png';
import google from './../assets/googleplay.png';

//const isMobile = window.innerWidth <= 500;

class NavBar extends Component {

  render() {
    if (localStorage.getItem('token') && localStorage.getItem('created') === true) {
  return (
     <div>
       <Navbar inverse>
    <Navbar.Header>
      <Navbar.Brand>
        <a style={{fontSize: '200%'}} href="/">geeps</a>
      </Navbar.Brand>
    </Navbar.Header>
    <Nav>
      <NavItem eventKey={1} href="/about">
        <p style={{fontSize: '180%'}}>about</p>
      </NavItem>
     <NavItem href="https://play.google.com/store/apps/details?id=com.anonshot">
       <p>to make a post download the app:  <img style={{height: 40}} src={google} alt="loading..." /></p>

      </NavItem>
      <NavItem href="https://itunes.apple.com/us/app/local-lens/id1353659184?ls=1&mt=8">
          <img style={{height: 40}} src={apple} alt="loading..." />
      </NavItem>
    </Nav>
    <Nav pullRight>
      <NavItem>
        <Button bsStyle='link' onClick={() => this.props.authModalChangeState('logout') }>
            logout
        </Button>

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
return (
   <div>
     <Navbar inverse>
  <Navbar.Header>
    <Navbar.Brand>
      <a style={{fontSize: '200%'}} href="/">geeps</a>
    </Navbar.Brand>
  </Navbar.Header>
  <Nav>
    <NavItem eventKey={1} href="/about">
      <p style={{fontSize: '180%'}}>about</p>
    </NavItem>
   <NavItem href="https://play.google.com/store/apps/details?id=com.anonshot">
     <p>to make a post download the app:  <img style={{height: 40}} src={google} alt="loading..." /></p>

    </NavItem>
    <NavItem href="https://itunes.apple.com/us/app/local-lens/id1353659184?ls=1&mt=8">
        <img style={{height: 40}} src={apple} alt="loading..." />
    </NavItem>

  </Nav>
  <Nav pullRight>
    <NavItem>
      <Button bsStyle='link' onClick={() => this.props.authModalChangeState('login') }>
      login
    </Button>
    </NavItem>
    <NavItem>
      <Button bsStyle='link' onClick={() => this.props.authModalChangeState('register') }>
      register
    </Button>
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
}



const mapStateToProps = state => {
return {
  photos: state.def.photos,
  loading: state.def.loading,
  center: state.def.center,
  zoom: state.def.zoom,
  modalState: state.def.modalState,
  singlePhoto: state.def.singlePhoto,
  modalPointer: state.def.modalPointer
 };
};

export default connect(mapStateToProps, {
    authModalChangeState
})(NavBar);
