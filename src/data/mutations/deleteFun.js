import { Enroll } from '../models';
import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const deleteFun = {
  type: StringType,
  args: {
    id: { type: new NonNull(StringType) },
  },
  resolve: function(rootValue, args) {
	return Enroll.destroy({where: {id: args.id}});
  }
}

export default deleteFun;
