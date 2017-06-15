/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { GraphQLList as List } from 'graphql';
import EnrollType from '../types/EnrollType';
import { Enroll } from '../models';
import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const enroll = {
  type: EnrollType,
  args: {
    name: { type: new NonNull(StringType) },
    owner: { type: new NonNull(StringType) },
  },
  resolve: async function(rootValue, args) {
	let enrollVal = Object.assign({}, args);
	return Enroll.create(enrollVal);
  }
}

export default enroll;
