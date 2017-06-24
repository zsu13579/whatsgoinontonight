
import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import gdpQuery from './gdpQuery.graphql';
import cycleQuery from './cycleQuery.graphql';
import s from './Dashboard.css';
import Barchar from '../../components/Barchar';
// import ECharts from 'react-echarts';
import echarts from 'echarts';
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

    //change time fromat
    // from int to mm:ss
    changeTimeformat = (sec) => {
      let minutes = Math.floor((sec % 3600) / 60); 	
      let seconds = Math.floor(sec % 60);
      if (minutes < 10) {minutes = "0"+minutes;}
      if (seconds < 10) {seconds = "0"+seconds;}
      return (minutes+":"+seconds)
    }

    //change data fromat
    // from [{},{},...] to [[],[],...]
    changeDataFormat = (data) => {
	  let dataout = [];
	  let changeTimeformat = this.changeTimeformat;	  
	  data.forEach(function(value,index,arr){
	  	let timeDiff = changeTimeformat(value.Seconds-2210);
	  	let valueArr = [value.Seconds-2210,value.Place,value.Seconds,value.Name,value.Doping,value.Nationality,value.Time];
	  	dataout.push(valueArr);
	  })
	  return dataout;	  
    };


  render() {	

  	if (this.props.loading) {
	  return (<div>Loading</div>)
	}

	if (this.props.error) {
	  console.log(this.props.error)
      return (<div>An unexpected error occurred</div>)
	}

	const data = [[],[]];
	data[0]=this.changeDataFormat(this.props.cycle[0]);
	data[1]=this.changeDataFormat(this.props.cycle[1]);
	const changeTimeformat = this.changeTimeformat;

	const optiond = {
	    backgroundColor: new echarts.graphic.RadialGradient(0.3, 0.3, 0.8, [{
	        offset: 0,
	        color: '#f7f8fa'
	    }, {
	        offset: 1,
	        color: '#cdd0d5'
	    }]),
	    title: {
	        text: 'Doping in Professional Bicycle Racing'+'\n'+'\n'+'35 Fastest times up Alpe d'+"'"+'Huez',
	        subtext: 'Normalized to 13.8km distance',
	        textStyle: {
	        	fontWeight: 600,
	        	fontSize: 14,	
	        },
	        subtextStyle: {
	        	color: '#000',
	        },
	        textAlign: 'center',
	        right: 'center',
	        top: '3%',
	        shadowColor: '#ccc',
    		shadowBlur: 30,

	    },
	    legend: {
	        right: 10,
	        bottom: '30%',
	        orient: 'vertical',
	        data: ['No doping allegations', 'Riders with doping allegations']
	    },
	    xAxis: {
	        splitLine: {
	            lineStyle: {
	                type: 'dashed'
	            }
	        },
	        inverse: true,
	        max: 210, 
	        name: 'Minutes Behind Fastest Time',
	        nameLocation: 'middle',
	        nameGap: 32,
	        type: 'value',
	        axisLabel: {
	        	formatter: function(val){
	        		return changeTimeformat(val);
	        	},
	        	showMaxLabel: false,
	        },
	        axisLine: {
	        	show: false,
	        },
	        axisTick: {
	        	show: false,
	        },
	        // offset: -50,
	        // position: 'top',
	    },
	    yAxis: {
	        splitLine: {
	            lineStyle: {
	                type: 'dashed'
	            }
	        },
	        name: 'Ranking',
	        nameLocation: 'middle',
	        nameGap: 32,
	        scale: true,
	        inverse: true,
	        max: 37,
	        axisLabel: {
	        	showMaxLabel: false,
	        },
	        axisLine: {
	        	show: false,
	        },
	        axisTick: {
	        	show: false,
	        },
	    },
	    tooltip: {
	        padding: 10,	        
	        backgroundColor: '#222',
	        borderColor: '#777',
	        borderWidth: 1,
	        formatter: function (obj) {
	            var value = obj.value;
	            return '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">'
	                + obj.seriesName
	                + '</div>'
	                + value[3] + '：' + value[5] + '<br>'
	                + 'Year：' + value[7] + ' Time：' + value[6] + '<br>'
	                + '<br>'
	                + value[4];
	        }
	    },
	    series: [{
	        name: 'No doping allegations',
	        data: data[0],
	        type: 'scatter',
	        symbolSize: function (data) {
	            return Math.sqrt(data[2]) / 5;
	        },
	        label: {
	        	normal:{
	        		show: true,
	        		position: 'right',
	        		formatter: function(params){
	        			return params.value[3]
	        		}
	        	}
	        },
	        itemStyle: {
	            normal: {
	                shadowBlur: 10,
	                shadowColor: 'rgba(120, 36, 50, 0.5)',
	                shadowOffsetY: 5,
	                color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
	                    offset: 0,
	                    color: 'rgb(251, 118, 123)'
	                }, {
	                    offset: 1,
	                    color: 'rgb(204, 46, 72)'
	                }])
	            }
	        }
	    }, {
	        name: 'Riders with doping allegations',
	        data: data[1],
	        type: 'scatter',
	        symbolSize: function (data) {
	            return Math.sqrt(data[2]) / 5;
	        },
	        label: {
	        	normal:{
	        		show: true,
	        		position: 'right',
	        		formatter: function(params){
	        			return params.value[3]
	        		},
	        		textStyle: {
	        			// color: '#000',
	        			fontSize: '6',
	        		}
	        	}
	        },
	        itemStyle: {
	            normal: {
	                shadowBlur: 10,
	                shadowColor: 'rgba(25, 100, 150, 0.5)',
	                shadowOffsetY: 5,
	                color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
	                    offset: 0,
	                    color: 'rgb(129, 227, 238)'
	                }, {
	                    offset: 1,
	                    color: 'rgb(25, 183, 207)'
	                }])
	            }
	        }
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

const gdpData = graphql(gdpQuery, {
  props: ({ data: { loading, gdp } }) => ({
    loading, gdp: gdp || {},
  }),
});

const cycleData = graphql(cycleQuery, {
  props: ({ data: { loading, cycle } }) => ({
    loading, cycle: cycle || {},
  }),
});

export default compose(
  withStyles(s),
  gdpData,
  cycleData,
)(Dashboard);
