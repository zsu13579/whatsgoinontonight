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
import s from './Home.css';
import { Alert,Form,Button,Panel,Accordion,Modal,FormGroup,FormControl,ControlLabel,HelpBlock,InputGroup,Image,Glyphicon,DropdownButton,MenuItem } from 'react-bootstrap';
import SearchResult from '../../components/searchResult';

class Home extends React.Component {

  constructor(...args) {
    super(...args);
	this.state = { showResult: false, searchKey: "New York" };
  };
  
  handleSearch = (e) => {
	e.preventDefault();
	let city = this.cityipt.value;
	this.setState({ searchKey: city, showResult: true });
  };

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>Where do you want to go tonight</h1>
    		  <Form inline onSubmit={this.handleSearch}>
      			<FormGroup
      			  controlId="city"
      			>
      			  <FormControl
      				type="text"
      				placeholder="Enter city"
      				inputRef= { ref => { this.cityipt = ref; }}
      			  />
      			</FormGroup>
      			<Button bsStyle="primary" bsSize="large" onClick={this.handleSearch}>
      				Search
      			</Button>
    		  </Form>
    		  { this.state.showResult ?
    		  <SearchResult
    			searchKey = {this.state.searchKey}
    		  /> : "" }
        </div>
      </div>
    );
  }
}

export default compose(
  withStyles(s),
)(Home);
