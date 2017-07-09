import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Roguelike.css';
import { connect } from 'react-redux';
import { setRuntimeVariable } from '../../actions/runtime';
import canvas from 'canvas';
// import {Layer, Rect, Stage, Group} from 'react-konva';

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

  // componentWillReceiveProps = function(nextProps){
  //   this.setState({stage:nextProps.stage})
  // };
  handleClick = function(){
    // let stage=this.state.stage;
    // let id="r"+this.props.row+"c"+this.props.col;
    // if(stage=="empty"){
    //   stage="newborn";
    //   this.setState({stage:stage});
    //   this.props.handleChange(id,stage);
    // }
  };
  render(){
    let id="r"+this.props.row+"c"+this.props.col;
    return (
      <span id={id} className={s[this.state.stage]} onClick={this.handleClick.bind(this)}></span>
      )
  };
};

class Leaf extends React.Component{

  constructor(...args){
    super(...args);
    let { x, y, width, height, leftChild, rightChild, room, halls } = this.props;
    this.state = {x:x, y:y, width:width, height: height}
  };

  // componentWillReceiveProps = function(nextProps){
  //   this.setState({stage:nextProps.stage})
  // };

  split = function(){
    // let stage=this.state.stage;
    // let id="r"+this.props.row+"c"+this.props.col;
    // if(stage=="empty"){
    //   stage="newborn";
    //   this.setState({stage:stage});
    //   this.props.handleChange(id,stage);
    // }
  };
}
  
class RogueMap extends React.Component{

  constructor(...args){
    super(...args);
    let { x, y, width, height } = this.props;
	  let Leaf = {
		createNew: function(x, y, width, height){
			let leaf = {};
			leaf.x = x;
			leaf.y = y;
			leaf.width = width;
			leaf.height = height;
			leaf.split = function(){
				console.log("Leaf..Leaf..")
			}
			return leaf;
		}		
	};
	let leaf1 = Leaf.createNew(x, y, width, height);
	leaf1.split();
    this.state = {x:x, y:y, width:width, height: height}
  };

  // componentWillReceiveProps = function(nextProps){
  //   this.setState({stage:nextProps.stage})
  // };

