import React, { Component } from 'react';
import Map from 'pigeon-maps';
import Marker from 'pigeon-marker';
import { connect } from 'react-redux';
import { photosByNewest, updateCenter, changePhoto, getAuthToken } from '../actions';
import logo from './../assets/shutter_gif_mayb.gif';

// please change this if you take some code from here.
// otherwise the demo page will run out of credits and that would be very sad :(
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiY29ubmxsb2MiLCJhIjoiY2poemo4bGE2MHdiYTNrdWw3YWNnZzV2aCJ9.CbvJOat2qxR4GaGeCw3M9Q'

const mapbox = (mapboxId, accessToken) => (x, y, z) => {
  const retina = typeof window !== 'undefined' && window.devicePixelRatio >= 2 ? '@2x' : ''
  return `https://api.mapbox.com/styles/v1/mapbox/${mapboxId}/tiles/256/${z}/${x}/${y}${retina}?access_token=${accessToken}`
}

const providers = {
  outdoors: mapbox('outdoors-v10', MAPBOX_ACCESS_TOKEN)
}



class LandingMap extends Component {
  constructor (props) {
    super(props)

    this.state = {
      center: this.props.center,
      zoom: 13,
      provider: 'outdoors',
      zoomOnMouseWheel: true,
      pointer: this.props.modalPointer
    }
  }

  componentWillMount() {
    if (localStorage.getItem('token') === null) {
    this.props.getAuthToken();
  } else {
    this.props.photosByNewest();
  }
  }



  componentDidUpdate() {
    if (this.state.pointer !== this.props.modalPointer && this.props.modalState !== true) {
      this.setState({ center: this.props.center, pointer: this.props.modalPointer })
    }
  }

  zoomIn = () => {
    this.setState({
      zoom: Math.min(this.state.zoom + 1, 18)
    })
  }

  zoomOut = () => {
    this.setState({
      zoom: Math.max(this.state.zoom - 1, 1)
    })
  }

  handleBoundsChange = ({ center, zoom, bounds, initial }) => {
    if (initial) {
      this.setState({center: this.props.center})
    }
    this.setState({ zoom, center })
    this.props.updateCenter(center)
  }

  handleClick = ({ event, latLng, pixel }) => {
    console.log('Map clicked!', latLng, pixel)
  }

  render () {

    if (this.props.mapLoading === false) {
      const x = this.props.photos.objects;
      const { center, zoom, provider, zoomOnMouseWheel } = this.state
      const width = window.innerWidth - (window.innerWidth * 0.1)
      return (
        <div style={{textAlign: 'center', marginTop: '1%'}}>
          <Map center={center}
               zoom={zoom}
               provider={providers[provider]}
               onBoundsChanged={this.handleBoundsChange}
               onClick={this.handleClick}
               zoomOnMouseWheel={zoomOnMouseWheel}
               width={width}
               height={window.innerHeight - 50}>
            {x.map((photo, i) =>
              <Marker key={photo.uuid} anchor={[photo.lat, photo.lon]} payload={1} onClick={() => this.props.changePhoto(i, this.props.photos)} />
            )}
          </Map>
        </div>
    );}

    return (
      <div style={{textAlign: 'center', marginTop: '1%'}}>
        <img src={logo} alt="loading..." />

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
  mapLoading: state.def.mapLoading,
  modalPointer: state.def.modalPointer,
  modalState: state.def.modalState
 };
};

export default connect(mapStateToProps, {
 photosByNewest,
 updateCenter,
 changePhoto,
 getAuthToken
})(LandingMap);
