import {
  GraphQLSchema as Schema,
  GraphQLObjectType as ObjectType,
} from 'graphql';

import me from './queries/me';
import news from './queries/news';
import searchResult from './queries/searchResult';
import profile from './queries/profile';
import gdp from './queries/gdp';
import cycle from './queries/cycle';
import enroll from './mutations/enroll';
import notEnroll from './mutations/notEnroll';
import uploadAvatar from './mutations/uploadAvatar';
import register from './mutations/register';

const Mutation = new ObjectType({
  name: 'Mutation',
  fields: {
    enroll: enroll,
    notEnroll: notEnroll,
    register: register,
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
	    gdp,
      cycle,
    },
  }),
  mutation: Mutation,
});

export default schema;
