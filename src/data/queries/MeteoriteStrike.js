
import { GraphQLList as List } from 'graphql';
import fetch from '../../core/fetch';
import MeteoriteStrikeType from '../types/MeteoriteStrikeType';

// gdp data
const url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json';

const meteoriteStrike = {
  type: new List(MeteoriteStrikeType),
  async resolve() {

      let items = [];
      let lastFetchTask;

      lastFetchTask = await fetch(url)
        .then(response => response.json())
        .then((res) => {
		  res.features.forEach(function(value,index,arr){
        if(value.geometry && value.properties){
			   items.push(Object.assign(value.geometry,value.properties));
        }
		  })
        })
        .finally(() => {
          lastFetchTask = null;
        });

	return items;
  },
};

export default meteoriteStrike;
