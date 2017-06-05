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
import update from 'immutability-helper';
import recentwinsQuery from '../recentwins/recentwinsQuery.graphql';
import Win from '../../components/Win';

// import { reqForMyBooks, confirmReqForMyBooks } from '../../actions/book';

class Yourwins extends React.Component {

  constructor(...args) {
	super(...args);
    this.state = { wins:this.props.wins, showModal: false, imgurl: null };
	  this.handleAddWin = this.handleAddWin.bind(this);
  };

  static propTypes = {
	  loading: PropTypes.bool,  
	  wins: PropTypes.arrayOf(PropTypes.shape({
		  id: PropTypes.string.isRequired,
		  title: PropTypes.string.isRequired,
		  owner: PropTypes.string.isRequired,
		  img: PropTypes.string,
		  like: PropTypes.int,
		  notlike: PropTypes.int,
	  })).isRequired,
  };
    
  
  handleAddWin = (e) => {
  	let title = this.titleipt.value;
  	let url = this.urlipt.value;
  	let owner = this.props.username;
  	this.props.submit({title, url, owner}).then((out) =>	
  	{
  	// this.props.data.refetch();	
  	this.setState({ showModal: false, });
  	})
  };
       
  render() {
	  
    if (this.props.loading) {
      return (<div>Loading</div>)
    }

    if (this.props.error) {
      console.log(this.props.error)
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
			  {this.props.wins.map(item => (
				<Win className={s.myGallery1} 
				id = {item.id}
				imgurl = {item.img}
				title = {item.title}
				like = {item.like}
				notlike = {item.notlike}
				key = {item.id} 
				deleteFlag = "1"
			/>  
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
      username: state.user.email,
    }
  }
  return {}
}

const mapDispatch = () => {
  
}

const withMutations = graphql(yourwinsMutation,{
  props: ({ ownProps, mutate }) => ({
    submit: ({ title, url, owner }) =>
      mutate({
        variables: { title, url, owner },
        // optimisticResponse: {
          // __typename: 'Mutation',
          // wins: {
            // __typename: 'Win',
            // id: null,
            // title: title,
            // url: url,
            // owner: owner,
			// like: 0,
			// notlike: 0,
          // },
        // },
				
        update: (store, { data: { addwin } }) => {
  			// Read the data from our cache for this query.
  			const data = store.readQuery({ query: yourwinsQuery, variables: { username:owner } });
  			// Add our comment from the mutation to the end.
  			data.wins.unshift(addwin); 			
        // Write our data back to the cache.
        store.writeQuery({ query: yourwinsQuery,variables: { username:owner }, data });
  			
        },
        refetchQueries: [{
          query: recentwinsQuery,
        }],
      }),
  }),
});


const options = (ownProps) => {
  return {variables: {username: ownProps.username}}
}

const withData = graphql(yourwinsQuery, {
  options: options,
  props: ({ data: { loading, wins } }) => ({
    loading, wins: wins || [],
  }),
});

export default compose(
  withStyles(s),
  connect(mapStateToProps),
  withData,
  withMutations,
)(Yourwins);


