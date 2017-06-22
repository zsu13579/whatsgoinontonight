
import { GraphQLList as List } from 'graphql';
import fetch from '../../core/fetch';
import GdpType from '../types/GdpType';

// gdp data
const url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json';

let items = {xData: [],sData: []};
let lastFetchTask;

const gdp = {
  type: GdpType,
  async resolve() {

      lastFetchTask = await fetch(url)
        .then(response => response.json())
        .then((res) => {
		  res.data.forEach(function(value,index,arr){
			  items.xData.push(value[0]);
			  items.sData.push(value[1]);
		  })
        })
        .finally(() => {
          lastFetchTask = null;
        });

	return items;
  },
};

export default gdp;
