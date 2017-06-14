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
	// const result2 = await yelp.accessToken(clientId, clientSecret).then(response => {
	//   const client = yelp.client(response.jsonBody.access_token);

	//   client.search(searchRequest).then(response => {
	// 	const firstResult = response.jsonBody.businesses[0];
	// 	const prettyJson = JSON.stringify(firstResult, null, 4);
	// 	console.log(prettyJson);
	// 	return prettyJson;
	//   });
	// }).catch(e => {
	//   console.log(e);
	// });

	const res = await yelp.accessToken(clientId, clientSecret);
	const client = await yelp.client(res.jsonBody.access_token);
	const res2 = await client.search(searchRequest);
	const firstResult = await res2.jsonBody.businesses;
	const prettyJson = await JSON.stringify(firstResult, null, 4);
	// console.log(prettyJson);
	return firstResult || [];

	// return result2 || [];
  },
};

export default searchResult;
