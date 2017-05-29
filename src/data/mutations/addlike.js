/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { Wins } from '../models';
// import WinsItemType from '../types/WinsItemType';
import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const addlike = {
  type: StringType,
  args: {
    id: { type: new NonNull(StringType) },
    addtype: { type: StringType },
  },
  resolve: async function(rootValue, args) {
	// let winVal = Object.assign({}, args);
  let targetWin = await Wins.findOne({where: {id: args.id}});
  let like = args.addtype=="LIKE_TYPE" ? { like: parseInt(targetWin.like) + 1} : { notlike: parseInt(targetWin.notlike) + 1};
	return Wins.update(like,{where: {id: args.id}});
  }
}

export default addlike;
