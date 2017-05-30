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
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const wins = {

  type: new List(WinsItemType),
  args: {
    id: { type: StringType },
    owner: { type: StringType },
    img: { type: StringType },
    like: { type: IntType },
    notlike: { type: IntType },
    title: { type: StringType },
  },
  async resolve(root,args) { 
    const result= await Wins.findAll({where: args, order: [['createdAt','DESC']]});
    return result;
  },
};

export default wins;
