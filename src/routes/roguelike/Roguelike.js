import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Roguelike.css';
import { connect } from 'react-redux';
import { setRuntimeVariable } from '../../actions/runtime';
import { Button,Alert,Modal } from 'react-bootstrap';

class Roguelike extends React.Component{ 
  constructor(...args){
    super(...args);  
    this.state = this.initMap();  
  };

  restart = function(){
    let state = this.initMap();
    this.setState(state);
  };

  handleKeyUp = function(event){
    event.preventDefault();
    let c = this.refs.canvasRef;
    let ctx=c.getContext("2d");
    let {leafList,actors,actorsMap,food,foodMap,weapon,weaponMap,view} = this.state;
    let dir = {};
    // keyCode: 38: up,39:right, 40:down, 37:left
    switch(event.keyCode){
      case 37: 
      dir.x = -10;
      dir.y = 0;    
      break;
      case 38:
      dir.x = 0;
      dir.y = -10;    
      break;
      case 39:
      dir.x = 10;
      dir.y = 0;
      break;
      case 40:
      dir.x = 0;
      dir.y = 10;
      break;
    }
    actors = this.moveTo(actors,actorsMap,food,foodMap,weapon,weaponMap,view,dir);
    this.setState({weapon:weapon,weaponMap:weaponMap,food:food,foodMap:foodMap,actors:actors,actorsMap:actorsMap,view:view});
    this.drawMap(leafList);
    this.drawActors(actors,view);
    this.drawFood(food);
    this.drawWeapon(weapon);
    if(this.state.showDarkness){
    this.drawDarkness(actors[0]);}
  }

  initMap = function(){
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
    // actor list and map for easy search
    let {actors,actorsMap,view} = this.initActors(leafList);
    let {food,foodMap} = this.initFood(leafList,actorsMap);
    let {weapon,weaponMap} = this.initWeapon(leafList,actorsMap,foodMap);

    return {showDarkness:true,showModal:false,view:view,weapon:weapon,weaponMap:weaponMap,food:food,foodMap:foodMap,actors:actors,actorsMap:actorsMap,leafList:leafList};

  };

  drawMap = function(leafList){
    let c = this.refs.canvasRef;
    let ctx=c.getContext("2d");
    // draw backgroud
    ctx.beginPath();
    ctx.strokeStyle="grey";
    ctx.rect(0,0,1200,600);  
    ctx.stroke();
    ctx.fillStyle="grey";
    ctx.fill(); 
  
    leafList.forEach(function(l,index){
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
    })
  }
  
  initActors = function(leafList){
    let actors = [];
    let actorsMap = {};
    leafList.forEach(function(l,index){
    // init actors or player
    if(actors.length > 6){
      return actors;
    }else{
    
    if( l.room !=0 && Math.random() < 0.5 ){
      let room = l.room;
      let actor = {};
      actor.x = room.x + Math.floor(Math.random() * (room.width - 20)/10 ) * 10 + 10;
      actor.y = room.y + Math.floor(Math.random() * (room.height - 20)/10 ) * 10 + 10;
      if(actors.length == 0){
        // first actor is player
        actor.hp = 120;
        actor.attack = 10;
        actor.level = 0;
        actor.xp = 0;
        actor.nextLevelXp = 60;
        actor.weaponName = "fist";
      }else{
        actor.hp = Math.floor( Math.random() * 3 ) * 10 + 10;        
        actor.level = Math.floor( Math.random() * 3 );
        actor.attack = Math.floor( Math.random() * actor.level ) * 10 + 10;
        actor.xp = Math.floor( Math.random() * actor.level ) * 10 + actor.attack;
        actorsMap[actor.x + "_" + actor.y] = actor; 
      }

      actors.push(actor);

    }
    }
    })
    // last one of actors is boss
    actors[actors.length-1].hp = 100;
    actors[actors.length-1].level = 4;
    actors[actors.length-1].attack = 50;
    actors[actors.length-1].xp = 200;
    let view ={};
    view.x = actors[0].x - 50;
    view.y = actors[0].y - 50;
    return {actors:actors,actorsMap:actorsMap,view:view};
  }

