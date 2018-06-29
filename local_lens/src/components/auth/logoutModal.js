import React, { Component } from 'react';
import { connect } from 'react-redux';
import { liloModalChangeState } from '../actions';
import {
  Grid,
  Row,
  Col,
   Button,
   Modal,
   Form,
   FormGroup,
   FormControl,
   HelpBlock,
   Panel,
   ListGroup,
   ListGroupItem,
   ControlLabel } from 'react-bootstrap';
import Moment from 'react-moment';
import Img from 'react-image';
import { Dots } from 'react-activity';
import 'react-activity/dist/react-activity.css';


class logoutModal extends Component {

  constructor(props) {
  super(props);

  this.handleChange = this.handleChange.bind(this);
this.closeModal = this.closeModal.bind(this);
this.state = {emailValue: '', passwordValue: '', repeatPasswordValue: '', value: ''};
  this.emailChange = this.emailChange.bind(this);
  this.passwordChange = this.passwordChange.bind(this);
  this.repeatPasswordChange = this.repeatPasswordChange.bind(this);
  this.handleSubmit = this.handleSubmit.bind(this);

}


getValidationState() {
   const length = this.state.value.length;
   if (length > 10) return 'success';
   else if (length > 5) return 'warning';
   else if (length > 0) return 'error';
   return null;
 }

 handleChange(e) {
   this.setState({ value: e.target.value });
 }

  closeModal() {
    this.props.liloModalChangeState(false)
  }

  emailChange(event) {
   this.setState({emailValue: event.target.value});
 }

repeatPasswordChange(event) {
   this.setState({repeatPasswordValue: event.target.value});
 }

passwordChange(event) {
    this.setState({passwordValue: event.target.value});
  }


 handleSubmit(event) {
   console.log('here');
   event.preventDefault();
   if (this.state.repeatPasswordValue !== this.state.passwordValue) {
     this.props.updateMessage('passwords must match');
   } else if (this.state.repeatPasswordValue.length < 10) {
     this.props.updateMessage('password must be 10 characters');
   } else if (this.state.repeatPasswordValue === this.state.passwordValue && this.state.repeatPasswordValue.length > 9) {
      this.props.sendCreateAccount(this.state.emailValue, this.state.passwordValue)
   }
 }

 getRepeatState() {
   console.log(this.state)
  const length = this.state.repeatPasswordValue.length;
  if (length > 9 && this.state.passwordValue === this.state.repeatPasswordValue) return 'success';
  else if (length > 5) return 'error';
  else if (length > 0) return 'error';
  return null;
}

getState() {
 const length = this.state.passwordValue.length;
 if (length > 9) return 'success';
 else if (length > 5) return 'error';
 else if (length > 0) return 'error';
 return null;
}

 renderRegister() {
return (
  <div>
    <p style={{fontWeight: 'bold', fontSize: '100%'}}>register</p>
  <br/>
 <Form horizontal onSubmit={this.handleSubmit}>
  <FormGroup controlId="formHorizontalEmail">
      Email
      <FormControl value={this.state.emailValue} onChange={this.emailChange} type="email" placeholder="Email" />
  </FormGroup>
  <FormGroup controlId="formHorizontalPassword" validationState={this.getState()}>
      Password
      <FormControl value={this.state.passwordValue} onChange={this.passwordChange} type="password" placeholder="password" />
  </FormGroup>
  <FormGroup controlId="formHorizontalPassword1" validationState={this.getRepeatState()}>
      Password
      <FormControl value={this.state.repeatPasswordValue} onChange={this.repeatPasswordChange} type="password" placeholder="repeat password" />
  </FormGroup>
  <HelpBlock>{this.props.message}</HelpBlock>
    <Col smOffset={0} sm={10}>
      <Button bsStyle='primary' type="submit">Create account</Button>
    </Col>
</Form>
</div>
)
 }

  renderLogin() {
      return (
        <div>
        <p style={{fontWeight: 'bold', fontSize: '100%'}}>login</p>
  <br />
  <Form horizontal onSubmit={this.handleSubmit}>
  <FormGroup controlId="formHorizontalEmail">
  Email
  <FormControl value={this.state.emailValue} onChange={this.emailChange} type="email" placeholder="Email" />
  </FormGroup>
  <FormGroup controlId="formHorizontalPassword">
  Password
  <FormControl  value={this.state.passwordValue} onChange={this.passwordChange} type="password" placeholder="Password" />
  </FormGroup>
  <HelpBlock>{this.props.loginMessage}</HelpBlock>
  <FormGroup>
    <Button bsStyle='primary' type="submit">login</Button>
  <a href='/password-recover'>  forgot your password?</a>
  </FormGroup>
  </Form>
       </div>
      )

  }

   render() {
    return (
    <div>
      <Modal
        show={this.props.liloModalState}
        onHide={() => this.props.liloModalChangeState(false)}
        bsSize="large"
        aria-labelledby="contained-modal-title-lg"
        >
        <Modal.Header closeButton>
              <p style={{ fontSize:'120%'}}>Register/Login</p>
        </Modal.Header>
        <Grid>
        <Modal.Body style={{height: window.innerHeight - 100}}>
    <Row className="show-grid">
    <Col xs={5} md={3} lg={4} style={{marginRight: '1%'}}>
         {this.renderRegister()}
    </Col>
    <Col xs={5} md={3} lg={4}>
       {this.renderLogin()}
     </Col>
      <Col xs={1} md={6} lg={4}></Col>
     </Row>
        </Modal.Body>
      </Grid>
      </Modal>
    </div>
    );

  }
}

const mapStateToProps = state => {
return {
  photos: state.def.photos,
  liloModalState: state.def.liloModalState
 };
};

export default connect(mapStateToProps, {
  liloModalChangeState
})(logoutModal);
