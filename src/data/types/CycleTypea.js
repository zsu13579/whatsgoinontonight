
import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
  GraphQLList as List
} from 'graphql';

const CycleTypea = new ObjectType({
  name: 'Cycle',
  fields: {
    Time: { type: StringType },
    Year: { type: StringType },
	Place: { type: IntType },
	Seconds: { type: IntType },
	Name: { type: StringType },
	Nationality: { type: StringType },
	Doping: { type: StringType },
	URL: { type: StringType },
  },
});

export default CycleTypea;