  drawActors = function(actors,view){
    let c = this.refs.canvasRef;
    let ctx=c.getContext("2d");
    let lastInx = actors.length-1;
    // draw view
    ctx.beginPath();
    // ctx.globalCompositeOperation = "xor"
    // ctx.globalAlpha = 0;
    ctx.strokeStyle="rgba(0,0,0,0)";
    ctx.rect(view.x,view.y,100,100);  
    ctx.stroke();
    ctx.fillStyle="rgba(0,0,0,0)";
    ctx.fill();

    actors.forEach(function(actor,index){    
    if( index == 0 ){
      ctx.beginPath();
      ctx.strokeStyle="blue";
      ctx.rect(actor.x,actor.y,10,10);  
      ctx.stroke();
      ctx.fillStyle="blue";
      ctx.fill();     
    }else if( index == lastInx ){
      ctx.beginPath();
      ctx.strokeStyle="purple";
      ctx.rect(actor.x,actor.y,10,10);  
      ctx.stroke();
      ctx.fillStyle="purple";
      ctx.fill();     
    }else{
      ctx.beginPath();
      ctx.strokeStyle="red";
      ctx.rect(actor.x,actor.y,10,10);  
      ctx.stroke();
      ctx.fillStyle="red";
      ctx.fill();
    }
    })
    
  }

  initFood = function(leafList,actorsMap){
    let food = [];
    let foodMap = {};
    leafList.forEach(function(l,index){
    // init actors or player
    if(food.length > 4){
      return food;
    }else{
    
    if( l.room !=0 && Math.random()<0.5 ){
      let room = l.room;
      let f = {};
      f.x = room.x + Math.floor(Math.random() * (room.width - 20)/10 ) * 10 + 10;
      f.y = room.y + Math.floor(Math.random() * (room.height - 20)/10 ) * 10 + 10;
      f.hp = Math.floor( Math.random() * 3 ) * 10 + 10;
      
      if(!actorsMap[f.x + "_" + f.y]){
       food.push(f);
       foodMap[f.x + "_" + f.y] = f; 
      }
    }
    }
    })
    return {food:food,foodMap:foodMap};
  }

  drawFood = function(food){
    let c = this.refs.canvasRef;
    let ctx=c.getContext("2d");
    food.forEach(function(f,index){    
      ctx.beginPath();
      ctx.strokeStyle="orange";
      ctx.rect(f.x,f.y,10,10);  
      ctx.stroke();
      ctx.fillStyle="orange";
      ctx.fill();     
    })
  }

  initWeapon = function(leafList,actorsMap,foodMap){
    let weapon = [];
    let weaponMap = {};
    let typeList = ["stick", "sword", "gun"];
    leafList.forEach(function(l,index){
    // init actors or player
    if(weapon.length > 2){
      return weapon;
    }else{
    
    if( l.room !=0 && Math.random()<0.5 ){
      let room = l.room;
      let w = {};
      w.x = room.x + Math.floor(Math.random() * (room.width - 20)/10 ) * 10 + 10;
      w.y = room.y + Math.floor(Math.random() * (room.height - 20)/10 ) * 10 + 10;
      w.attack = (weapon.length + 1) * 10;
      w.name = typeList[weapon.length];
      
      if(!actorsMap[w.x + "_" + w.y] && !foodMap[w.x + "_" + w.y]){
       weapon.push(w);
       weaponMap[w.x + "_" + w.y] = w; 
      }
    }
    }
    })
    return {weapon:weapon,weaponMap:weaponMap};
  }

  drawWeapon = function(weapon){
    let c = this.refs.canvasRef;
    let ctx=c.getContext("2d");
    weapon.forEach(function(w,index){    
      ctx.beginPath();
      ctx.strokeStyle="pink";
      ctx.rect(w.x,w.y,10,10);  
      ctx.stroke();
      ctx.fillStyle="pink";
      ctx.fill();     
    })
  }

