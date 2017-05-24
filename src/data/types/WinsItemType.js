/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const WinsItemType = new ObjectType({
  name: 'WinsItem',
  fields: {
	id: { type: new NonNull(StringType) },  
    title: { type: new NonNull(StringType) },
    owner: { type: new NonNull(StringType) },
    img: { type: StringType },
    like: { type: StringType },
    notlike: { type: StringType },
  },
});

export default WinsItemType;
