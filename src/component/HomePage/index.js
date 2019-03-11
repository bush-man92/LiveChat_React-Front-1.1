import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Particles from 'react-particles-js';
import Login from '../Login';
import Registration from '../Registration';
import Logo from '../Logo/Logo.js';
import { Container, Row, Col, Button } from 'reactstrap';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

const validToken = gql`
  mutation validToken($token: String!) {
    validToken(token : $token) {
      response
    }
  }
`;

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: true,
      registration: false,
      redirect: false,
    }
  }
  
  handeLog = () => {
    this.setState({
      login: true,
      registration: false
    });
  }
  handleReg = () => {
    this.setState({
      login: false,
      registration: true
    })
  }
  
  handleTriger = () => {
    this.setState({ redirect: true }, () => this.props.history.push('/ChatContainerALL'))
  }

  handleResponse = async () => {
  const check_token = localStorage.getItem('jwt')
  if (check_token) {
    const token = JSON.parse(check_token)
    const response = await this.props.mutate({
       variables: {
        token: token.data.register || token.data.login
        }
      })
      .catch((error) => {
          this.setState({ redirect: false }, () => this.props.history.push('/'))
        });
      if (response) {
        if(response.data.validToken.response === "True"){
          this.handleTriger();
        }
        else {
          this.setState({ redirect: false }, () => this.props.history.push('/'))
        }
      }
  }
  else {
    this.setState({ redirect: false }, () => this.props.history.push('/'))
  }
}

  componentWillMount(){     //ili DidMount?
    this.handleResponse();
  }

  render() {
    const particleOptions= {
      particles: {
        number: {
          value: 80,
          density: {
            enable: true,
            value_area: 1000,
          }
        },
        "color": {
          "value": "random",
        },
      },
    };

    return(
      <>
        <Particles className='particles' params={particleOptions} />
        <Container>
          <Row>
            <Col xs="6" className='left'><Logo /></Col>
            <Col xs="6" >
              <Row className="red">
                <Col>
                  <Button id='login' onClick={this.handeLog}>Login</Button>
                  <Button id='registration' onClick={this.handleReg}>Registration</Button>
                  {this.state.login ? <Login trigerChat={this.handleTriger} /> : null}
                  {this.state.registration ? <Registration trigerChat={this.handleTriger} /> : null}
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default graphql(validToken) (withRouter(HomePage));
