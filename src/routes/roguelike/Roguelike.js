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

  // componentWillReceiveProps = function(nextProps){
  //   this.setState({stage:nextProps.stage})
  // };
  handleClick = function(){

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

    let Leaf = {
      createNew: function(x=10, y=10, width=1000, height=500){
        let leaf = {};
        const MIN_LEAF_SIZE = 120 ;
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
          let max = (splitH ? leaf.height: leaf.width) - MIN_LEAF_SIZE; // determine the maximum height or width
          if (max <= MIN_LEAF_SIZE ) 
          {  
            return false; // the area is too small to split any more...
          };
          let split = Math.floor(Math.random() * (max - MIN_LEAF_SIZE) / 10 ) * 10 + MIN_LEAF_SIZE;
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
          // get random point between 2 rooms
          // point[0]: x, point[1]: y
          let point1 = [];
          let point2 = [];
          point1[0] = lRoom.x + Math.floor(Math.random() * (lRoom.width -30)/10)*10 + 10;
          point1[1] = lRoom.y + Math.floor(Math.random() * (lRoom.height -30)/10)*10 + 10;
          point2[0] = rRoom.x + Math.floor(Math.random() * (rRoom.width -30)/10)*10 + 10;
          point2[1] = rRoom.y + Math.floor(Math.random() * (rRoom.height -30)/10)*10 + 10;
          let w = point1[0] - point2[0];
          let h = point1[1] - point2[1];
          let hall1 = {};
          let hall2 = {};
          if(w < 0){
            if( h < 0){
              // 1  
              //    2
              if(Math.random() < 0.5){
                hall1.x = point1[0];
                hall1.y = point1[1];
                hall1.height = Math.abs(h);
                hall1.width = 10;
                hall2.x = point1[0];
                hall2.y = point2[1];
                hall2.height = 10;
                hall2.width = Math.abs(w);
                halls.push(hall1);
                halls.push(hall2);
              }else{
                hall1.x = point1[0];
                hall1.y = point1[1];
                hall1.height = 10;
                hall1.width = Math.abs(w);
                hall2.x = point2[0];
                hall2.y = point2[1];
                hall2.height = Math.abs(h);
                hall2.width = 10;
                halls.push(hall1);
                halls.push(hall2);
              }
            }else if(h > 0){
              //    2
              // 1   
              if(Math.random() < 0.5){
                hall1.x = point1[0];
                hall1.y = point2[1];
                hall1.height = Math.abs(h);
                hall1.width = 10;
                hall2.x = point1[0];
                hall2.y = point2[1];
                hall2.height = 10;
                hall2.width = Math.abs(w);
                halls.push(hall1);
                halls.push(hall2);
              }else{
                hall1.x = point1[0];
                hall1.y = point1[1];
                hall1.height = 10;
                hall1.width = Math.abs(w);
                hall2.x = point2[0];
                hall2.y = point2[1];
                hall2.height = Math.abs(h);
                hall2.width = 10;
                halls.push(hall1);
                halls.push(hall2);
              }
            }else{ // h == 0
              // 1  2
              hall1.x = point1[0];
              hall1.y = point1[1];
              hall1.height = 10;
              hall1.width = Math.abs(w);
              halls.push(hall1);
            }
          }else if( w > 0){
            if( h < 0){
              //    1
              // 2   
              if(Math.random() < 0.5){
                hall1.x = point2[0];
                hall1.y = point1[1];
                hall1.height = Math.abs(h);
                hall1.width = 10;
                hall2.x = point2[0];
                hall2.y = point1[1];
                hall2.height = 10;
                hall2.width = Math.abs(w);
                halls.push(hall1);
                halls.push(hall2);
              }else{
                hall1.x = point2[0];
                hall1.y = point2[1];
                hall1.height = 10;
                hall1.width = Math.abs(w) + 10;
                hall2.x = point1[0];
                hall2.y = point1[1];
                hall2.height = Math.abs(h);
                hall2.width = 10;
                halls.push(hall1);
                halls.push(hall2);
              }
            }else if(h > 0){
              // 2  
              //    1
              if(Math.random() < 0.5){
                hall1.x = point2[0];
                hall1.y = point2[1];
                hall1.height = Math.abs(h);
                hall1.width = 10;
                hall2.x = point2[0];
                hall2.y = point1[1];
                hall2.height = 10;
                hall2.width = Math.abs(w);
                halls.push(hall1);
                halls.push(hall2);
              }else{
                hall1.x = point2[0];
                hall1.y = point2[1];
                hall1.height = 10;
                hall1.width = Math.abs(w);
                hall2.x = point1[0];
                hall2.y = point2[1];
                hall2.height = Math.abs(h);
                hall2.width = 10;
                halls.push(hall1);
                halls.push(hall2);
              }
            }else{ // h == 0
              // 2 1
              hall1.x = point2[0];
              hall1.y = point2[1];
              hall1.height = 10;
              hall1.width = Math.abs(w);
              halls.push(hall1);
            }
          }else{ // w == 0
            if(h > 0){
              // 2
              // 1
              hall1.x = point2[0];
              hall1.y = point2[1];
              hall1.height = Math.abs(h);
              hall1.width = 10;
              halls.push(hall1);
            }else{
              // 1
              // 2
              hall1.x = point1[0];
              hall1.y = point1[1];
              hall1.height = Math.abs(h);
              hall1.width = 10;
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
            roomSize[0] = Math.floor(Math.random() * (leaf.width-20-100)/10)*10 + 100;
            roomSize[1] = Math.floor(Math.random() * (leaf.height-20-100)/10)*10 + 100;
            roomPos[0] = leaf.x + Math.floor(Math.random() * (leaf.width - roomSize[0] - 10)/10)*10 + 10;
            roomPos[1] = leaf.y + Math.floor(Math.random() * (leaf.height - roomSize[1] - 10)/10)*10 + 10;
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
    let MAX_LEAF_SIZE = 200; 
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

    this.state = {leafList:leafList,row:row,col:col,board:board,isPause:0,isClear:0,gen:gen,speed:300}

  };

  handleChange = function(){

  };

  handleKeyUp = function(event){
    event.preventDefault();
    // keyCode: 38: up,39:right, 40:down, 37:left
    console.log(event.keyCode);
  }

  componentWillMount = function(){

  }

  componentDidMount = function(){
  document.addEventListener("keyup", this.handleKeyUp.bind(this));      
	let c = this.refs.canvasRef;
	let ctx=c.getContext("2d");
	
	this.state.leafList.forEach(function(l,indexs){
    // draw rooms
		if( l.room !=0 ){
		  let room = l.room;
		  ctx.beginPath();
      ctx.strokeStyle="green";
      ctx.rect(room.x,room.y,room.width,room.height);  
      ctx.stroke();
	    ctx.fillStyle="green";
	    ctx.fill();			
		}

    // draw halls
    if( l.halls !=0 ){
      l.halls.forEach(function(hall,index){
        ctx.beginPath();
        ctx.strokeStyle="green";
        ctx.rect(hall.x,hall.y,hall.width,hall.height);  
        ctx.stroke();
        ctx.fillStyle="green";
        ctx.fill();
      });           
    }

    // act on player input
    // onKeyup

	})
	
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
	  document.removeEventListener("keyup", this.onKeyup.bind(this));
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
      <div id={s.mainContainer} onKeyup = {this.onKeyup} >
        <div>
          <span className={s.playerstate}>Health: 100</span>
          <span className={s.playerstate}>Weapon: stick</span>
          <span className={s.playerstate}>Attack: 7</span>
          <span className={s.playerstate}>Level: 0</span>
          <span className={s.playerstate}>Next Level: 60 XP</span>
          <span className={s.playerstate}>Dungeon: 0</span>
        </div>
        <div id={s.gameboard1}>
          <p></p>
        </div>
		
        <div id={s.mubu1}>
        
        </div>
        <div id={s.me1}>
        
        </div>
		<canvas id="myCanvas" ref="canvasRef" width="1000" height="550" >
			Your browser does not support the HTML5 canvas tag.
		</canvas>
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
