/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { graphql, compose } from 'react-apollo';
import s from './Win.css';
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

  addFun = (e) =>{
    let name = e.target.name;
    this.props.addFun({ name });
  }

  deleteFun = (e) => {
    let id = e.target.id;
    this.props.deleteFun({ id });
  }

  render() {
    let { searchKey } = this.props;
    return (
      <div className={s.root}>
        <div className={s.container}>   		
		  { 
			this.props.searchResult.map(item => (
			 <span className={s.myGallery} key={item.id} >	
				item.name
				<i onClick={this.addFun} name={item.name}>{item.isEnroll || 0}</i>;
				{item.isEnroll == 1 ? (<i><i className="fa fa-times" onClick={this.deleteFun} id={item.id}></i>&nbsp;&nbsp;</i>) : <i></i>};            
			 </span>
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
    enroll: ({ funName }) =>
      mutate({
        variables: { ownProps.username, funName },
        refetchQueries: [{
          query: searchResultQuery
        }],
      }),
  }),
});

const notEnrollMutations = graphql(notEnrollMutation,{
  props: ({ ownProps, mutate }) => ({
    enroll: () =>
      mutate({
        variables: { id },
        refetchQueries: [{
          query: searchResultQuery
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
  searchResultMutations,
)(SearchResult);
