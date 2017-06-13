/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import {
  GraphQLSchema as Schema,
  GraphQLObjectType as ObjectType,
} from 'graphql';

import me from './queries/me';
import news from './queries/news';
import searchResult from './queries/searchResult';
import profile from './queries/profile';
import addFun from './mutations/addFun';
import deleteFun from './mutations/deleteFun';
import uploadAvatar from './mutations/uploadAvatar';

const Mutation = new ObjectType({
  name: 'Mutation',
  fields: {
    addFun: addFun,
    deleteFun: deleteFun,
    uploadAvatar: uploadAvatar,
  }
});

const schema = new Schema({
  query: new ObjectType({
    name: 'Query',
    fields: {
      me,
      news,
	    searchResult,
      profile,
    },
  }),
  mutation: Mutation,
});

export default schema;
