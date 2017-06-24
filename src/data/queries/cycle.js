
import { GraphQLList as List } from 'graphql';
import fetch from '../../core/fetch';
import CycleTypea from '../types/CycleTypea';

// cycle data
const url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

const cycle = {
  type: new List(new List(CycleTypea)),
  async resolve() {

      let items = [[],[]];
      let lastFetchTask;

      lastFetchTask = await fetch(url)
        .then(response => response.json())
        .then((res) => {
		  res.forEach(function(value,index,arr){
			  value.Doping == "" ? items[0].push(value) : items[1].push(value);
		  })
        })
        .finally(() => {
          lastFetchTask = null;
        });

	return items;
  },
};

export default cycle;
