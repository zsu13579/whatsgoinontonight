/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { UserProfile } from '../models';
import ProfileType from '../types/ProfileType';
import {
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const profile = {
  type: ProfileType,
  args: {
	  id: { type: StringType },
    displayName: { type: StringType },
    picture: { type: StringType },
  },
  async resolve(root, args) {
    const result = await UserProfile.findOne({where: {displayName: args.displayName}});
    return result;
  },
};

export default profile;
