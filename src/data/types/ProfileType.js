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
  GraphQLID as ID,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const ProfileType = new ObjectType({
  name: 'Profile',
  fields: {
    id: { type: new NonNull(StringType) },
    displayName: { type: StringType },
    picture: { type: StringType },
  },
});

export default ProfileType;
