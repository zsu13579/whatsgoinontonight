import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { graphql, compose } from 'react-apollo';
import s from './searchResult.css';
import Link from '../Link';
import { connect } from 'react-redux';
import update from 'immutability-helper';
import searchResultQuery from './searchResultQuery.graphql';
import enrollMutation from './enrollMutation.graphql';
import notEnrollMutation from './notEnrollMutation.graphql';
import registerMutation from './registerMutation.graphql';
import Img from 'react-image';
import { Alert,Button,Panel,Accordion,Modal,FormGroup,FormControl,ControlLabel,HelpBlock,InputGroup,Image,Glyphicon,DropdownButton,MenuItem } from 'react-bootstrap';

class SearchResult extends React.Component {
  constructor(...args){
    super(...args);
	  this.state = { showModal: false,username: this.props.username }
  }

  enroll = (e) =>{
    let name = e.target.id;
    this.props.enroll({ name });
  }

  notEnroll = (e) => {
    let id = e.target.id;
    this.props.notEnroll({ id });
  }
  
  handleReg = (e) => {
  	this.setState({ showModal: true });
  };
  
  handleRegSubmit = (e) => {
  	let username = this.usernameipt.value;
  	let password = this.passwordipt.value;
  	this.props.register({username, password}).then((out) =>	
  	{
  	this.setState({ showModal: false, username: username });
  	})
  };

  render() {
	  
    let { searchKey } = this.props;
	let close = () => this.setState({ showModal: false});
	const formInstance = (
      <form>
        <FormGroup
          controlId="username"
        >
          <ControlLabel>Username</ControlLabel>
          <FormControl
            type="text"
            placeholder="Enter your name"
			name="username"
			inputRef= { ref => { this.usernameipt = ref; }}
          />
        </FormGroup>
        <FormGroup
          controlId="password"
        >
          <ControlLabel>Password</ControlLabel>
          <FormControl
            type="text"
            placeholder="Enter password"
			name="password"
			inputRef= { ref => { this.passwordipt = ref; }}
          />
        </FormGroup>
      </form>
    );
	
    return (
      <div className={s.root}>
        <div className={s.container}>   
		  <h1></h1>
		  <h3>{this.props.showResult==true ? 1 : 2}</h3>		  
		  { 
			this.props.searchResult.map(item => (
			 <h5 className={s.myGallery} key={item.id} >	
				{item.name}
        {this.state.username ? <i onClick={ this.enroll } id={item.name}> {item.isEnroll || 0}</i> : <Link to="/login/" > {item.isEnroll || 0}</Link>}
				
				{item.isEnroll == 1 ? (<i> <i className="fa fa-times" onClick={this.notEnroll} id={item.dbId}></i></i>) : <i></i>}            
			 </h5>
			))
		  }	
		  
		  <Modal
            show={this.state.showModal}
            onHide={close}
            container={this}
            aria-labelledby="contained-modal-title"
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title">Register</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Image src={this.state.imgurl} responsive rounded />
              { formInstance }
            </Modal.Body>
            <Modal.Footer>  
			  <Button bsStyle="primary" onClick={this.handleRegSubmit}>Submit</Button>			
              <Button onClick={close}>Close</Button>
            </Modal.Footer>
          </Modal>
		  
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  if(state.user){
    return {
      username: state.user.email,
	  showResult: state.runtime.showResult,
    }
  }
  return { showResult: state.showResult }
}

const enrollMutations = graphql(enrollMutation,{
  props: ({ ownProps, mutate }) => ({
    enroll: ({ name }) =>
      mutate({
        variables: { name, owner: ownProps.username },
        refetchQueries: [{
          query: searchResultQuery,
		  variables: {searchKey: ownProps.searchKey, username: ownProps.username}
        }],
      }),
  }),
});

const notEnrollMutations = graphql(notEnrollMutation,{
  props: ({ ownProps, mutate }) => ({
    notEnroll: ({ id }) =>
      mutate({
        variables: { id },
        refetchQueries: [{
          query: searchResultQuery,
		  variables: {searchKey: ownProps.searchKey, username: ownProps.username}
        }],
      }),
  }),
});

const registerMutations = graphql(registerMutation,{
  props: ({ ownProps, mutate }) => ({
    register: ({ username,password }) =>
      mutate({
        variables: { username,password },
      }),
  }),
});

const options = (ownProps) => {
  return {variables: {searchKey: ownProps.searchKey, username: ownProps.username}}
}

const withData = graphql(searchResultQuery, {
  options: options,
  props: ({ data: { loading, searchResult } }) => ({
    loading, searchResult: searchResult || [],
  }),
});

export default compose(
  withStyles(s),
  connect(mapStateToProps),
  withData,
  enrollMutations,
  notEnrollMutations,
  registerMutations,
)(SearchResult);
