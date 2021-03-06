import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import MessageList from './ChatBox';
import { Container, Row, Col } from 'reactstrap';
import './ChatContainerALL.css';

class ChatContainer extends Component {
	render() {
		return(
			<div className="d-flex" >
				<Container className="text-list " >
					<div>
						<MessageList/>
					</div>
					</Container>
				</div>
			);
	}
}

export default ChatContainer;