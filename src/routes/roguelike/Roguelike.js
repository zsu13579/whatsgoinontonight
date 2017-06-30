import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Roguelike.css';
import { connect } from 'react-redux';
import { setRuntimeVariable } from '../../actions/runtime';

var Btn=React.createClass({
  handleSize:function(){
    var row=this.props.row;
    var col=this.props.col;
    this.props.handleSize(row,col);
  },
  render: function(){
    return <button onClick={this.handleSize}>{this.props.name}</button>
  }
});

var Ge=React.createClass({
  getInitialState: function(){
    var stage=this.props.stage;
    return {stage:stage}
  },
  componentWillReceiveProps: function(nextProps){
    this.setState({stage:nextProps.stage})
  },
  handleClick:function(){
    var stage=this.state.stage;
     var id="r"+this.props.row+"c"+this.props.col;
    if(stage=="empty"){
      stage="newborn";
      this.setState({stage:stage});
      this.props.handleChange(id,stage);
    }
  },
  render: function(){
    var id="r"+this.props.row+"c"+this.props.col;
    return (
      <span id={id} className={this.state.stage} onClick={this.handleClick}></span>
      )
  }
});

var SetIntervalMixin = {
  componentWillMount: function() {
    this.intervals = [];
  },
  setInterval: function() {
    this.intervals.push(setInterval.apply(null, arguments));
  },
  componentWillUnmount: function() {
    this.intervals.forEach(clearInterval);
  }
};

var Roguelike=React.createClass({ 
  mixins: [SetIntervalMixin], 
  getInitialState:  function(){
    var board={};
    var row=50;
    var col=70;
    var gen=0;
    var choice=['empty','newborn','adult'];
      for(var i=0;i<row;i++){
      for(var j=0;j<col;j++){
      var id="r"+i+"c"+j;
      var vr=Math.floor(Math.random()*3);
      board[id]=choice[vr];
      };
    };
   // board.r2c2="adult"; 
   // board.r2c1="adult";
   // board.r2c3="adult";
    return {row:row,col:col,board:board,isPause:0,isClear:0,gen:gen,speed:300}
  },
  handleSize:function(row,col){
    var board={};
    for(var i=0;i<row;i++){
      for(var j=0;j<col;j++){
      var id="r"+i+"c"+j;
      board[id]="empty";
      };
    };
  this.setState({row:row,col:col,board:board});  
  },
  handleSpeed:function(e){
  var speed=e.target.id;
  speed=parseInt(speed);
  this.setState({speed:speed});
  this.handlePause();     this.timer=this.setInterval(this.generate,speed);
  },
  handleChange:function(id,stage){
    var board=this.state.board;
    board[id]=stage;
    this.setState({board:board});
  },
  findLiveNeighbours:function(i,j){
    var col=this.state.col;
    var row=this.state.row;
    var board=this.state.board;
    var id="";
    var dcounter=0;
        if(board["r"+(i-1)+"c"+(j-1)]=="adult"){
          dcounter++
        };
        if(board["r"+(i-1)+"c"+j]=="adult"){
          dcounter++
        };
        if(board["r"+(i-1)+"c"+(j+1)]=="adult"){
          dcounter++
        };
        if(board["r"+i+"c"+(j-1)]=="adult"){
          dcounter++
        };
        if(board["r"+i+"c"+(j+1)]=="adult"){
          dcounter++
        };
        if(board["r"+(i+1)+"c"+(j-1)]=="adult"){
          dcounter++
        };
        if(board["r"+(i+1)+"c"+j]=="adult"){
          dcounter++
        };
        if(board["r"+(i+1)+"c"+(j+1)]=="adult"){
          dcounter++
        };
    return dcounter;
  },
  generate:function(){
    var col=this.state.col;
    var row=this.state.row;
    var board=this.state.board;
    var id="";
    // for newborn
    var counter=0;
    // for  die
    var dcounter=0;
    var dieIds=[];
    var newbornIds=[];
    var gen=this.state.gen;
    
    // set  all  newborn  to  adult
    for(var i=0;i<row;i++){
      for(var j=0;j<col;j++){
        id="r"+i+"c"+j;    
        if(board[id]=="newborn"){
          board[id]="adult";
        }
      };
    };  
    //find  newborn
    newbornIds=[];
    for(var i=0;i<row;i++){
      for(var j=0;j<col;j++){
        counter=0;
        id="r"+i+"c"+j;
        counter=this.findLiveNeighbours(i,j);
        if(board[id]=="empty" && counter==3){
          newbornIds.push(id);        
        }
        };
    };    
    // find die box fewer than 2 neighbours;
    for(var i=0;i<row;i++){
      for(var j=0;j<col;j++){
        id="r"+i+"c"+j;    
        dcounter=this.findLiveNeighbours(i,j);
        if(board[id]=="adult" && dcounter<2){
          dieIds.push(id);
        }
      };
    }
    // find die box more than 3 neighbours;
    for(var i=0;i<row;i++){
      for(var j=0;j<col;j++){
        id="r"+i+"c"+j;    
        dcounter=this.findLiveNeighbours(i,j);
        if(board[id]=="adult" && dcounter>3){
          dieIds.push(id);
        }
      };
    };
        //set  dieIds  to  empty
        if(dieIds!=[]){
          dieIds.forEach(function(value){
            board[value]="empty";
          })
        }
        //set newborn id  to  newborn
        if(newbornIds!=[]){
      newbornIds.forEach(function(value){
        board[value]="newborn";
         })
        }
    gen++;
  this.setState({row:row,col:col,board:board,gen:gen});
  },
  componentWillMount:function(){
    this.handleStart();
  },
  handleClear:function(){
    var row=this.state.row;
    var col=this.state.col;
      for(var i=0;i<row;i++){
      for(var j=0;j<col;j++){
      var id="r"+i+"c"+j;
      board[id]="empty";
      };
    };
  // this.intervals.forEach(clearInterval);
  this.componentWillUnmount();
  this.setState({board:board,isClear:1,gen:0});
  },
  handlePause:function(){    
  // this.intervals.forEach(clearInterval);
  this.componentWillUnmount();
  },
  handleStart:function(){
    var isPause=this.state.isPause;
    var isClear=this.state.isClear;
    var speed=this.state.speed;
    
    isPause=0;
    isClear=0;
    // this.setState({isPause:0,isClear:0});
    // if(isPause==0 && isClear==0)
    this.timer=this.setInterval(this.generate,speed);
},
  
  render: function(){
    var geList=[];
    var col=this.state.col;
    var row=this.state.row;
    var board=this.state.board;
    var id="";
    var stage="";
    for(var i=0;i<row;i++){
      var rowList=[];
      for(var j=0;j<col;j++){     
      id="r"+i+"c"+j;
      stage=board[id];    
      rowList.push(<Ge row={i} col={j} stage={stage} handleChange={this.handleChange} />);
      };
      geList.push(<tr>{rowList}</tr>);
    };
    return (
      <div id="board">
        <div className="topBar">
        <button onClick={this.handleStart}>Start</button>
          <button onClick={this.handlePause}>Pause</button>
        <button onClick={this.handleClear}>Clear</button>
        <div className="gen">Generation:{this.state.gen}</div>
        </div> 
        {geList}
        <Btn handleSize={this.handleSize} name="Size:50x30" row="30" col="50" />
        <Btn handleSize={this.handleSize} name="Size:70x50" row="50" col="70" />
         <Btn handleSize={this.handleSize} name="Size:100x80" row="80" col="100" />
        <button onClick={this.handleSpeed} id="1500">Slow</button>
        <button onClick={this.handleSpeed} id="800">Medium</button>
        <button onClick={this.handleSpeed} id="300">Fast</button>
      </div>
    )
  }
});


