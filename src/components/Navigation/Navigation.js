/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Navigation.css';
import Link from '../Link';
import { connect } from 'react-redux';

class Navigation extends React.Component {
  render() {
    const { username } = this.props;
    return username ? (
      <div className={s.root} role="navigation">
		<Link className={s.link} to="/">Home</Link>
        <Link className={s.link} to="/profile"><i className="fa fa-cog fa-fw" aria-hidden="true"></i></Link>
        <a className={s.link} href="/logout"><i className="fa fa-sign-out fa-fw" aria-hidden="true"></i></a>    
      </div>
    ) : 
  (
      <div className={s.root} role="navigation">
      <Link className={s.link} to="/">Home</Link>
        <Link className={s.link} to="/login">Log in</Link>
        <span className={s.spacer}>or</span>
        <Link className={cx(s.link, s.highlight)} to="/register">Sign up</Link>
      </div>
    )
  }
}

function mapStateToProps(state) {
  if(state.user){
    return {
      username: state.user.email
    }
  }
  return {}
}


export default connect(mapStateToProps)(withStyles(s)(Navigation));
