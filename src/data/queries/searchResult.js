import { GraphQLList as List } from 'graphql';
import SearchType from '../types/SearchType';
import { Enroll } from '../models';
import yelp from 'yelp-fusion';
// import localStorage from 'localStorage';

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
    const enrollResult = await Enroll.findAll({where: { owner: args.owner }, order: [['createdAt','DESC']]});
	// console.log(enrollResult[0].name);

	// save search info so that when login do not need to search again
	// try {
	// localStorage = new LocalStorage('./scratch');
	// localStorage.setItem('showResult', true);
	// localStorage.setItem('searchKey', city);
	// } catch(e) {
	//   return undefined;
	// }

	// var localStorage = require('localStorage');
	// let myVal = { showResult: true, searchKey: 'new york' };
	// // localStorage.setItem('showResult', true);
	// // localStorage.setItem('searchKey', 'new york');
	// localStorage.setItem('myKey', JSON.stringify(myVal));
	// let searchKey = localStorage.getItem('myKey');
 //    console.log(searchKey)

	// use yelp api to get bars info
	const clientId = 'orAHD13T4VxSfMhAZcHMew';
	const clientSecret = 'v8c2Znu9b7dPd7urnaY6PDbZYNGyM2REoB8wx1M9OoyP533A2rv6X3HwdWCn5ysX';
    const searchRequest = {
	  term:'bar',
	  location: args.city
	};

	const res = await yelp.accessToken(clientId, clientSecret);
	const client = await yelp.client(res.jsonBody.access_token);
	const res2 = await client.search(searchRequest);
	const allResult = await res2.jsonBody.businesses;
	const firstResult = await res2.jsonBody.businesses[0];
	const prettyJson = await JSON.stringify(firstResult, null, 4);
	console.log(prettyJson);
	allResult.forEach(function(value,index){
		enrollResult.forEach(function(enrollVal){
			if(enrollVal.name == value.name){
				allResult[index].isEnroll=1;
				allResult[index].dbId=enrollVal.id;
				}
		})
	});
	return allResult || [];

	// return result2 || [];
  },
};

export default searchResult;
