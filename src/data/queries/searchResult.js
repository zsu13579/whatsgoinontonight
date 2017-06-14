import { GraphQLList as List } from 'graphql';
import SearchType from '../types/SearchType';
import { Enroll } from '../models';
import yelp from 'yelp-fusion';

import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const searchResult = {

  type: new List(SearchType),
  args: {
    owner: { type: StringType },
    name: { type: StringType },
    desc: { type: StringType },
    city: { type: StringType },
  },
  async resolve(root,args) { 
    const result = await Enroll.findAll({where: {name: args.name, owner: args.owner}, order: [['createdAt','DESC']]});
	const clientId = 'orAHD13T4VxSfMhAZcHMew';
	const clientSecret = 'v8c2Znu9b7dPd7urnaY6PDbZYNGyM2REoB8wx1M9OoyP533A2rv6X3HwdWCn5ysX';
    const searchRequest = {
	  term:'Four Barrel Coffee',
	  location: 'san francisco, ca'
	};
	yelp.accessToken(clientId, clientSecret).then(response => {
	  const client = yelp.client(response.jsonBody.access_token);

	  client.search(searchRequest).then(response => {
		const firstResult = response.jsonBody.businesses[0];
		const prettyJson = JSON.stringify(firstResult, null, 4);
		console.log(prettyJson);
	  });
	}).catch(e => {
	  console.log(e);
	});
	return result || [];
  },
};

export default searchResult;
