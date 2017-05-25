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
import {Image} from 'react-bootstrap';
import Masonry from 'react-masonry-component';

class Recentwins extends React.Component {

  constructor(...args) {
	super(...args);
    this.state = {wins: this.props.data.wins, loading:this.props.data.loading};
  }		
  
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
    
  render() {

  	if (this.state.loading) {
	  return (<div>Loading</div>)
	}

	if (this.props.data.error) {
	  console.log(this.props.data.error)
      return (<div>An unexpected error occurred</div>)
	}

    return (
	  <div className={s.root}>
        <div className={s.container}>
          <h1>Recent Wins</h1>
          
		  <Masonry className={s.mason} >  
		  {this.state.wins.map(item => (
			<span className={s.myGallery}>
				<Image src={item.img} responsive rounded />		  
				<h5 className={s.title}><a href={item.img}>{item.title}</a></h5>  
			</span>			
          ))}
		  </Masonry>
		  
        </div>
      </div>
    );
  }
}

export default compose(
  withStyles(s),
  graphql(recentwinsQuery),
)(Recentwins);
