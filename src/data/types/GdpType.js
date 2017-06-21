
import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLList as List
} from 'graphql';

const GdpType = new ObjectType({
  name: 'Gdp',
  fields: {
    value: { type: new List(StringType) },
  },
});

export default GdpType;
