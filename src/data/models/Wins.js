/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import DataType from 'sequelize';
import Model from '../sequelize';

const Wins = Model.define('Wins', {

  id: {
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
    primaryKey: true,
  },

  title: {
    type: DataType.STRING(255),
  },
  owner: {
    type: DataType.STRING(255),
  },
  img: {
    type: DataType.STRING(255),
  },
  like: {
    type: DataType.INTEGER,
  },

  notlike: {
    type: DataType.INTEGER,
  },

}, {

  indexes: [
    { fields: ['title'] },
  ],

});

export default Wins;
