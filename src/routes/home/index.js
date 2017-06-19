
import React from 'react';
import Home from './Home';
import Layout from '../../components/Layout';

export default {

  path: '/',
  
  async action( {store} ) {
	
	// console.log(store.getState().runtime.showResult);
    return {
      title: 'Welcome Nightelfs',
      component: <Layout><Home /></Layout>,
    };
  },

};
