
import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import dashboardQuery from './dashboardQuery.graphql';
import s from './Dashboard.css';
import Barchar from '../../components/Barchar';
import ECharts from 'react-echarts';
import {Responsive, WidthProvider} from 'react-grid-layout';
const ResponsiveReactGridLayout = WidthProvider(Responsive);

class Dashboard extends React.Component {

  constructor(...args) {
	super(...args);

	const layouts = [
      {i: 'a', x: 0, y: 0, w: 1, h: 2, static: true},
      {i: 'b', x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4},
      {i: 'd', x: 4, y: 0, w: 6, h: 6}
	]
    this.state = {layouts: layouts, height: 6};
  }

  static propTypes = {
  	  loading: PropTypes.bool,	
	  gdp: PropTypes.arrayOf(PropTypes.shape({
		value: PropTypes.arrayOf(PropTypes.string).isRequired,
	  })).isRequired,
  };

    onLayoutChange = (layout) => {
	  let layouts = this.state.layouts;
	  layouts[2].w = layout[0].w;
	  layouts[2].h = layout[0].h;
	  let height = layout[0].h;
	  this.setState({layouts: layouts, height: height})
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
      {i: 'c', x: 4, y: 0, w: this.state.width, h: this.state.height}
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
		 		     			
			<ResponsiveReactGridLayout className="layout" layouts={this.state.layouts} onLayoutChange={this.onLayoutChange}
			  breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
			  cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}>
				<div key={'d'} className={s.echarts} > 
				  <Barchar option={option} style={{height:this.state.height*100}} />
				</div>
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
