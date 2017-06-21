

import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import dashboardQuery from './dashboardQuery.graphql';
import s from './Dashboard.css';
import Barchar from '../../components/Barchar';

class Dashboard extends React.Component {

  constructor(...args) {
	super(...args);
    // this.state = {wins: this.props.data.wins, loading:this.props.data.loading};
  }		
  
  static propTypes = {
  	  loading: PropTypes.bool,	
	  gdp: PropTypes.arrayOf(PropTypes.shape({
		value: PropTypes.arrayOf(PropTypes.string).isRequired,
	  })).isRequired,
  };
    
  render() {

  	if (this.props.loading) {
	  return (<div>Loading</div>)
	}

	if (this.props.error) {
	  console.log(this.props.error)
      return (<div>An unexpected error occurred</div>)
	}

    return (
	  <div className={s.root}>
        <div className={s.container}>
          <h1>Gross Domestic Product</h1>
          
		  {this.props.gdp.map(item => (
			<Barchar className={s.barchar} 
				id = {item.id}
			/>		
          ))}
		  
        </div>
      </div>
    );
  }
}

const withData = graphql(dashboardQuery, {
  props: ({ data: { loading, gdp } }) => ({
    loading, gdp: gdp || [],
  }),
});

export default compose(
  withStyles(s),
  withData,
)(Dashboard);
