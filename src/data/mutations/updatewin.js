/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { Wins } from '../models';
import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const updatewin = {
  type: StringType,
  args: {
	id: { type: new NonNull(StringType) },  
    like: { type: StringType },
    notlike: { type: StringType },
  },
  resolve: function(rootValue, args) {
	let winVal = Object.assign({}, args);
	return Wins.update(winVal,{where: {id: args.id}});
  }
}

export default updatewin;
