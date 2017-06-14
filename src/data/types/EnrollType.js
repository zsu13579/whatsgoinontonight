
import {
  GraphQLObjectType as ObjectType,
  GraphQLID as ID,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const EnrollType = new ObjectType({
  name: 'Enroll',
  fields: {
    id: { type: new NonNull(StringType) },
    name: { type: StringType },
    owner: { type: StringType },
  },
});

export default EnrollType;
