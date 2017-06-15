import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { graphql, compose } from 'react-apollo';
import s from './searchResult.css';
import Link from '../Link';
import { connect } from 'react-redux';
import { Image,Glyphicon } from 'react-bootstrap';
import update from 'immutability-helper';
import searchResultQuery from './searchResultQuery.graphql';
import enrollMutation from './enrollMutation.graphql';
import notEnrollMutation from './notEnrollMutation.graphql';
import Img from 'react-image';

class SearchResult extends React.Component {
  constructor(...args){
    super(...args);
  }

  enroll = (e) =>{
    let name = e.target.id;
	console.log(name);
    this.props.enroll({ name });
  }

  notEnroll = (e) => {
    let id = e.target.id;
    this.props.notEnroll({ id });
  }
  
  handleReg = (e) => {
  	// let title = this.titleipt.value;
  	// let url = this.urlipt.value;
  	// let owner = this.props.username;
  	// this.props.submit({title, url, owner}).then((out) =>	
  	// {
  	// // this.props.data.refetch();	
  	// this.setState({ showModal: false, });
  	// })
	console.log("123")
  };

  render() {
    let { searchKey } = this.props;
    return (
      <div className={s.root}>
        <div className={s.container}>   		
		  { 
			this.props.searchResult.map(item => (
			 <h5 className={s.myGallery} key={item.id} >	
				{item.name}
				<i onClick={this.props.username ? this.enroll : this.handleReg} id={item.name}> {item.isEnroll || 0}</i>
				{item.isEnroll == 1 ? (<i> <i className="fa fa-times" onClick={this.notEnroll} id={item.dbId}></i></i>) : <i></i>}            
			 </h5>
			))
		  }	
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
)(SearchResult);
