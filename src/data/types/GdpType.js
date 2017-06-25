
import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLList as List
} from 'graphql';

const GdpType = new ObjectType({
  name: 'Gdp',
  fields: {
    xData: { type: new List(StringType) },
	sData: { type: new List(StringType) },
  },
});

export default GdpType;
