/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { GraphQLList as List } from 'graphql';
import WinsItemType from '../types/WinsItemType';
import { Wins } from '../models';
import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const addwin = {
  type: new List(WinsItemType),
  args: {
    title: { type: new NonNull(StringType) },
    owner: { type: new NonNull(StringType) },
    img: { type: StringType },
    like: { type: StringType },
    notlike: { type: StringType },
  },
  resolve: async function(rootValue, args) {
	let winVal = Object.assign({}, args);
	await Wins.create(winVal);
	return Wins.findAll({where: {owner: args.owner}});
  }
}

export default addwin;
