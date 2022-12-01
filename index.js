const {Engine,Runner,Render,World,Bodies,Body,Events}=Matter

const cellsHorizontal=14;
const cellsVertical=10;
const width=window.innerWidth;
const height=window.innerHeight;
const unitLengthX=width/cellsHorizontal;
const unitLengthY=height/cellsVertical;
const engine=Engine.create();
engine.world.gravity.y=0;




const{world}=engine;
const render=Render.create({
    element:document.body,
    engine :engine,
    options:{
        wireframes:false,
        width,
        height

    }
})
Render.run(render)
Runner.run(Runner.create(),engine)


//walls
const walls=
[Bodies.rectangle(width/2, 0, width,2,{ isStatic:true}),
    Bodies.rectangle(0, height/2,2 ,height,{ isStatic:true}),
    Bodies.rectangle(width,height/2 ,2,height,{ isStatic:true}),
    Bodies.rectangle(width/2,height,width,2,{ isStatic:true})  
]
World.add(world,walls);

//Maze generation

const shuffle=(arr)=>{
    let counter=arr.length;
    while(counter>0){
        const index=Math.floor(Math.random()*counter);

        counter--;
        const temp=arr[counter];
        arr[counter]=arr[index];
        arr[index]=temp;
    }
    return arr;
}

const grid=Array(cellsVertical)
.fill(null).
map(()=>Array(cellsHorizontal).fill(false));

const vertical=Array(cellsVertical)
.fill(null)
.map(()=>Array(cellsHorizontal-1).fill(false));

const horizontal=Array(cellsHorizontal-1)
.fill(null)
.map(()=>Array(cellsVertical).fill(false));

const startRow=Math.floor(Math.random()*cellsVertical);
const startColum=Math.floor(Math.random()*cellsHorizontal);

const recurse=(row,column)=>{
    //If i have visited the cell at [row,colum] return
if(grid[row][column]){
    return
}
    //Mark This Cell as Visited
   grid[row][column]=true;
    //Assemble Random Ordered-list of neighbours
const neighbours=shuffle([
   [row-1,column,'up'],
    [row,column+1,'right'],
    [row+1,column,'down'],
    [row,column-1,'left']
]);

    //For each neighbour....
    for(let neighbor of neighbours){
        const[nextRow,nextColumn,direction]=neighbor
    //See if Neighbour is out of bond
if(nextRow<0
    ||nextRow>=cellsVertical
    ||nextColumn<0
    ||nextColumn>=cellsHorizontal){
    continue;
}
    //If We have visited the neighbor,continue next neighbour..
if(grid[nextRow][nextColumn]){
    continue;
}

    //Remove a wall from either horizal or vertical
   if(direction==='left'){
       vertical[row][column-1]=true;
   }else if(direction==='right'){
       vertical[row][column]=true;
   }else if(direction==='up'){
    horizontal[row-1][column]=true;
}else if(direction==='down'){
    horizontal[row][column]=true;
}
recurse(nextRow,nextColumn);

    }
    

}
recurse(startRow,startColum);

horizontal.forEach((row,rowIndex)=>{
    row.forEach((open,columnIndex)=>{
        if(open){
            return;
        }
const wall=Bodies.rectangle(
    columnIndex*unitLengthX+unitLengthX/2,
    rowIndex*unitLengthY+unitLengthY,
    unitLengthX,
    5,{
   isStatic:true,
   label:'wall',
   render:{
       fillStyle:'red'
   }
    }

);
World.add(world,wall)
    })


})


vertical.forEach((row,rowIndex)=>{
    row.forEach((open,columnIndex)=>{
        if(open){
            return;
        }
const wall=Bodies.rectangle(
    columnIndex*unitLengthX+unitLengthX,
    rowIndex*unitLengthY+unitLengthY/2,
    5,
    unitLengthY,
    {
label:'wall',
   isStatic:true,
   render:{
    fillStyle:'red'
}

    }

);
World.add(world,wall)
    });


});
//goal
const goal=Bodies.rectangle(
width-unitLengthX/2,
height-unitLengthY/2,
unitLengthX*0.7,
unitLengthY*0.7,{
    label:'goal',
    isStatic:true,
    render:{
        fillStyle:'green'
    }
   
}

);
World.add(world,goal)

//ball
const ballRadius=Math.min(unitLengthX,unitLengthY)/4;
const ball=Bodies.circle(
    unitLengthX/2,
    unitLengthY/2,
    ballRadius,{
        label:'ball',
        render:{
            fillStyle:'blue'
        }
       
    }
    
    
    );
    
    World.add(world,ball)
    document.addEventListener('keydown',events=>{
        const {x,y}=ball.velocity;
if(events.keyCode===87){
   
    Body.setVelocity(ball,{x, y:y-5})
} 
if(events.keyCode===68){
    Body.setVelocity(ball,{x:x+5, y})
} 
if(events.keyCode===83){
    Body.setVelocity(ball,{x, y:y+5})
} 
if(events.keyCode===65){
    Body.setVelocity(ball,{x:x-5, y})
} 



})
    
//win condition
Events.on(engine,'collisionStart',events=>{
    events.pairs.forEach((collision)=>{
  const labels=['ball','goal'];
 if(
     labels.includes(collision.bodyA.label)&&labels.includes(collision.bodyB.label)){
         document.querySelector('.winner').classList.remove('.hidden')
world.gravity.y=1
world.bodies.forEach(body=>{
    if(body.label==='wall'){
        Body.setStatic(body,false)
    }
})
 }

    });
});    
    











