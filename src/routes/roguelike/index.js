
import React from 'react';
import Roguelike from './Roguelike';
import Layout from '../../components/Layout';

export default {

  path: '/roguelike',
  
  async action( {store} ) {
	
    return {
      title: 'Roguelike Dungeon',
      component: <Layout><Roguelike /></Layout>,
    };
  },

};
