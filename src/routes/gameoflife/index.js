
import React from 'react';
import Gameoflife from './Gameoflife';
import Layout from '../../components/Layout';

export default {

  path: '/gameoflife',
  
  async action( {store} ) {
	
    return {
      title: 'Game of Life',
      component: <Layout><Gameoflife /></Layout>,
    };
  },

};
