import React, { Component } from 'react';
import { connect } from 'react-redux';
import LandingMap from './LandingMap'
import SymbolSelect from './SymbolSelect';
import ModalView from './ModalView';
import LoginModal from './auth/loginModal';
import RegisterModal from './auth/register';
import logoutModal from './auth/logoutModal';
import { photosByNewest, updateCenter, closeModal } from '../actions';
import { Grid, Row, Col } from 'react-bootstrap';


class MapView extends Component {

  constructor() {
      super()
      this.closeModal = this.closeModal.bind(this);
    }

  closeModal() {
    this.props.closeModal()
  }

   render() {
    return (
    <div>
     <Grid>
       <Row className="show-grid" style={{alignItems: 'center'}}>

      <Col xs={12} md={12} lg={12} style={{alignItems: 'center'}}>
        <SymbolSelect />
     </Col>

      </Row>
      </Grid>
      <ModalView />
      <LogouModal />
      <LoginModal />
      <RegisterModal />
        <LandingMap />

    </div>
    );
  }
}

const mapStateToProps = state => {
return {
  photos: state.def.photos,
  loading: state.def.loading,
  center: state.def.center,
  zoom: state.def.zoom,
  modalState: state.def.modalState
 };
};

export default connect(mapStateToProps, {
 photosByNewest,
 updateCenter,
 closeModal
})(MapView);
