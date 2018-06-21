import React from 'react';
import myimage from './../assets/myimage.gif';
import apple from './../assets/apple.png';
import google from './../assets/googleplay.png';




const divStyle = {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
   textAlign: 'center'
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

const isMobile = window.innerWidth <= 500;

const Hello = () => {
  if (isMobile) {
    return (
            <div style={divStyle} >
         <div style={{ height: 50 }}></div>
      <a href="https://play.google.com/store/apps/details?id=com.anonshot">
      <img src={google} alt="loading..." /></a>
       <a href="https://itunes.apple.com/us/app/local-lens/id1353659184?ls=1&mt=8">
      <img src={apple} alt="loading..." /></a>
       <div>
        <a style={{ marginRight: 30, color: 'white', textDecoration: 'none', fontSize: 30 }} href="https://connellgough.com">contact</a>
      </div>
      <h1 style={h1Style} >geeps</h1>
       </div>
    )
  }
  return (
     <div style={divStyle} >
         <div style={{ height: 50 }}></div>
      <a href="https://play.google.com/store/apps/details?id=com.anonshot">
      <img src={google} alt="loading..." /></a>
       <a href="https://itunes.apple.com/us/app/local-lens/id1353659184?ls=1&mt=8">
      <img src={apple} alt="loading..." /></a>
       <div>
        <a style={{ marginRight: 30, color: 'white', textDecoration: 'none', fontSize: 30 }} href="https://connellgough.com">contact</a>
      </div>
      <h1 style={h1Style} >geeps</h1>
        <div style={pDivStyle}>
        <p style={psmallStyle}><a href="https://github.com/llennox/anonAPI">geeps is open source!</a></p>
        <p style={pStyle}>geeps is an ios and android app and website. Catalogue your adventure for friends and family as well as communicate with other people in your vicinity. You can post anonymously.
        </p>
        <p style={psmallStyle}>
        photograph important places for others who come behind you i.e. gear shops, water sources, resupply points, loose bolts and bears!
        </p>
        </div>

      <img style={{marginBottom: '2%'}} src={myimage} alt="loading..." />


    </div>
  )
}



/*Hello.propTypes = {
 onClick: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired

}*/

export default Hello
