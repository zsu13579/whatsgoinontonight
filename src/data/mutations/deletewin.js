import { Wins } from '../models';
import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const deletewin = {
  type: StringType,
  args: {
    id: { type: new NonNull(StringType) },
  },
  resolve: function(rootValue, args) {
	return Wins.destroy({where: {id: args.id}});
  }
}

export default deletewin;
