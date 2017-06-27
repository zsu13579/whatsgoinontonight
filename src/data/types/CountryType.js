
import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLFloat as FloatType,
  GraphQLNonNull as NonNull,
  GraphQLList as List
} from 'graphql';

const NodeType = new ObjectType({
  name: 'Node',
  fields: {
    country: { type: StringType },
    code: { type: StringType },
  },
});

const LinkType = new ObjectType({
  name: 'Link',
  fields: {
    target: { type: IntType },
    source: { type: IntType },
  },
});

const CountryType = new ObjectType({
  name: 'Country',
  fields: {
    nodes: { type: new List(NodeType) },
  	links: { type: new List(LinkType) },
  },
});

export default CountryType;
