
import { GraphQLList as List } from 'graphql';
import fetch from '../../core/fetch';
import CountryType from '../types/CountryType';

// country data
const url = 'https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json';

const country = {
  type: CountryType,
  async resolve() {

      let items = [];
      let lastFetchTask;

      lastFetchTask = await fetch(url)
        .then(response => response.json())
        .then((res) => {
          items = res;
        })
        .finally(() => {
          lastFetchTask = null;
        });

	return items;
  },
};

export default country;
