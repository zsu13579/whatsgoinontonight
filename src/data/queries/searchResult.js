import { GraphQLList as List } from 'graphql';
import SearchType from '../types/SearchType';
import { Enroll } from '../models';

import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const searchResult = {

  type: new List(SearchType),
  args: {
    owner: { type: StringType },
    name: { type: StringType },
    desc: { type: StringType },
    city: { type: StringType },
  },
  async resolve(root,args) { 
    const result = await Enroll.findAll({where: args, order: [['createdAt','DESC']]});
    return result;
  },
};

export default searchResult;