  split = function(){
    // let stage=this.state.stage;
    // let id="r"+this.props.row+"c"+this.props.col;
    // if(stage=="empty"){
    //   stage="newborn";
    //   this.setState({stage:stage});
    //   this.props.handleChange(id,stage);
    // }
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
    let row=60;
    let col=120;
    let gen=0;
    let rects=[];
    let choice=['empty','whiteGe','adult'];
    for(let i=0;i<row;i++){
      for(let j=0;j<col;j++){
        let id="r"+i+"c"+j;
        let vr=Math.floor(Math.random()*3);
        board[id]=choice[0];
      };
    };

    // 1 represent 10px;
    let Leaf = {
      createNew: function(x=1, y=5, width=60, height=60){
        let leaf = {};
        const MIN_LEAF_SIZE = 6 ;
        leaf.x = x;
        leaf.y = y;
        leaf.width = width;
        leaf.height = height;
        leaf.leftChild = 0;
        leaf.rightChild = 0;
        leaf.room = 0;
        leaf.halls = [];
        leaf.split = function(){
          // begin to split the leaf into two children
          if (leaf.leftChild != 0 || leaf.rightChild != 0 ){
            return false; // we're already split! Abort!
          }
          // determine direction of split
          // if the width is >25% larger than height, we split vertically
          // if the height is >25% larger than the width, we split horizontally
          // otherwise we split randomly
          let splitH = Math.random() > 0.5 ? true : false;
          if (leaf.width > leaf.height && leaf.width / leaf.height >= 1.25){
            splitH = false;
          }else if (leaf.height > leaf.width && leaf.height / leaf.width >= 1.25){
            splitH = true;
          }
          let max = (splitH ? leaf.height: leaf.width) - MIN_LEAF_SIZE ; // determine the maximum height or width
          if (max <= MIN_LEAF_SIZE)
          {  
            return false; // the area is too small to split any more...
          };
          let split = Math.floor(Math.random() * (max - MIN_LEAF_SIZE)) + MIN_LEAF_SIZE;
          // create our left and right children based on the direction of the split
          if (splitH)
          {
            leaf.leftChild = Leaf.createNew(x, y, leaf.width, split);
            leaf.rightChild = Leaf.createNew(x, y + split, leaf.width, leaf.height - split);
          }
          else
          {
            leaf.leftChild = Leaf.createNew(x, y, split, leaf.height);
            leaf.rightChild = Leaf.createNew(x + split, y, leaf.width - split, leaf.height);
          }
          return true; // split successful!
        };
        leaf.createHall = function(lRoom, rRoom){
          // connect two rooms together with hallways
          let halls = [];
          let point1 = [];
          let point2 = [];
          point1[0] = Math.floor(Math.random() * (lRoom.width -2)) + 1;
          point1[1] = Math.floor(Math.random() * (lRoom.height -2)) + 1;
          point2[0] = Math.floor(Math.random() * (rRoom.width -2)) + 1;
          point2[1] = Math.floor(Math.random() * (rRoom.height -2)) + 1;
          let w = point1[0] - point2[0];
          let h = point1[1] - point2[1];
          let hall1 = {};
          let hall2 = {};
          if(w < 0){
            if( h < 0){
              //   2
              // 1
              if(Math.random() < 0.5){
                hall1.x = point1[0];
                hall1.y = point1[1];
                hall1.height = Math.abs(h);
                hall1.width = 1;
                hall2.x = point1[0];
                hall2.y = point2[1];
                hall2.height = 1;
                hall2.width = Math.abs(w);
                halls.push(hall1);
                halls.push(hall2);
              }else{
                hall1.x = point1[0];
                hall1.y = point1[1];
                hall1.height = 1;
                hall1.width = Math.abs(w);
                hall2.x = point2[0];
                hall2.y = point1[1];
                hall2.height = Math.abs(h);
                hall2.width = 1;
                halls.push(hall1);
                halls.push(hall2);
              }
            }else if(h > 0){
              // 1
              //    2
              if(Math.random() < 0.5){
                hall1.x = point1[0];
                hall1.y = point2[1];
                hall1.height = Math.abs(h);
                hall1.width = 1;
                hall2.x = point1[0];
                hall2.y = point2[1];
                hall2.height = 1;
                hall2.width = Math.abs(w);
                halls.push(hall1);
                halls.push(hall2);
              }else{
                hall1.x = point1[0];
                hall1.y = point1[1];
                hall1.height = 1;
                hall1.width = Math.abs(w);
                hall2.x = point2[0];
                hall2.y = point2[1];
                hall2.height = Math.abs(h);
                hall2.width = 1;
                halls.push(hall1);
                halls.push(hall2);
              }
            }else{ // h == 0
              hall1.x = point1[0];
              hall1.y = point1[1];
              hall1.height = 1;
              hall1.width = Math.abs(w);
              halls.push(hall1);
            }
          }else if( w > 0){
            if( h < 0){
              // 2
              //    1
              if(Math.random() < 0.5){
                hall1.x = point2[0];
                hall1.y = point1[1];
                hall1.height = Math.abs(h);
                hall1.width = 1;
                hall2.x = point2[0];
                hall2.y = point1[1];
                hall2.height = 1;
                hall2.width = Math.abs(w);
                halls.push(hall1);
                halls.push(hall2);
              }else{
                hall1.x = point2[0];
                hall1.y = point2[1];
                hall1.height = 1;
                hall1.width = Math.abs(w);
                hall2.x = point1[0];
                hall2.y = point1[1];
                hall2.height = Math.abs(h);
                hall2.width = 1;
                halls.push(hall1);
                halls.push(hall2);
              }
            }else if(h > 0){
              //   1
              // 2
              if(Math.random() < 0.5){
                hall1.x = point2[0];
                hall1.y = point2[1];
                hall1.height = Math.abs(h);
                hall1.width = 1;
                hall2.x = point2[0];
                hall2.y = point1[1];
                hall2.height = 1;
                hall2.width = Math.abs(w);
                halls.push(hall1);
                halls.push(hall2);
              }else{
                hall1.x = point2[0];
                hall1.y = point2[1];
                hall1.height = 1;
                hall1.width = Math.abs(w);
                hall2.x = point1[0];
                hall2.y = point2[1];
                hall2.height = Math.abs(h);
                hall2.width = 1;
                halls.push(hall1);
                halls.push(hall2);
              }
            }else{ // h == 0
              // 2 1
              hall1.x = point2[0];
              hall1.y = point2[1];
              hall1.height = 1;
              hall1.width = Math.abs(w);
              halls.push(hall1);
            }
          }else{ // w == 0
            if(h > 0){
              // 1
              // 2
              hall1.x = point2[0];
              hall1.y = point2[1];
              hall1.height = Math.abs(h);
              hall1.width = 1;
              halls.push(hall1);
            }else{
              // 2
              // 1
              hall1.x = point1[0];
              hall1.y = point1[1];
              hall1.height = Math.abs(h);
              hall1.width = 1;
              halls.push(hall1);
            }
          }
          leaf.halls = halls;
        }
        
        leaf.createRooms = function(){
          // this function generates all the rooms and hallways for this Leaf and all of its children
          if(leaf.leftChild != 0 || leaf.rightChild !=0){
            // this leaf have been split, so go into the children
            if(leaf.leftChild != 0){
              leaf.leftChild.createRooms();
            }
            if(leaf.rightChild != 0){
              leaf.rightChild.createRooms();
            }
            if(leaf.rightChild != 0 && leaf.leftChild != 0){
              let rRoom = leaf.rightChild.getRoom();
              let lRoom = leaf.leftChild.getRoom();
              leaf.createHall(rRoom,lRoom);
            }
          }else{
            // this leaf is already to make room
            let roomSize = [0,0];
            let roomPos = [0,0];
            // the room can be 4x4 tiles to the size of the leaf - 2;
            roomSize[0] = Math.floor(Math.random() * (leaf.width-2-4)) + 4;
            roomSize[1] = Math.floor(Math.random() * (leaf.height-2-4)) + 4;
            roomPos[0] = Math.floor(Math.random() * (leaf.width - roomSize[0] - 1)) + 1;
            roomPos[1] = Math.floor(Math.random() * (leaf.height - roomSize[1] - 1)) + 1;
            leaf.room = {
              x: roomPos[0],
              y: roomPos[1],
              width: roomSize[0],
              height: roomSize[1]
            }
          }
        }
        leaf.getRoom = function(){
          if(leaf.room != 0){
            return leaf.room
          }else{ 
            let lRoom = 0;
            let rRoom = 0;
            if(leaf.leftChild != 0 ){
              lRoom = leaf.leftChild.getRoom();
            }
            if(leaf.rightChild != 0 ){
              rRoom = leaf.rightChild.getRoom();
            }
            if(lRoom == 0 && rRoom == 0){
              return 0
            }else if(lRoom == 0){
              return rRoom;
            }else if(rRoom == 0){
              return lRoom;
            }else if(Math.random() > 0.5){
              return lRoom;
            }else{
              return rRoom;
            }

          }

        };
               
        return leaf;
      },
    };
    // test
    let leaf1 = Leaf.createNew();
    leaf1.split();
    
    // create rooms and halls, save in leafList
    let MAX_LEAF_SIZE = 20; 
    let leafList = [];
    let rootLeaf = Leaf.createNew();
    leafList.push(rootLeaf);
    let did_split = true;
    while(did_split){
      did_split = false;
      leafList.forEach(function(l,index,arr){
        if(l.leftChild == 0 && l.rightChild == 0){ // if this Leaf is not already
           // if this Leaf is too big, or 75% chance...
           if (l.width > MAX_LEAF_SIZE || l.height > MAX_LEAF_SIZE )
           {
             if (l.split()) // split the Leaf!
             {
               // if we did split, push the child leafs to the Vector so we can loop into them next
               leafList.push(l.leftChild);
               leafList.push(l.rightChild);
               did_split = true;
              }
            }
        }
      })
    }
    rootLeaf.createRooms();
    // console.log(leafList);
    this.state = {leafList:leafList,row:row,col:col,board:board,isPause:0,isClear:0,gen:gen,speed:300}

  };

