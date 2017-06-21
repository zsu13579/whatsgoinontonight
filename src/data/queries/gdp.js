
import { GraphQLList as List } from 'graphql';
import fetch from '../../core/fetch';
import GdpType from '../types/GdpType';

// gdp data
const url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json';

let items = [];
let lastFetchTask;
let lastFetchTime = new Date(1970, 0, 1);

const gdp = {
  type: new List(GdpType),
  resolve() {
    if (lastFetchTask) {
      return lastFetchTask;
    }

    if ((new Date() - lastFetchTime) > 1000 * 60 * 10 /* 10 mins */) {
      lastFetchTime = new Date();
      lastFetchTask = fetch(url)
        .then(response => response.json())
        .then((data) => {
          if (data.status === 'ok') {
            items = data.data;
          }

          return items;
        })
        .finally(() => {
          lastFetchTask = null;
        });

      if (items.length) {
        return items;
      }

      return lastFetchTask;
    }

    return items;
  },
};

export default gdp;
