
import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const SearchType = new ObjectType({
  name: 'Search',
  fields: {
	  id: { type: new NonNull(StringType) },  
    name: { type: new NonNull(StringType) },
    desc: { type: StringType },
    isEnroll: { type: IntType },
  },
});

export default SearchType;
