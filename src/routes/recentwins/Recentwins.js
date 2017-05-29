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
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import recentwinsQuery from './recentwinsQuery.graphql';
import s from './Recentwins.css';
import { Image } from 'react-bootstrap';
import Masonry from 'react-masonry-component';
import Win from '../../components/Win';

class Recentwins extends React.Component {

  constructor(...args) {
	super(...args);
    // this.state = {wins: this.props.data.wins, loading:this.props.data.loading};
  }		
  
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
    
  render() {

  	if (this.props.loading) {
	  return (<div>Loading</div>)
	}

	if (this.props.error) {
	  console.log(this.props.error)
      return (<div>An unexpected error occurred</div>)
	}

    return (
	  <div className={s.root}>
        <div className={s.container}>
          <h1>Recent Wins</h1>
          
		  <Masonry className={s.mason} >  
		  {this.props.wins.map(item => (
			<Win className={s.myGallery1} 
				id = {item.id}
				imgurl = {item.img}
				title = {item.title}
				owner = {item.owner}
				like = {item.like}
				notlike = {item.notlike}
				key = {item.id} 
			/>		
          ))}
		  </Masonry>
		  
        </div>
      </div>
    );
  }
}

const withData = graphql(recentwinsQuery, {
  props: ({ data: { loading, wins } }) => ({
    loading, wins: wins || [],
  }),
});

export default compose(
  withStyles(s),
  withData,
)(Recentwins);
