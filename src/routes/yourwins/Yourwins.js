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
import s from './Yourwins.css';
import { graphql, compose } from 'react-apollo';
import yourwinsQuery from './yourwinsQuery.graphql';
import yourwinsMutation from './yourwinsMutation.graphql';
import { Alert,Button,Panel,Accordion,Modal,FormGroup,FormControl,ControlLabel,HelpBlock,InputGroup,Image,Glyphicon,DropdownButton,MenuItem } from 'react-bootstrap';
import { connect } from 'react-redux';
import Masonry from 'react-masonry-component';
// import { reqForMyBooks, confirmReqForMyBooks } from '../../actions/book';

class Yourwins extends React.Component {

  constructor(...args) {
	  super(...args);
    this.state = { wins: this.props.data.wins, showModal: false, imgurl: null, loading: this.props.data.loading};
  };

  static propTypes = {
    data: PropTypes.shape({
      loading: PropTypes.bool,  
      wins: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      owner: PropTypes.string.isRequired,
      img: PropTypes.string,
      like: PropTypes.string,
      notlike: PropTypes.string,
      })).isRequired,
    }).isRequired
  };
    
  
  handleAddWin = (e) => {
	let title = this.titleipt.value;
	let url = this.urlipt.value;
	let owner = this.props.username;
	this.props.mutate({variables: {title:title, url:url, owner: owner}}).then((out) =>	
	{
	this.setState({ showModal: false, wins:out.data.addwin });
	})
  };
       
  render() {
	  
    if (this.state.loading) {
      return (<div>Loading</div>)
    }

    if (this.props.data.error) {
      console.log(this.props.data.error)
        return (<div>An unexpected error occurred</div>)
    }

    let open = () => this.setState({ showModal: true});
    let close = () => this.setState({ showModal: false});
    let handleChange = (e) => this.setState({ imgurl: e.target.value });

    const formInstance = (
      <form>
        <FormGroup
          controlId="title"
        >
          <ControlLabel>Title</ControlLabel>
          <FormControl
            type="text"
            placeholder="Enter title"
			inputRef= { ref => { this.titleipt = ref; }}
          />
        </FormGroup>
        <FormGroup
          controlId="url"
        >
          <ControlLabel>Image Url</ControlLabel>
          <FormControl
            type="text"
            placeholder="Enter image url"
            onChange={handleChange}
			inputRef= { ref => { this.urlipt = ref; }}
          />
        </FormGroup>
      </form>
    );

    return (
	   <div className={s.root}>
        <div className={s.container}>
          <h1>Your Wins</h1>
          <Button bsStyle="primary" bsSize="large" onClick={open}>Add a Win</Button>  
          
		  <Masonry className={s.mason} >  
		  {this.state.wins.map(item => (
			<span className={s.myGallery}>
				<Image src={item.img} responsive rounded />		  
				<h5 className={s.title}><a href={item.img}>{item.title}</a></h5>  
			</span>			
          ))}
		  </Masonry>
		  
          <Modal
            show={this.state.showModal}
            onHide={close}
            container={this}
            aria-labelledby="contained-modal-title"
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title">Add a Win</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Image src={this.state.imgurl} responsive rounded />
              { formInstance }
            </Modal.Body>
            <Modal.Footer>
              <Button bsStyle="primary" onClick={this.handleAddWin}>Submit</Button>
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
      username: state.user.email
    }
  }
}

const mapDispatch = () => {
  
}

const options = (ownProps) => {
  return {variables: {username: ownProps.username}}
}

export default compose(
  withStyles(s),
  connect(mapStateToProps),
  graphql(yourwinsQuery, {options: options}),
  graphql(yourwinsMutation),
)(Yourwins);

