
import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import dashboardQuery from './dashboardQuery.graphql';
import s from './Dashboard.css';
import Barchar from '../../components/Barchar';
// import ECharts from 'react-echarts';
import {Responsive, WidthProvider} from 'react-grid-layout';
const ResponsiveReactGridLayout = WidthProvider(Responsive);

class Dashboard extends React.Component {

  constructor(...args) {
	super(...args);

	let layouts = {lg: [
      {i: 'a', x: 0, y: 0, w: 5, h: 2, static: true},
      {i: 'b', x: 1, y: 0, w: 8, h: 2, minW: 2, maxW: 16},
      {i: 'd', x: 4, y: 0, w: 10, h: 3}
	]}
    this.state = {layouts: layouts};
  }

  static propTypes = {
  	  loading: PropTypes.bool,	
	  gdp: PropTypes.object.isRequired,
  };

    onLayoutChange = (layout) => {

	  let layouts = this.state.layouts;
	  layouts.lg.forEach(function(item,index,arr){
	  	layouts.lg[index].w = layout[index].w;
	  	layouts.lg[index].h = layout[index].h;
	  })
	  
	  this.setState({layouts: layouts})
    };

  render() {	

  	if (this.props.loading) {
	  return (<div>Loading</div>)
	}

	if (this.props.error) {
	  console.log(this.props.error)
      return (<div>An unexpected error occurred</div>)
	}	

	const optiond = {
		title: { text: 'Gross Domestic Productd', left: 'center', top:'10px'},
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

	const optionb = {
		title: { text: 'Gross Domestic Productb', left: 'center', top:'10px'},
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

	const optiona = {
		title: { text: 'Gross Domestic Producta', left: 'center', top:'10px'},
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
		 		     			
			<ResponsiveReactGridLayout className="layout" layouts={this.state.layouts} onLayoutChange={this.onLayoutChange}
			  breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
			  cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}
			  >
				<div key={'a'} className={s.echarts} > 
				  <Barchar option={optiona} />
				</div>
				<div key={'b'} className={s.echarts} > 
				  <Barchar option={optionb} />
				</div>
				<div key={'d'} className={s.echarts} > 
				  <Barchar option={optiond} />
				</div>
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
