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
import { Image,Glyphicon } from 'react-bootstrap';
import update from 'immutability-helper';
import recentwinsQuery from '../../routes/recentwins/recentwinsQuery.graphql';
import addLikeMutation from './addLikeMutation.graphql';

class Win extends React.Component {
  constructor(...args){
    super(...args);
  }

  addLike = (e) =>{
    let id = e.target.id;
    let addtype = "LIKE_TYPE";
    this.props.addLike({id, addtype});
  }

  addNotLike = (e) =>{
    let id = e.target.id;
    let addtype = "NOT_LIKE_TYPE";
    this.props.addLike({id, addtype});
  }

  render() {
    let { id, imgurl, title, owner, like, notlike } = this.props;
    return (
      <div className={s.root}>
        <div className={s.container}>
    			<span className={s.myGallery} key={id} >
    				<Image src={imgurl} responsive rounded />		  
    				<h5 className={s.title}><a href={imgurl}>{title}</a></h5>
            <p>{owner}</p>
            <i className="fa fa-heart-o" onClick={this.addLike} id={id}></i> {like}&nbsp;&nbsp;&nbsp;<i className="fa fa-refresh" onClick={this.addNotLike} id={id} > </i> {notlike} 
    			</span>			
        </div>
      </div>
    );
  }
}

const addLikeMutations = graphql(addLikeMutation,{
  props: ({ ownProps, mutate }) => ({
    addLike: ({ id,addtype }) =>
      mutate({
        variables: { id,addtype },
        refetchQueries: [{
          query: recentwinsQuery
        }],
      }),
  }),
});

export default compose(
  withStyles(s),
  addLikeMutations,
)(Win);
