
import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLFloat as FloatType,
  GraphQLNonNull as NonNull,
  GraphQLList as List
} from 'graphql';

const TemperatureType = new ObjectType({
  name: 'Temperature',
  fields: {
    realTemp: { type: FloatType },
  	variance: { type: FloatType },
  	month: { type: IntType },
  	year: { type: IntType },
  },
});

export default TemperatureType;
