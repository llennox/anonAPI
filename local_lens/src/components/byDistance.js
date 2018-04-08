
import React, { Component } from 'react';
import ExifOrientationImg from 'react-exif-orientation-img';
import 'react-html5video/dist/styles.css';
import logo from './../assets/shutterLarge.gif';
import Moment from 'react-moment';
import 'moment-timezone';
import { connect } from 'react-redux';
import { photosByNewest } from '../actions'
import { DefaultPlayer as Video } from 'react-html5video';
import { Link } from 'react-router-dom';


class byDistance extends Component {

constructor(props) {
  super(props);
  this.props.photosByNewest(1);
  this.state = {
    message:'not at bottom',
    width: 0
  };
  this.handleScroll = this.handleScroll.bind(this);
}

handleScroll() {
  const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
  const body = document.body;
  const html = document.documentElement;
  const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
  const windowBottom = windowHeight + window.pageYOffset;
  console.log(docHeight);
  if (windowBottom >= (docHeight - 20)) {
    this.setState({
      message:'bottom reached'
    });
  } else {
    this.setState({
      message:'not at bottom'
    });
  }
}


componentDidMount() {
  window.addEventListener("scroll", this.handleScroll);
}

componentWillUnmount() {
  window.removeEventListener("scroll", this.handleScroll);
}



renderVideoPhoto(x, i) {
  if (x.isvideo) {
      const url = `https://locallensapp.com/photos/${x.uuid}.mp4`
    return (
      <div style ={{   justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'}}>
        <Video style={{ flex: 1,
        width: '40%',
        aspectRatio: 1.5,
      resizeMode: 'contain',
    alignSelf: 'center' }}
          loop muted
                    controls={['PlayPause', 'Seek', 'Time', 'Volume', 'Fullscreen']}
                    onCanPlayThrough={() => {
                    }}>
                    <source src={ url } type="video/webm" />

                </Video>
      </div>
    );
  }

  const url = `https://locallensapp.com/photos/${x.uuid}.jpg`
  return (
    <div>
      <ExifOrientationImg
        src={ url }
        alt="A waterfall"
        style={{
        width: '40%'
       }}
      />
  </div>  
);
}

renderComment(items) {
    return (
     <div style={{ border: '2px solid white'}}>
        <p style={styles.timeTextStyle}>{items.poster}: { items.comments }</p>
        <p style={styles.timeTextStyle}>
        <Moment fromNow>{items.timestamp}</Moment>
        </p>
    </div>
    );
}

render() {
  if (this.props.loading || this.props.photos.objects === undefined) {
    return (
      <div style={{flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center' }}>
      <div style={{
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      alignSelf: 'center' }}>
       <Link style={{ marginRight: 30, color: 'white', textDecoration: 'none', fontSize: 30 }} to='/'>About</Link>
       <Link style={{ marginRight: 30, color: 'white', textDecoration: 'none', fontSize: 30 }} to='/contact'>contact</Link>

     </div>
      <p style={{ fontSize: 50, color: 'white', selfAlign: 'center' }}>Loading</p>
      <img src={logo} alt="loading..." />
     </div>
    );
  }
  const mapMe = this.props.photos.objects;
  console.log(mapMe);
  return (
  <div style={{flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center' }}>
    <div>
     <Link style={{ marginRight: 30, color: 'white', textDecoration: 'none', fontSize: 30 }} to='/'>About</Link>
     <Link style={{ marginRight: 30, color: 'white', textDecoration: 'none', fontSize: 30 }} to='/contact'>contact</Link>

   </div>
    {mapMe.map((x, i) =>
      <div key={i} style={{flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',

      }}>
      <p style={styles.timeTextStyle}>posted by: {x.poster}</p>
        <p style={styles.timeTextStyle}>{ x.caption }</p>
    {this.renderVideoPhoto(x, i)}
    <div style={{
        border: '2px solid white',
       marginLeft: '20%',
       marginRight: '20%',
      justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center' }}>
      <p style={styles.timeTextStyle}>
      <Moment fromNow>{x.timestamp}</Moment>
        {x.comments.map((items) =>
              <div key={items.uuid}>
              {this.renderComment(items)}
            </div>
            )}
      </p>
      </div>

<hr style={{ color: 'white', width: '60%' }}></hr>
    </div>

       )}
    <div className="fixedDiv"></div>
    <div className="scrollDiv"></div>
  </div>
  );
}
}



const styles = {
  infoTextStyle: {
  fontSize: 14,
  color: 'white',
  textAlign: 'center',
  marginTop: 50
},
captionTextStyle: {
fontSize: 18,
color: 'white',
marginLeft: 4,

},
notanonTextStyle: {
fontSize: 18,
color: 'rgb(0,122,255)',
marginLeft: 4,
},
flagTextStyle: {
fontSize: 12,
color: 'rgb(0,122,255)',
alignSelf: 'flex-end',
marginRight: 2
},

timeTextStyle: {
fontSize: 14,
marginLeft: 4,
color: 'white',

},
buttonStyle: {
flex: 1,
alignSelf: 'center',
borderRadius: 2,
borderWidth: 1,
borderColor: 'white',
marginLeft: 5,
paddingTop: 5,
paddingBottom: 5,
marginRight: 5
},
deleteFlagIcon: {
    alignSelf: 'flex-end',
    marginRight: 10,
    marginTop: 1,
    flex: 1

}
};


const mapStateToProps = state => {
return {
  photos: state.def.photos,
  loading: state.def.loading
 };
};

export default connect(mapStateToProps, {
 photosByNewest
})(byDistance);