  drawDarkness = function(player){
    // darkness arr: 4 black rect , player sight: 100 * 100 rect
    let x = (player.x - 50 < 0 ) ? 0 : player.x - 50;
    let y = (player.y - 50 < 0 ) ? 0 : player.y - 50;
    let arr = [];
    arr[0]={x:0,y:0,w:1200,h:y};
    arr[1]={x:0,y:y+100,w:1200,h:600-y-100};
    arr[2]={x:0,y:0,w:x,h:600};
    arr[3]={x:x+100,y:0,w:1200-x-100,h:600};

    let c = this.refs.canvasRef;
    let ctx=c.getContext("2d");
    arr.forEach(function(a,index){    
      ctx.beginPath();
      ctx.strokeStyle="black";
      ctx.rect(a.x,a.y,a.w,a.h);  
      ctx.stroke();
      ctx.fillStyle="black";
      ctx.fill();     
    })
  }  

  
  // to see if player can move to the new place
  canGo = function(actor,dir){
    let res = false;
    this.state.leafList.forEach(function(l,index){
      let x = dir.x + actor.x;
      let y = dir.y + actor.y;
      if(l.room != 0){
        let room = l.room;
        let minX = room.x,
            maxX = room.x + room.width,
            minY = room.y,
            maxY = room.y + room.height;

        if( x < maxX && x >= minX && y < maxY && y >= minY  ){
          res = true;
        }        
      }
      if(l.halls != 0){
        l.halls.forEach(function(hall){
          let hminX = hall.x,
              hmaxX = hall.x + hall.width,
              hminY = hall.y,
              hmaxY = hall.y + hall.height;

          if( x < hmaxX && x >= hminX && y < hmaxY && y >= hminY  ){
           res = true;
          }  
        })                
      }
    })
    return res;
  }
  // get level
  getLevel = function(xp){
    if(xp>=60){
      return 1;
    }else if(xp>=120){
      return 2;
    }else if(xp>=180){
      return 3;
    }else if(xp>=240){
      return 4;
    }else{
      return 0;
    }
  }
  // get next level xp
  getNextLevel = function(xp){
    if(xp < 60){
      return 60 - xp;
    }else if(xp < 120){
      return 120 - xp;
    }else if(xp < 180){
      return 180 - xp;
    }else if(xp < 240){
      return 240 - xp;
    }else{
      return 0;
    }
  }
  // move to the new place, combat, or eat food or pick weapon .etc
  moveTo = function(actors,actorsMap,food,foodMap,weapon,weaponMap,view,dir){
    if(this.canGo(actors[0],dir) == false){
      return actors;
    }
    // newActor change and actors[0] change!!
    let newActor = actors[0];
    //save origin place
    let x = actors[0].x;
    let y = actors[0].y;
    newActor.x = newActor.x + dir.x;
    newActor.y = newActor.y + dir.y;
    view.x = view.x + dir.x;
    view.y = view.y + dir.y;

    // combat
    if(actorsMap[newActor.x+'_'+newActor.y]){

      let enemy = actorsMap[newActor.x+'_'+newActor.y] ;
      if( enemy.x ){ // enemy is not defeated, ie. not {}
      let idx = actors.indexOf(enemy);
      enemy.hp = enemy.hp - newActor.attack;
      newActor.hp = newActor.hp - enemy.attack;
      if( newActor.hp < 0 ){
        this.setState({showModal:true,finalResult:"You Lost!"});
      }else if( enemy.hp < 0 ){
        if( idx != 0 ){
         newActor.xp = newActor.xp + enemy.xp;
         let orginLevel = newActor.level;
         newActor.level = this.getLevel(newActor.xp);
         newActor.nextLevelXp = this.getNextLevel(newActor.xp);
         newActor.attack = newActor.attack + (newActor.level - orginLevel) * 10;
         actors[actors.indexOf(enemy)]={};
         actorsMap[enemy.x+'_'+enemy.y]={};
        }
        if( idx == actors.length - 1 ){
          this.setState({showModal:true,finalResult:"You Win!"});
        }
      }else{
        actors[0].x = x;
        actors[0].y = y;
      }
     }// if enemy.x
    }

    // eat food
    else if(foodMap[newActor.x+'_'+newActor.y]){

      let f = foodMap[newActor.x+'_'+newActor.y] ;
      if( f.x ){ // f is not eaten, ie. not {}
       newActor.hp = newActor.hp + f.hp;
       food[food.indexOf(f)]={};
       foodMap[f.x+'_'+f.y]={};
      }
    }
    // pick weapon
    else if(weaponMap[newActor.x+'_'+newActor.y]){
      let w = weaponMap[newActor.x+'_'+newActor.y] ;
      if( w.x ){ // w is not picked, ie. not {}
       let typeList = ["stick", "sword", "gun"];
       if( typeList.indexOf(w.name) > typeList.indexOf(newActor.weaponName) ){  // if weapon level higher than player's
        newActor.attack = newActor.attack + w.attack;
        newActor.weaponName = w.name;
       }
       weapon[weapon.indexOf(w)]={};
       weaponMap[w.x+'_'+w.y]={};
      }
    }

    // nothing there move to new place
    return actors;
  }

