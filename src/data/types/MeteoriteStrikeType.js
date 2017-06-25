
import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLFloat as FloatType,
  GraphQLNonNull as NonNull,
  GraphQLList as List
} from 'graphql';

const MeteoriteStrikeType = new ObjectType({
  name: 'MeteoriteStrike',
  fields: {
    coordinates: { type: new List(FloatType) },
    fall: { type: StringType },
  	mass: { type: IntType },
  	name: { type: StringType },
  	nameType: { type: StringType },
  	recclass: { type: StringType },
  	reclat: { type: FloatType },
  	year: { type: StringType },
  },
});

export default MeteoriteStrikeType;
