
import {
  GraphQLObjectType as ObjectType,
  GraphQLString as IntType,
  GraphQLNonNull as NonNull,
  GraphQLList as List
} from 'graphql';

const GdpType = new ObjectType({
  name: 'Gdp',
  fields: {
    xData: { type: new List(IntType) },
	sData: { type: new List(IntType) },
  },
});

export default GdpType;