  handleChange = function(){

  };

  componentDidMount = function(){
    // just for fun:
    // 1
    // 2 3
    // 4 5 6
    // 7 8 9 10
    // 11 12 13 14 15
    // function numberGame(n){ 
    //   if(n==1) {return 1} else { 
    //     let sum = (1+n)*n/2.0 ;
    //     let nstr= "";
    //     for(let i=sum-n+1;i<=sum;i++){
    //       nstr = nstr + (i + " ")  
    //     };
    //     return numberGame(n-1) + "\n" + nstr;
    //   }
    // }
    // console.log(numberGame(5))
  };
  componentWillUnmount = function(){

  };

  drawMap = function(){

  };

  render(){
    let geList=[];
    let col=this.state.col;
    let row=this.state.row;
    let board=this.state.board;
    let leafList = this.state.leafList;
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
    const drawMap = function(leafList){
      leafList.forEach(function(l,index){
        if(l.room != 0){
          return <p></p>
        }
      })

    };
    return (
      <div id={s.mainContainer}>
        <div>
          <span className={s.playerstate}>Health: 100</span>
          <span className={s.playerstate}>Weapon: stick</span>
          <span className={s.playerstate}>Attack: 7</span>
          <span className={s.playerstate}>Level: 0</span>
          <span className={s.playerstate}>Next Level: 60 XP</span>
          <span className={s.playerstate}>Dungeon: 0</span>
        </div>
        <div id={s.gameboard}>
          <p></p>
        </div>
        <div id={s.mubu1}>
        
        </div>
        <div id={s.me}>
        
        </div>
      </div>
    )
  }
};

class Roguelike1 extends React.Component{ 
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
    this.setState({board:board,isClear:1,gen:0});
  };

  handlePause = function(){    
    this.intervals.forEach(clearInterval);
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
