
import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import dashboardQuery from './dashboardQuery.graphql';
import s from './Dashboard.css';
// import Barchar from '../../components/Barchar';
import ECharts from 'react-echarts';
import ReactGridLayout  from 'react-grid-layout';
import {Responsive, WidthProvider} from 'react-grid-layout';
const ResponsiveReactGridLayout = WidthProvider(Responsive);

// const ResponsiveReactGridLayout = WidthProvider(Responsive);
const ReactGridLayout2 = WidthProvider(ReactGridLayout);

class Dashboard extends React.Component {

  constructor(...args) {
	super(...args);
	const option = {
		title: { text: 'Gross Domestic Product', left: 'center', top:'10px'},
		tooltip: {},
		xAxis: {
			data: this.props.gdp.xData
		},
		yAxis: {},
		series: [{
			name: '销量',
			type: 'bar',
			data: this.props.gdp.sData
		}]
	};
    this.state = {option: option};
  }
  
  static propTypes = {
  	  loading: PropTypes.bool,	
	  gdp: PropTypes.arrayOf(PropTypes.shape({
		value: PropTypes.arrayOf(PropTypes.string).isRequired,
	  })).isRequired,
  };
  
  
  
  onLayoutChange = () => {
	  
	  const option = {
		title: { text: 'Gross Domestic Product', left: 'center', top:'10px'},
		tooltip: {},
		xAxis: {
			data: this.props.gdp.xData
		},
		yAxis: {},
		series: [{
			name: '销量',
			type: 'bar',
			data: this.props.gdp.sData
		}]
		};
      this.setState({option: option});
    };
    
  render() {	

  	if (this.props.loading) {
	  return (<div>Loading</div>)
	}

	if (this.props.error) {
	  console.log(this.props.error)
      return (<div>An unexpected error occurred</div>)
	}	
	
	const layouts = [
      {i: 'a', x: 0, y: 0, w: 1, h: 2, static: true},
      {i: 'b', x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4},
      {i: 'c', x: 4, y: 0, w: 6, h: 6}
	]
		
	const option = {
		title: { text: 'Gross Domestic Product', left: 'center', top:'10px'},
		tooltip: {},
		xAxis: {
			data: this.props.gdp.xData
		},
		yAxis: {},
		series: [{
			name: '销量',
			type: 'bar',
			data: this.props.gdp.sData
		}]
		};
		
    return (
	  <div className={s.root}>
        <div className={s.container}>
		       			
			 <ResponsiveReactGridLayout className="layout" layouts={layouts} onLayoutChange={this.onLayoutChange}
			  breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
			  cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}>
			  <div key={'c'}>  
				<ECharts option={option}/>
			  </div>		
			  <div key={'a'} className={s.test1} ><h1>a</h1></div>
			  <div key={'b'}>b</div>
		    </ResponsiveReactGridLayout>
		 
        </div>
      </div>
    );
  }
}

const withData = graphql(dashboardQuery, {
  props: ({ data: { loading, gdp } }) => ({
    loading, gdp: gdp || {},
  }),
});

export default compose(
  withStyles(s),
  withData,
)(Dashboard);
