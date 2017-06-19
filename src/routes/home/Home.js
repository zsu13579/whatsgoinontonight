
import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Home.css';
import { Alert,Form,Button,Panel,Accordion,Modal,FormGroup,FormControl,ControlLabel,HelpBlock,InputGroup,Image,Glyphicon,DropdownButton,MenuItem } from 'react-bootstrap';
import SearchResult from '../../components/searchResult';
import { connect } from 'react-redux';
import { setRuntimeVariable } from '../../actions/runtime';

class Home extends React.Component {

  constructor(...args) {
    super(...args);
    let showResult = this.props.showResult;
  	let searchKey;
  	console.log(this.props.searchKey);
  	this.props.searchKey ? searchKey = this.props.searchKey : searchKey = "new York" ;

    // try {
    // let localStorage = new LocalStorage('./scratch');
    // showResult = localStorage.getItem('showResult');
    // searchKey = localStorage.getItem('searchKey');
    // } catch(e) {
    //   return undefined;
    // }

    // var localStorage = require('localStorage');

    // showResult = localStorage.getItem('showResult');
    // searchKey = localStorage.getItem('searchKey');
    // let myVal = { showResult: true, searchKey: 'new york' };
    // // localStorage.setItem('showResult', true);
    // // localStorage.setItem('searchKey', 'new york');
    // localStorage.setItem('myKey', JSON.stringify(myVal));
    // let myKey = localStorage.getItem('myKey');
    // console.log(myKey)
    // console.log(showResult)

    // var localStorage = require('localStorage')
      // , myValue = { foo: 'bar', baz: 'quux' }
      // ;

    // localStorage.setItem('myKey', JSON.stringify(myValue));
    // let myValue2 = localStorage.getItem('myKey');
    // console.log(myValue2);

   
    // let localStorage = new LocalStorage('./scratch');
    // localStorage.setItem('myFirstKey', 'myFirstValue');
    // console.log(localStorage.getItem('myFirstKey'));
    // showResult = localStorage.getItem('showResult');
    // searchKey = localStorage.getItem('searchKey');

	  this.state = { showResult: showResult, searchKey: searchKey };
  };
  
  // componentDidMount = () => {
  //   const showResult = localStorage.getItem('showResult');
  //   const searchKey = localStorage.getItem('searchKey');
  // }

  handleSearch = (e) => {
	e.preventDefault();
	let city = this.cityipt.value;
  // localStorage.setItem('showResult', true);
  // localStorage.setItem('searchKey', city);
	this.props.setCity(city);
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

function mapStateToProps(state) {
  if(state.user){
    return {
      username: state.user.email,
	  showResult: state.runtime.showResult,
	  searchKey: state.runtime.searchKey,
    }
  }
  return { showResult: state.runtime.showResult, searchKey: state.runtime.searchKey}
}

function mapDispatch(dispatch,ownProps) {
  return {
	  setCity: (city) => {
	  dispatch(setRuntimeVariable({
      name: 'showResult',
      value: true,
		}));
	  dispatch(setRuntimeVariable({
      name: 'searchKey',
      value: city,
		}));	
	}
  }
}

export default compose(
  withStyles(s),
  connect(mapStateToProps,mapDispatch),
)(Home);
