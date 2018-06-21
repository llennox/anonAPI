import React from 'react';
//import PropTypes from 'prop-types';
//import logo from './../assets/shutterLarge.gif';
//import apple from './../assets/apple.png';
//import google from './../assets/googleplay.png';
import me from './../assets/me.png';
import { Link } from 'react-router-dom';


const divStyle = {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
   textAlign: 'center',
   heigt: '100%'
};

const h1Style = {
  color: 'white',
  fontSize: 70,
  alignSelf: 'center',
  justifyContent: 'center'
};

const pDivStyle = {
  marginLeft: 250,
  marginRight: 250
};

const pStyle = {
  color: 'white',
  fontSize: 50
};

const psmallStyle = {
  color: 'white',
  fontSize: 25
};


const Contact = () => {
  return (
     <div style={divStyle} >
       <div>
        <Link style={{ marginRight: 30, color: 'white', textDecoration: 'none', fontSize: 30 }} to='/'>about</Link>
      </div>
      <h1 style={h1Style} >Local lens</h1>
      <div style={{ height: 50 }}></div>
      <a href="https://connellgough.com">
      <img src={me} alt="loading..." />
      <p style={pStyle}> connellgough.com</p>
      </a>
    </div>
  )
}



/*Hello.propTypes = {
 onClick: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired

}*/

export default Contact
