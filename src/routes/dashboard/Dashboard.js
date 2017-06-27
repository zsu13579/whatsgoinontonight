
import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import gdpQuery from './gdpQuery.graphql';
import cycleQuery from './cycleQuery.graphql';
import meteoriteStrikeQuery from './meteoriteStrikeQuery.graphql';
import temperatureQuery from './temperatureQuery.graphql';
import countryQuery from './countryQuery.graphql';
import s from './Dashboard.css';
import Barchar from '../../components/Barchar';
// import ECharts from 'react-echarts';
import echarts from 'echarts';
import world from 'echarts/map/js/world';
import {Responsive, WidthProvider} from 'react-grid-layout';
const ResponsiveReactGridLayout = WidthProvider(Responsive);

class Dashboard extends React.Component {

  constructor(...args) {
	super(...args);

	let layouts = {lg: [
      {i: 'a', x: 0, y: 0, w: 5, h: 2, static: true},
      {i: 'b', x: 1, y: 0, w: 10, h: 4, minW: 2, maxW: 16},
      {i: 'c', x: 4, y: 0, w: 10, h: 3},
      {i: 'd', x: 4, y: 0, w: 10, h: 3},
      {i: 'e', x: 4, y: 0, w: 10, h: 4},
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

	// Show National Contiguity with a Force Directed Graph
	const getImg = function(countryCode){
		return 'image://flagPng/'+countryCode+'.png';
	};
	
	// node: {country: 'China', code: 'cn'} to node: {country: 'China', code: 'cn', symbol: 'image://flagPng/cn.png'}
	const convertNode = function(node){
		let result = {};
		let tooltip = {};
		tooltip.formatter = node.country;
		result.country=node.country;
		result.code=node.code;
		result.symbol=getImg(node.code);
		result.tooltip=tooltip;
		return result;
	};

	let graph = {};
	graph.nodes = this.props.country.nodes.map(node => convertNode(node));
	graph.links = this.props.country.links;
    // graph.nodes.forEach(function (node) {
        // node.itemStyle = null;
        // node.symbol = getImg(node);
        // // node.value = node.symbolSize;
        // // // node.category = node.attributes.modularity_class;
        // // // Use random x, y
        // // node.x = node.y = null;
        // // node.draggable = true;
    // });
    const optione = {
        title: {
            text: 'Les Miserables',
            subtext: 'Default layout',
            top: 'bottom',
            left: 'right'
        },
        tooltip: {},
        // legend: [{
        //     // selectedMode: 'single',
        //     data: categories.map(function (a) {
        //         return a.name;
        //     })
        // }],
        animation: false,
        series : [
            {
                name: 'Les Miserables',
                type: 'graph',
                layout: 'force',
                data: graph.nodes,
                links: graph.links,
                // categories: categories,
                roam: false,
                // symbol: convertNode(),
                label: {
                    normal: {
                        position: 'right'
                    }
                },
            }
        ]
    };

	
	// bycycle scatter map
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

	//heatmap of temp
	const getYear = function(min,max){
		let result = [];
		for(let i=min;i<=max;i++){
			result.push(i);
		}
		return result;
	}
	const convertTemperature = function(item){
		return [item.year-1753, 12 - item.month, item.variance, item.realTemp];
	}
	const year = getYear(1753,2015);
	// const month = ['12','11','10','9','8','7','6','5','4','3','2','1'];
	const month = ['December','November','October','September','August',
	'July','June','May','April','March','February','January'];

	const datac = this.props.temperature.map(temp => convertTemperature(temp));

	const optionc = {
		title : {
			text: 'Monthly Global Land-Surface Temperature'+'\n'+'1753 - 2015',
			subtext: 'Temperatures are in Celsius and reported as anomalies relative to the Jan 1951-Dec 1980 average.' + '\n' + 
			'Estimated Jan 1951-Dec 1980 absolute temperature ℃: 8.66 +/- 0.07',
			left: 'center',
			top: 5,
			itemGap: 2,
			
		},
	    tooltip: {
	        position: 'top'
	    },
	    animation: false,
	    xAxis: {
	        type: 'category',
	        data: year,
	        splitArea: {
	            show: true
	        }
	    },
	    yAxis: {
	        type: 'category',
	        data: month,
			axisTick: {
				show: false,
			},
			axisLine: {
				show: false,
			},
	        interval: 0,
	        splitArea: {
	            show: true
	        }
	    },
		grid: {
			top: '18%',
		},
	    visualMap: {
			type: 'piecewise',
	        min: 0,
	        max: 12,
	        dimension: 3,
	        calculable: true,
	        orient: 'horizontal',
	        left: 'center',
			splitNumber: 5,
			color: ['#d94e5d','#eac736','#50a3ba'],
			// pieces: [
				// {min: 1500}, // 不指定 max，表示 max 为无限大（Infinity）。
				// {min: 900, max: 1500},
				// {min: 310, max: 1000},
				// {min: 200, max: 300},
				// {min: 10, max: 200, label: '10 到 200（自定义label）'},
				// {value: 123, label: '123（自定义特殊颜色）', color: 'grey'}, // 表示 value 等于 123 的情况。
				// {max: 5}     // 不指定 min，表示 min 为无限大（-Infinity）。
			// ],
	    },
	    series: [{
	        name: 'temperature',
	        type: 'heatmap',
	        data: datac,
	        label: {
	            normal: {
	                show: false
	            }
	        },
	        itemStyle: {
	            emphasis: {
	                shadowBlur: 10,
	                shadowColor: 'rgba(0, 0, 0, 0.5)'
	            }
	        }
	    }]
	};

	// world map option
	// convert data to [name:name,value:[coordinates1,coordinates2,size]]
	const convertData = function (data) {
	    let res = [];
	    for (let i = 0; i < data.length; i++) {
	    	let mass = data[i].mass;
	    	let value = data[i].coordinates.concat(mass)
	    				.concat(data[i].fall)
	    				.concat(data[i].nameType)
	    				.concat(data[i].recclass)
	    				.concat(data[i].reclat)
	    				.concat(data[i].year)
	    				;
            res.push({
                name: data[i].name,
                value: value,
                fall: data[i].fall,
                mass: data[i].mass,
                nameType: data[i].nameType,
                recclass: data[i].recclass,
                reclat: data[i].reclat,
                year: data[i].year
            });
	    }
	    return res;
	};

	const optionb = {
	    backgroundColor: '#404a59',
	    title: {
	        text: 'Meteorite-Strike',
	        x:'center',
	        textStyle: {
	            color: '#fff'
	        }
	    },
	    tooltip: {
	        trigger: 'item',
	        formatter: function (params) {
	            return 'fall' + ' : ' + params.value[3] + '<br>'
	            + 'mass' + ' : ' + params.value[2] + '<br>'
	            + 'name' + ' : ' + params.name + '<br>'
	            + 'nameType' + ' : ' + params.value[4] + '<br>'
	            + 'recclass' + ' : ' + params.value[5] + '<br>'
	            + 'reclat' + ' : ' + params.value[6] + '<br>'
	            + 'year' + ' : ' + params.value[7] + '<br>'
	            ;
	        }
	    },
	    legend: {
	        orient: 'vertical',
	        y: 'bottom',
	        x:'right',
	        data:['meteoriteStrike'],
	        textStyle: {
	            color: '#fff'
	        }
	    },
	    visualMap: {
	        min: 0,
	        max: 2000000,
	        dimension: 2,
	        calculable: true,
	        inRange: {
	            color: ['#50a3ba', '#eac736', '#d94e5d']
	        },
	        textStyle: {
	            color: '#fff'
	        }
	    },
	    geo: {
	        map: 'world',
	        label: {
	            emphasis: {
	                show: false
	            }
	        },
	        itemStyle: {
	            normal: {
	                areaColor: '#323c48',
	                borderColor: '#111'
	            },
	            emphasis: {
	                areaColor: '#2a333d'
	            }
	        }
	    },
	    series: [
	        {
	            name: 'meteoriteStrike',
	            type: 'scatter',
	            coordinateSystem: 'geo',
	            data: convertData(this.props.meteoriteStrike),
	            symbolSize: function(data){
	            	return Math.sqrt(data[2])/100
	            },
	            label: {
	                normal: {
	                    show: false
	                },
	                emphasis: {
	                    show: false
	                }
	            },
	            itemStyle: {
	                emphasis: {
	                    borderColor: '#fff',
	                    borderWidth: 1
	                }
	            }
	        }
	    ]
	}

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
				<div key={'c'} className={s.echarts} > 
				  <Barchar option={optionc} />
				</div>
				<div key={'d'} className={s.echarts} > 
				  <Barchar option={optiond} />
				</div>
				<div key={'e'} className={s.echarts} > 
				  <Barchar option={optione} />
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
    loading, cycle: cycle || [],
  }),
});

const meteoriteStrikeData = graphql(meteoriteStrikeQuery, {
  props: ({ data: { loading, meteoriteStrike } }) => ({
    loading, meteoriteStrike: meteoriteStrike || [],
  }),
});

const temperatureData = graphql(temperatureQuery, {
  props: ({ data: { loading, temperature } }) => ({
    loading, temperature: temperature || [],
  }),
});

const countryData = graphql(countryQuery, {
  props: ({ data: { loading, country } }) => ({
    loading, country: country || [],
  }),
});

export default compose(
  withStyles(s),
  gdpData,
  cycleData,
  meteoriteStrikeData,
  temperatureData,
  countryData,
)(Dashboard);