  toggleDarkness = function(){

    this.drawMap(this.state.leafList);
    // init and draw actors
    this.drawActors(this.state.actors,this.state.view);
    this.drawFood(this.state.food);
    this.drawWeapon(this.state.weapon);
    if(!this.state.showDarkness){
    this.drawDarkness(this.state.actors[0]);}
    this.setState({showDarkness:!this.state.showDarkness});
  }

  closeModal = function() {
    let state = this.initMap();  
    this.drawMap(state.leafList);
    // init and draw actors
    this.drawActors(state.actors,state.view);
    this.drawFood(state.food);
    this.drawWeapon(state.weapon);
    this.drawDarkness(state.actors[0]);
    this.setState(state);   
  }

  componentWillMount = function(){
    // let actors = this.initActors();
    // this.setState({actors:actors})
  }

  componentDidMount = function(){
    document.addEventListener("keyup", this.handleKeyUp.bind(this));      
    // draw map
    this.drawMap(this.state.leafList);
    // init and draw actors
    // let actors = this.initActors();
    this.drawActors(this.state.actors,this.state.view);
    this.drawFood(this.state.food);
    this.drawWeapon(this.state.weapon);
    if(this.state.showDarkness){
    this.drawDarkness(this.state.actors[0]);}
	
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
	  document.removeEventListener("keyup", this.handleKeyUp.bind(this));
  };

  render(){

    const close = () => this.setState({ showModal: false});
    return (
      <div id={s.mainContainer}>
        <div>
          <span className={s.playerstate}>Health: {this.state.actors[0].hp}</span>
          <span className={s.playerstate}>Weapon: {this.state.actors[0].weaponName}</span>
          <span className={s.playerstate}>Attack: {this.state.actors[0].attack}</span>
          <span className={s.playerstate}>Level: {this.state.actors[0].level}</span>
          <span className={s.playerstate}>Next Level: {this.state.actors[0].nextLevelXp} XP</span>
          <span className={s.playerstate}>Dungeon: {this.state.actors.length - 1}</span>
          <Button className={s.toggleBtn} onClick={this.toggleDarkness.bind(this)}>Toggle</Button>
        </div>
        
		    <canvas id="myCanvas" ref="canvasRef" width="1000" height="550" >
			    Your browser does not support the HTML5 canvas tag.
		    </canvas>
        <Modal
            show={this.state.showModal}
            aria-labelledby="contained-modal-title"
          >
            <Modal.Body>
              {this.state.finalResult}
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.closeModal.bind(this)}>Close</Button>
            </Modal.Footer>

        </Modal>
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
