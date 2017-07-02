import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Roguelike.css';
import { connect } from 'react-redux';
import { setRuntimeVariable } from '../../actions/runtime';

class Btn extends React.Component{

  constructor(...args) {
    super(...args);
  };

  handleSize = function(){
    let row=this.props.row;
    let col=this.props.col;
    this.props.handleSize(row,col);
  };

  render(){
    return <button onClick={this.handleSize.bind(this)}>{this.props.name}</button>
  }
};

class Ge extends React.Component{

  constructor(...args){
    super(...args);
    let stage = this.props.stage;
    this.state = {stage:stage}
  };

  componentWillReceiveProps = function(nextProps){
    this.setState({stage:nextProps.stage})
  };
  handleClick = function(){
    let stage=this.state.stage;
    let id="r"+this.props.row+"c"+this.props.col;
    if(stage=="empty"){
      stage="newborn";
      this.setState({stage:stage});
      this.props.handleChange(id,stage);
    }
  };
  render(){
    let id="r"+this.props.row+"c"+this.props.col;
    return (
      <span id={id} className={s[this.state.stage]} onClick={this.handleClick.bind(this)}></span>
      )
  };
};

class Roguelike extends React.Component{ 
  constructor(...args){
    super(...args);
    let board={};
    let row=50;
    let col=70;
    let gen=0;
    let choice=['empty','newborn','adult'];
      for(let i=0;i<row;i++){
      for(let j=0;j<col;j++){
      let id="r"+i+"c"+j;
      let vr=Math.floor(Math.random()*3);
      board[id]=choice[vr];
      };
    };

    this.state = {row:row,col:col,board:board,isPause:0,isClear:0,gen:gen,speed:300}

  };

  setInterval = function() {
    this.intervals.push(setInterval.apply(null, arguments));
  };

  handleSize = function(row,col){
    let board={};
    for(let i=0;i<row;i++){
      for(let j=0;j<col;j++){
      let id="r"+i+"c"+j;
      board[id]="empty";
      };
    };
    this.setState({row:row,col:col,board:board});  
  };

  handleSpeed = function(e){
    let speed=e.target.id;
    speed=parseInt(speed);
    this.setState({speed:speed});
    this.handlePause();     
    this.timer=this.setInterval(this.generate.bind(this),speed);
  };

  handleChange = function(id,stage){
    let board=this.state.board;
    board[id]=stage;
    this.setState({board:board});
  };
  findLiveNeighbours = function(i,j){
    let col=this.state.col;
    let row=this.state.row;
    let board=this.state.board;
    let id="";
    let dcounter=0;
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
  };
  generate = function(){
    let col=this.state.col;
    let row=this.state.row;
    let board=this.state.board;
    let id="";
    // for newborn
    let counter=0;
    // for  die
    let dcounter=0;
    let dieIds=[];
    let newbornIds=[];
    let gen=this.state.gen;
    
    // set  all  newborn  to  adult
    for(let i=0;i<row;i++){
      for(let j=0;j<col;j++){
        id="r"+i+"c"+j;    
        if(board[id]=="newborn"){
          board[id]="adult";
        }
      };
    };  
    //find  newborn
    newbornIds=[];
    for(let i=0;i<row;i++){
      for(let j=0;j<col;j++){
        counter=0;
        id="r"+i+"c"+j;
        counter=this.findLiveNeighbours(i,j);
        if(board[id]=="empty" && counter==3){
          newbornIds.push(id);        
        }
        };
    };    
    // find die box fewer than 2 neighbours;
    for(let i=0;i<row;i++){
      for(let j=0;j<col;j++){
        id="r"+i+"c"+j;    
        dcounter=this.findLiveNeighbours(i,j);
        if(board[id]=="adult" && dcounter<2){
          dieIds.push(id);
        }
      };
    }
    // find die box more than 3 neighbours;
    for(let i=0;i<row;i++){
      for(let j=0;j<col;j++){
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
  };
  componentDidMount = function(){
    this.intervals = [];
    this.handleStart();
  };
  componentWillUnmount = function(){
    if(this.intervals){
      this.intervals.forEach(clearInterval);
    }
  };

  handleClear = function(){
    let row=this.state.row;
    let col=this.state.col;
    let board={};
    for(let i=0;i<row;i++){
      for(let j=0;j<col;j++){
      let id="r"+i+"c"+j;
      board[id]="empty";
      };
    };
    this.intervals.forEach(clearInterval);
    // this.componentWillUnmount();
    this.setState({board:board,isClear:1,gen:0});
  };

  handlePause = function(){    
    this.intervals.forEach(clearInterval);
    // this.componentWillUnmount();
  };

  handleStart = function(){
    let isPause=this.state.isPause;
    let isClear=this.state.isClear;
    let speed=this.state.speed;
    
    isPause=0;
    isClear=0;
    // this.setState({isPause:0,isClear:0});
    // if(isPause==0 && isClear==0)
    this.timer=this.setInterval(this.generate.bind(this),speed);
  };
  
  render(){
    let geList=[];
    let col=this.state.col;
    let row=this.state.row;
    let board=this.state.board;
    let id="";
    let stage="";
    for(let i=0;i<row;i++){
      let rowList=[];
      for(let j=0;j<col;j++){     
      id="r"+i+"c"+j;
      stage=board[id];    
      rowList.push(<Ge row={i} col={j} stage={stage} handleChange={this.handleChange.bind(this)} />);
      };
      geList.push(<tr><td>{rowList}</td></tr>);
    };
    return (
      <div id={s.board}>
        <div className={s.topBar}>
        <button onClick={this.handleStart.bind(this)}>Start</button>
        <button onClick={this.handlePause.bind(this)}>Pause</button>
        <button onClick={this.handleClear.bind(this)}>Clear</button>
        <div className="gen">Generation:{this.state.gen}</div>
        </div>
        <table> 
          <tbody>
            {geList}
          </tbody>
        </table>
        <Btn handleSize={this.handleSize.bind(this)} name="Size:50x30" row="30" col="50" />
        <Btn handleSize={this.handleSize.bind(this)} name="Size:70x50" row="50" col="70" />
        <Btn handleSize={this.handleSize.bind(this)} name="Size:100x80" row="80" col="100" />
        <button onClick={this.handleSpeed.bind(this)} id="1500">Slow</button>
        <button onClick={this.handleSpeed.bind(this)} id="800">Medium</button>
        <button onClick={this.handleSpeed.bind(this)} id="300">Fast</button>
      </div>
    )
  }
};


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
