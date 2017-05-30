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
import wins from './queries/wins';
import addwin from './mutations/addwin';
import deletewin from './mutations/deletewin';
import addlike from './mutations/addlike';

const Mutation = new ObjectType({
  name: 'Mutation',
  fields: {
    addwin: addwin,
	  addlike: addlike,
    deletewin: deletewin,
  }
});

const schema = new Schema({
  query: new ObjectType({
    name: 'Query',
    fields: {
      me,
      news,
	  wins,
    },
  }),
  mutation: Mutation,
});

export default schema;