// class Roguelike extends React.Component {

//   constructor(...args) {
//     super(...args);
//   };
  
//   handleSearch = (e) => {
// 	e.preventDefault();
// 	let city = this.cityipt.value;
//   this.props.setCity(city);
// 	this.setState({ searchKey: city, showResult: true });
//   };

//   render() {
//     return (
//       <div className={s.root}>
//         <div className={s.container}>
//           <h1>Where do you want to go tonight</h1>
//     		  <Form inline onSubmit={this.handleSearch}>
//       			<FormGroup
//       			  controlId="city"
//       			>
//       			  <FormControl
//       				type="text"
//       				placeholder="Enter city"
//       				inputRef= { ref => { this.cityipt = ref; }}
//       			  />
//       			</FormGroup>
//       			<Button bsStyle="primary" bsSize="large" onClick={this.handleSearch}>
//       				Search
//       			</Button>
//     		  </Form>
//     		  { this.state.showResult ?
//     		  <SearchResult
//     			searchKey = {this.state.searchKey}
//     		  /> : "" }
//         </div>
//       </div>
//     );
//   }
// }

function mapStateToProps(state) {
  if(state.user){
    return {
      username: state.user.email,
    }
  }
  return {}
}

function mapDispatch(dispatch,ownProps) {
  return {
	  setCity: (city) => {
	  dispatch(setRuntimeVariable({
      name: 'Roguelike',
      value: 'Playing',
		}));
	}
  }
}

export default compose(
  withStyles(s),
  connect(mapStateToProps,mapDispatch),
)(Roguelike);
