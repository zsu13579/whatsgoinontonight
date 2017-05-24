/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { GraphQLList as List } from 'graphql';
// import fetch from '../../core/fetch';
import WinsItemType from '../types/WinsItemType';
import { Wins } from '../models';

import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const wins = {

  type: new List(WinsItemType),
  args: {
    id: { type: StringType },
    owner: { type: StringType },
    img: { type: StringType },
    like: { type: StringType },
    notlike: { type: StringType },
    title: { type: StringType },
  },
  resolve(root,args) { 
    return Wins.findAll({where: args});
  },
};

export default wins;
