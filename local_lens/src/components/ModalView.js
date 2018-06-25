import React, { Component } from 'react';
import { connect } from 'react-redux';

import ExifOrientationImg from 'react-exif-orientation-img';
import { photosByNewest, updateCenter, closeModal, changePhoto } from '../actions';
import { Grid, Row, Col, Button, Modal } from 'react-bootstrap';
import Moment from 'react-moment';


class ModalView extends Component {

  constructor() {
      super();
      this.closeModal = this.closeModal.bind(this);
    }

  closeModal() {
    this.props.closeModal()
  }

  renderForwardAndBack() {
    const realPoint = this.props.modalPointer + 1
    if (this.props.modalPointer <= 0) {
      return (
        <Modal.Title style={{fontWeight: 'bold'}} id="contained-modal-title-lg">{this.props.photos.objects[this.props.modalPointer].poster}
          <Button  style={{fontWeight: 'bold' ,marginLeft: '1%', marginRight: '1%', color:'black'}}
            onClick={() => this.props.changePhoto(this.props.modalPointer + 1, this.props.photos)}>Older post &rarr;</Button>
        </Modal.Title>
      )
    } else if (realPoint >= this.props.photos.objects.length) {
      return (
        <Modal.Title style={{fontWeight: 'bold'}} id="contained-modal-title-lg">{this.props.photos.objects[this.props.modalPointer].poster}
          <Button style={{fontWeight: 'bold' ,marginLeft: '1%', marginRight: '1%', color:'black'}}
            onClick={() => this.props.changePhoto(this.props.modalPointer - 1, this.props.photos)}>&larr; newer post</Button>
        </Modal.Title>
      )
      } else {
        return (
      <Modal.Title style={{fontWeight: 'bold'}} id="contained-modal-title-lg">{this.props.photos.objects[this.props.modalPointer].poster}
        <Button style={{fontWeight: 'bold' ,marginLeft: '1%', marginRight: '1%', color:'black'}}
          onClick={() => this.props.changePhoto(this.props.modalPointer - 1, this.props.photos)}>&larr; newer post</Button>
        <Button  style={{fontWeight: 'bold' , color:'black'}}
          onClick={() => this.props.changePhoto(this.props.modalPointer + 1, this.props.photos)}>Older post &rarr;</Button>
      </Modal.Title>
  )
  }
}

renderPhoto () {
  if (this.props.photos.objects[this.props.modalPointer].isText === true) {

    return (
      <div>
    <p style={{fontWeight: 'bold', fontSize: '200%'}}>{this.props.photos.objects[this.props.modalPointer].caption}</p><br/>
    <Moment style={{fontWeight: 'bold', fontSize: '80%'}} fromNow>{this.props.photos.objects[this.props.modalPointer].timestamp}</Moment><br/>
     <p style={{fontWeight: 'bold', fontSize: '80%'}}>lat: {this.props.photos.objects[this.props.modalPointer].lat} lon: {this.props.photos.objects[this.props.modalPointer].lon}</p>
    </div>
    )
  } else {
    return (
      <div>
      <p style={{fontWeight: 'bold', fontSize: '120%'}}>{this.props.photos.objects[this.props.modalPointer].caption}</p><br/>
      <Moment style={{fontWeight: 'bold', fontSize: '80%'}} fromNow>{this.props.photos.objects[this.props.modalPointer].timestamp}</Moment><br/>
      <p style={{fontWeight: 'bold', fontSize: '80%'}}>{this.props.photos.objects[this.props.modalPointer].lat}, {this.props.photos.objects[this.props.modalPointer].lon}</p>
      <ExifOrientationImg
            src={`https://locallensapp.com/photos/${this.props.photos.objects[this.props.modalPointer].uuid}.jpg`}
            alt=""
            style={{display: 'block', marginRight:'auto', marginLeft:'auto',maxWidth: '100%', maxHeight: 'auto'}}
      />
    </div>
    )

  }
}


   render() {
    if (this.props.photos.objects[this.props.modalPointer]) {
      console.log(this.props.photos.objects[this.props.modalPointer])
      const comments = this.props.photos.objects[this.props.modalPointer].comments
    return (
    <div>
      <Modal
        show={this.props.modalState}
        onHide={this.closeModal}
        bsSize="large"
        aria-labelledby="contained-modal-title-lg"
      >
        <Modal.Header closeButton>
             {this.renderForwardAndBack()}
        </Modal.Header>
        <Grid>
        <Modal.Body style={{height: window.innerHeight - 100}}>

  <Row className="show-grid">
    <Col xs={4} md={4} lg={4}>
    {this.renderPhoto()}
    </Col>
    <Col xs={6} md={5} lg={5}>
      <div>
      <p style={{fontWeight: 'bold', fontSize: '80%'}}>comments</p>
      {comments.map((comment, i) =>
      <div>
        <br/>
        <p style={{overflowWrap: 'break-word'}} key={i}>{comment.poster} <br/> {comment.comments}<br/><Moment style={{fontWeight: 'bold', fontSize: '80%'}} fromNow>{comment.timestamp}</Moment><br/></p>

</div>
     )}
     </div>
    </Col>
      <Col xs={2} md={3} lg={3}></Col>
  </Row>


        </Modal.Body>
</Grid>
      </Modal>




    </div>
    );
  }
  return (
    <div>
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
 photosByNewest,
 updateCenter,
 closeModal,
 changePhoto
})(ModalView);
