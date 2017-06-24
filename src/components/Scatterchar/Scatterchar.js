import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { graphql, compose } from 'react-apollo';
import s from './Barchar.css';
import Link from '../Link';
import { connect } from 'react-redux';
import update from 'immutability-helper';
// import BarcharQuery from './BarcharQuery.graphql';
// import ECharts from 'react-echarts';
import echarts from 'echarts';

class Scatterchar extends React.Component {
  
  static defaultProps = {
    notMerge: false,
    notRefreshImmediately: false,
    style: {},
  };  
	
  constructor(...args){
    super(...args);
  }
  
  componentDidMount() {
	this.init();
	
  }
  
  componentDidUpdate() {
    this.setOption();
  }
  
  componentWillUnmount() {
    this.dispose();
  }
  
  getInstance() {
    return this.chart;
  }  
  
  setOption() {
    let {
      option,
      notMerge,
      notRefreshImmediately,
      } = this.props;
    if (option) {
      this.chart.showLoading();
      this.chart.setOption(option, notMerge, notRefreshImmediately);
      this.chart.hideLoading();
	    this.chart.resize();
    }
  }
  
  init() {
    this.chart = echarts.init(this.refs.container);
    this.setOption();
  }

  dispose() {
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
  }

  render() {
    const { style } = this.props;
  	const newStyle = Object.assign({
        width: '100%',
        height: '100%',
      }, style);
		
    return (
        <div ref="container" className={s.root} style={newStyle}></div>
    );
  }
}

function mapStateToProps(state) {
  if(state.user){
    return {
      username: state.user.email,
    }
  }
  return {}
}

export default compose(
  withStyles(s),
)(Scatterchar);
