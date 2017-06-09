/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './SearchResult.css';
import { Alert,Form,Button,Panel,Accordion,Modal,FormGroup,FormControl,ControlLabel,HelpBlock,InputGroup,Image,Glyphicon,DropdownButton,MenuItem } from 'react-bootstrap';


class Home extends React.Component {

  constructor(...args) {
    super(...args);
	this.sate = { funList:[], showResult: false, searchKey: "New York" };
  };
  
  handleSearch = () => {
	let city = this.cityipt;
	this.props.citySearch({city}).then((res)=>{
		this.setState({ funList:res })
	});
  }

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>Where do you want to go</h1>
		  <Form inline>
			<FormGroup
			  controlId="city"
			>
			  <FormControl
				type="text"
				placeholder="Enter city"
				inputRef= { ref => { this.cityipt = ref; }}
			  />
			</FormGroup>
			<Button bsStyle="primary" bsSize="large" onClick={handleSearch}>
				Search
			</Button>
		  </Form>
		  { this.state.showResult ?
		  <SearchResult
			searchKey = { this.state.searchKey }
		  /> : "" }
		  { 
			this.state.funList.map(item => (
				item.business.name
			))
		  }
        </div>
      </div>
    );
  }
}

const withData = graphql({
	props: ({ ownProps, mutate }) => ({
    citySearch: ({ city }) =>
      query({
        variables: { title, url, owner },
        // optimisticResponse: {
          // __typename: 'Mutation',
          // wins: {
            // __typename: 'Win',
            // id: null,
            // title: title,
            // url: url,
            // owner: owner,
			// like: 0,
			// notlike: 0,
          // },
        // },
				
        update: (store, { data: { addwin } }) => {
  			// Read the data from our cache for this query.
  			const data = store.readQuery({ query: yourwinsQuery, variables: { username:owner } });
  			// Add our comment from the mutation to the end.
  			data.wins.unshift(addwin); 			
        // Write our data back to the cache.
        store.writeQuery({ query: yourwinsQuery,variables: { username:owner }, data });
  			
        },
        refetchQueries: [{
          query: recentwinsQuery,
        }],
      }),
  }),
})

export default compose(
  withStyles(s),
)(Home);
