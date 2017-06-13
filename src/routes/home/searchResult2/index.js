/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Layout from '../../components/Layout';
import Yourwins from './Yourwins';

const title = 'Your Wins';

export default {

  path: '/yourwins',

  async action() {
    return {
      title: 'React Starter Kit',
      component: <Layout><Yourwins /></Layout>,
    };
  },

};
