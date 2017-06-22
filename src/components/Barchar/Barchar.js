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
import s from './Barchar.css';
import Link from '../Link';
import { connect } from 'react-redux';
import { Image,Glyphicon } from 'react-bootstrap';
import update from 'immutability-helper';
import BarcharQuery from './BarcharQuery.graphql';
import Img from 'react-image';

class Barchar extends React.Component {
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

  deleteWin = (e) => {
    let id = e.target.id;
    this.props.deleteWin({ id });
  }

  render() {
    let { id , imgurl, title, owner, like, notlike, deleteFlag } = this.props;
    return (
      <div className={s.root}>
        <div className={s.container}>
      
          <ResponsiveReactGridLayout className="layout" layouts={this.state.layouts} onLayoutChange={this.onLayoutChange}
            breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
            cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}>
            <div key={'d'} className={s.echarts} data-grid={{x: 4, y: 0, w: this.state.width, h: 2}} >  
              <ECharts option={option}/>
            </div>
          </ResponsiveReactGridLayout>
	
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

const deleteWinMutations = graphql(deleteWinMutation,{
  props: ({ ownProps, mutate }) => ({
    deleteWin: ({ id }) =>
      mutate({
        variables: { id },
        refetchQueries: [{
          query: recentwinsQuery,
          },
          {
          query: yourwinsQuery,
          variables: { username: ownProps.username}
          },
        ],
      }),
  }),
});

export default compose(
  withStyles(s),
  connect(mapStateToProps),
  addLikeMutations,
  deleteWinMutations,
)(Barchar);
