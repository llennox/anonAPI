import React, { Component } from 'react'
import './App.css';
import { connect } from 'react-redux';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { photosByNewest, userSearch, loadingSwitch, photosByUser } from '../actions';
import Sockette from 'sockette';
import { Button } from 'react-bootstrap';

class SymbolSelect extends Component {

  constructor(props) {
  super(props);
  this.state = {searchValue: ''};
  this.searchChange = this.searchChange.bind(this);
  this.handleClear = this.handleClear.bind(this);
  this.ws = new Sockette('ws://localhost:8000/updates/', {
    timeout: 1000,
    maxAttempts: 10,
    onopen: e => this.props.loadingSwitch(false),
    onmessage: e => this.props.userSearch(e.data),
    onreconnect: e => console.log('Reconnecting...', e),
    onmaximum: e => console.log('Stop Attempting!', e),
    onclose: e => this.props.loadingSwitch(true),
    onerror: e => console.log('Error:', e)
  });

}

searchChange(value, event) {

  this.ws.json({'user_search_string': value, 'token': 'd73fb67a67988f204fdaf0524247dc38083e750e267b620e9660c5b215e8fe44'});
}

handleClear () {
  this.props.photosByNewest()
}

  render () {
    console.log(this.props.userList);
    const opt = [
{ value: 'one', label: 'One' },

]
    console.log(opt)
    if (window.innerWidth <= 800) {
      return (
        <div className="section" style={{marginLeft: '4%', marginRight: '4%', marginBottom: '2%'}}>
         <b style={{'color': 'white'}}>find a user</b>
         <Select
              id="state-select"
              onBlurResetsInput={false}
              onSelectResetsInput={true}
              autoFocus
              options={this.props.userList}
              simpleValue
              clearable={true}
              name="selected-state"
              disabled={false}
              onInputChange={this.searchChange}
              value={this.state.searchValue}

              onChange={(username) => this.props.photosByUser(username)}
              searchable={true}
              isLoading={this.props.loading}
            />
          <b style={{'color': 'white'}}>showing photos for {this.props.photosForUsername} </b>
            <Button onClick={this.handleClear}>clear</Button><br/>
            <b style={{'color': 'white'}}>{this.props.userSearchError}</b>
      </div>

      )
    }
  return (
    <div className="section" style={{marginLeft: '35%', marginRight: '35%', marginBottom: '2%'}}>
     <b style={{'color': 'white'}}>find a user</b>
       <Select
            id="state-select"
            onBlurResetsInput={false}
            onSelectResetsInput={true}
            autoFocus
            options={this.props.userList}
            simpleValue
            clearable={true}
            name="selected-state"
            disabled={false}
            onInputChange={this.searchChange}
            value={this.state.searchValue}

            onChange={(username) => this.props.photosByUser(username)}
            searchable={true}
            isLoading={this.props.loading}
          />
        <b style={{'color': 'white'}}>showing photos for {this.props.photosForUsername} </b>
          <Button onClick={this.handleClear}>clear</Button><br/>
        <b style={{'color': 'white'}}>{this.props.userSearchError}</b>
  </div>

  )
}
}

/*Hello.propTypes = {
 onClick: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired
}*/
const mapStateToProps = state => {
return {
  photos: state.def.photos,
  loading: state.def.loading,
  userList: state.def.userList,
  userSearchError: state.def.userSearchError,
  photosForUsername: state.def.photosForUsername
 };
};

export default connect(mapStateToProps, {
  photosByNewest,
  photosByUser,
  userSearch,
  loadingSwitch
})(SymbolSelect);
