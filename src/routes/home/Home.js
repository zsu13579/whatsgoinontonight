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
import s from './Home.css';

class Home extends React.Component {

  constructor(...args) {
    super(...args);
  };


  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>Where do you want to go</h1>          
        </div>
      </div>
    );
  }
}

export default compose(
  withStyles(s),
)(Home);
