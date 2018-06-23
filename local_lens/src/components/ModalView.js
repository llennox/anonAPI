import React, { Component } from 'react';
import { connect } from 'react-redux';
import LandingMap from './LandingMap'
import SymbolSelect from './SymbolSelect';
import Modal from 'react-modal';
import { photosByNewest, updateCenter, closeModal } from '../actions';
import { Grid, Row, Col, Button } from 'react-bootstrap';


class ModalView extends Component {

  constructor() {
      super();
      this.closeModal = this.closeModal.bind(this);
    }

  closeModal() {
    this.props.closeModal()
  }

   render() {
    return (
    <div>

      <Modal
       isOpen={this.props.modalState}
       onAfterOpen={this.afterOpenModal}
       onRequestClose={this.closeModal}
       shouldCloseOnOverlayClick={true}
       contentLabel="photo modal"
       ariaHideApp={false}
       >
       <Button onClick={this.closeModal}>close</Button>
       <p>{this.props.singlePhoto.uuid}</p>
     </Modal>


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
  modalState: state.def.modalState,
  singlePhoto: state.def.singlePhoto
 };
};

export default connect(mapStateToProps, {
 photosByNewest,
 updateCenter,
 closeModal
})(ModalView);
