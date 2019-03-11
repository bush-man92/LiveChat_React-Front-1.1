import React, { Component } from 'react';
import Sidebar from './Sidebar/Sidebar';
import UserList from './UserView'
import SendingMessages from './SendingMessages';
import './ChatContainerALL.css';
import MessageList from './ChatBox';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import {withRouter} from "react-router-dom";

const validToken = gql`
  mutation validToken($token: String!) {
    validToken(token : $token) {
			response
			id
		}
  }
`;

class ChatContainerALL extends Component {

	constructor(props) {
	    super(props);
	    this.state = {
				toggle: true,
				chatroomId: "1",
				id: 0
			}
	  }

	handleChatRoom = async (value) => {
		  await this.setState({
				chatroomId: value
		})
	}  

	handleToggle = () => {
		if(!this.state.toggle){
			this.setState({
				toggle: true
			})
		}
		else{
			this.setState({
				toggle: false,		
			})
		}
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
				this.props.history.push('/')
			});
			if (response) {
      	if(response.data.validToken.response === "True"){
					this.setState({
						id: response.data.validToken.id
					})
      	}
      	else {
        	this.props.history.push('/')
				}
			}
  }
  else {
    this.props.history.push('/')
  }
}

  componentWillMount(){
    this.handleResponse();
  }

	render() {
		return(
			<div className="wrapper">
					<div className='rows'>
						<aside className="aside aside-1"><Sidebar ChangingRoom={this.handleChatRoom} Hide={this.handleToggle}/> </aside>
						{this.state.toggle ?
	  					<aside className="aside aside-2" >Toggle private messages
	  							<UserList chatroomId = {this.state.chatroomId} id = {this.state.id} ChangingRoom = {this.handleChatRoom}/>
	  					</aside> : null}
  				</div>
  					<div className='columns'>
	  					<div className="container1">
	  						<MessageList chatroomId = {this.state.chatroomId}/>
							</div>
							<div className='container2'>
								<SendingMessages chatroomId = {this.state.chatroomId}/>
							</div>
						</div>
			</div>
			);
		}
	}

export default graphql(validToken) (withRouter(ChatContainerALL));