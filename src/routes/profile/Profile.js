/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Profile.css';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import FileUpload from 'react-fileupload';
import { FormGroup, Modal, Button,ControlLabel,HelpBlock,FormControl  } from 'react-bootstrap'
import Upload from 'rc-upload';
import profileQuery from './profileQuery.graphql';
import profileMutation from './profileMutation.graphql';

class Profile extends React.Component {

  constructor(props) {
    super(props);
    this.state = { showModal: false, confirmPwdHint: "" };
	this.handleUpload = this.handleUpload.bind(this);
  }

  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  handleUpload = (filename) =>{
    let displayName = this.props.username;
    let picture = filename;
    this.props.uploadAvatar({displayName, picture});
  };
  
  open = () => {
	this.setState({ showModal: true, confirmPwdHint: "" })  
  };
  
  close = () => {
	this.setState({ showModal: false })  
  };
  
  handleConfirmPwd = (e) => {
	if(this.newPwd.value != e.target.value){ this.setState({ confirmPwdHint: "Two input passwords not the same!" }) }   
  }
  
  handleChangePwd = () => {
	  
  };

  render() {
		
    const uploaderProps = {
      action: '/profile',
      name: 'avatar',
      multiple: true,
      supportServerRender: true,
      onSuccess: (file) => {
		    this.handleUpload(file.filename)        
      },
    };
	
	const formInstance = (
      <form>
        
        <FormGroup
          controlId="oldPwd"
        >
          <ControlLabel>Old Password</ControlLabel>
          <FormControl
            type="text"
            placeholder="Enter old password"
			inputRef= { ref => { this.oldPwd = ref; }}
          />
        </FormGroup>
		<FormGroup
          controlId="newPwd"
        >
          <ControlLabel>New Password</ControlLabel>
          <FormControl
            type="text"
            placeholder="Enter new password"
			inputRef= { ref => { this.newPwd = ref; }}
          />
        </FormGroup>
		<FormGroup
          controlId="confirmNewPwd"
        >
          <ControlLabel>Confirm New Password</ControlLabel>
          <FormControl
            type="text"
            placeholder="Enter new password again"
			inputRef= { ref => { this.confirmNewPwd = ref; }}
			onChange= { this.handleConfirmPwd }
          />
		  { this.state.confirmPwdHint }
        </FormGroup>
      </form>
    );
	
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>{this.props.title} <Upload {...uploaderProps} ref="inner" className={s.avatarEdit} ><a>更新头像</a></Upload></h1>
          {this.props.profile.picture ? <img src={this.props.profile.picture} /> : <img src="default.png" /> }
          <h3>User : {this.props.username}  </h3> <h5 className={s.changePwd} onClick={this.open}><a>更新密码</a></h5>
		  <Modal
            show={this.state.showModal}
            onHide={this.close}
            container={this}
            aria-labelledby="contained-modal-title"
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title">Change Your Password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              { formInstance }
            </Modal.Body>
            <Modal.Footer>
              <Button bsStyle="primary" onClick={this.handleAddWin}>Submit</Button>
              <Button onClick={this.close}>Close</Button>
            </Modal.Footer>
          </Modal>	
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  if (state.user){
    return {username: state.user.email}
  }
  return {}
}

const withData = graphql(profileQuery,{
	options: (ownProps) => ({ variables: { username: ownProps.username } }),
	props: ({data: { loading, profile }}) => ({ loading, profile , })
})

const withMutations = graphql(profileMutation,{
	props: ({ ownProps,mutate }) => ({
		uploadAvatar: ({ displayName, picture }) => 
			mutate({
				variables: { displayName, picture },
				update: ( store, { data: profile}) => {
					// Read the data from our cache for this query.
					const data = store.readQuery({ query: profileQuery, variables: { username:displayName } });
					// Add our comment from the mutation to the end.
					data.profile.picture = picture; 			
					// Write our data back to the cache.
					store.writeQuery({ query: profileQuery,variables: { username:displayName }, data });					
				}
			})
	})
})

export default compose(
  withStyles(s),
  connect(mapStateToProps),
  withData,
  withMutations,
  )(Profile);
