import React from 'react';
import PropTypes from 'prop-types';
import logo from './../assets/shutter_gif_mayb.gif';
import apple from './../assets/apple.png';
import google from './../assets/googleplay.png';
import main_view from './../assets/main_view.png';
import comment_view from './../assets/comment_view.png';
import account_as_use from './../assets/account_as_use.png';
import account_as_anon from './../assets/account_as_anon.png';
import account_logged_out from './../assets/account_logged_out.png';
import styles from './../assets/styling.css';



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
      <h1 style={h1Style} >Local lens</h1>
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
      <h1 style={h1Style} >Local lens</h1>
      

      <img src={logo} alt="loading..." />

      <div style={pDivStyle}>
      <p style={pStyle}>Local lens is an ios and android app that returns a combination of the closest and newest photos in a scroll view and allows the posting of comments, photos, videos and captions.
      think of it as tool to catalogue a place and communicate with people in your vicinity. You can post anonymously.
      </p>
      <p style={psmallStyle}>
    Talk about what&#39;s
      going on in your town with your community, advertise your bussiness, art, or music, arrange meetups, buy and sell stuff, catalogue someplace for the next people who pass through
      or anything else you can think of. As always Have fun, and be respectful.
      </p>
      </div>
      <div style={{ width: '100%', height: '700px'  }}>
        <img style={{ width: '25%', marginTop: '1%' }} src={main_view} alt="loading. . ." />
      </div>
      <div style={{ width: '100%', height: '700px' }}>
        <img style={{ width: '25%', marginTop: '1%' }} src={comment_view} alt="loading. . ." />
      </div>
      <div style={{ width: '100%', height: '700px'  }}>
        <img style={{ width: '25%', marginTop: '1%' }} src={account_logged_out} alt="loading. . ." />
      </div>
      <div style={{ width: '100%', height: '700px'  }}>
        <img style={{ width: '25%', marginTop: '1%' }} src={account_as_anon} alt="loading. . ." />
      </div>
      <div style={{ width: '100%', height: '700px'  }}>
        <img style={{ width: '25%', marginTop: '1%' }} src={account_as_use} alt="loading. . ." />
      </div>
      <p style={pStyle}>

      </p>
    </div>
  )
}



/*Hello.propTypes = {
 onClick: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired

}*/

export default Hello
