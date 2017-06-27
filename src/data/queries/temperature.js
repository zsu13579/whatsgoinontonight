
import { GraphQLList as List } from 'graphql';
import fetch from '../../core/fetch';
import TemperatureType from '../types/TemperatureType';

// temperature data
const url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json';

const temperature = {
  type: new List(TemperatureType),
  async resolve() {

      let items = [];
	  let result = [];
      let lastFetchTask;

      lastFetchTask = await fetch(url)
        .then(response => response.json())
        .then((res) => {
          items = res;
        })
        .finally(() => {
          lastFetchTask = null;
        });
		
	  let baseTemperature = items.baseTemperature;
	  items.monthlyVariance.forEach(function(value,index,arr){ 
		  let val = value;
		  val.realTemp = baseTemperature+value.variance;           
			 result.push(val);
	  });	

	return result;
  },
};

export default temperature;
