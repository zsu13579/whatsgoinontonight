
import { GraphQLList as List } from 'graphql';
import fetch from '../../core/fetch';
import TemperatureType from '../types/TemperatureType';

// temperature data
const url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json';

const temperature = {
  type: new List(TemperatureType),
  async resolve() {

      let items = [];
      let lastFetchTask;

      lastFetchTask = await fetch(url)
        .then(response => response.json())
        .then((res) => {
          let baseTemperature = res.baseTemperature;
    		  res.monthlyVariance.forEach(function(value,index,arr){ 
           let val = value;
           val.realTemp = baseTemperature+value.variance;           
    			 items.push(val);
    		  })
        })
        .finally(() => {
          lastFetchTask = null;
        });

	return items;
  },
};

export default temperature;
