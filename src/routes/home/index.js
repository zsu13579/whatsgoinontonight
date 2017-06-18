
import React from 'react';
import Home from './Home';
import Layout from '../../components/Layout';

export default {

  path: '/',
  
  async action() {

    return {
      title: 'Welcome Nightelfs',
      component: <Layout><Home showResult /></Layout>,
    };
  },

};
