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

class Recentwins extends React.Component {

  constructor(...args) {
	super(...args);
	const { wins } = this.props.data;
    this.state = {wins: wins};
  }		
  
  static propTypes = {
	  wins: PropTypes.arrayOf(PropTypes.shape({
		id: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired,
		owner: PropTypes.string.isRequired,
		img: PropTypes.string,
		like: PropTypes.string,
		notlike: PropTypes.string,
	  })).isRequired,
  };
    
  render() {
    return (
	  <div className={s.root}>
        <div className={s.container}>
          <h1>Recent Wins</h1>
          {this.state.wins.map(item => (
            <article className={s.newsItem}>
              <h1 className={s.newsTitle}><a href={item.img}>{item.title}</a></h1>              
            </article>
          ))}
        </div>
      </div>
    );
  }
}

export default compose(
  withStyles(s),
  graphql(recentwinsQuery),
)(Recentwins);
