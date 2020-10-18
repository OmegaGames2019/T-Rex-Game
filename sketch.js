var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloud, cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var gameover1,gameover2,button1,button2; 

var jump, die, checkpoint;

function preload(){
  
  trex_running =                                                     loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameover2 = loadImage("gameOver.png");  
  
  button2 = loadImage("restart.png");
  
  jump = loadSound("jump.mp3");
  die = loadSound("die.mp3");
  checkpoint = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided)
  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -4;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  // create Obstacles and Cloud groups
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  
  //console.log("Hello" + 5);
  
  score = 0;
  
  gameover1 = createSprite(300,100);
  gameover1.addImage(gameover2);
    
  button1 = createSprite(300,130,100,50);
  button1.addImage(button2);
  button1.scale = 0.5;
    
  gameover1.scale = 0.8;
}

function draw() {
  background(180);
  
  text("Score: "+ score, 500,50);
  
  gameover1.visible = false;
  button1.visible = false;
  
  if(gameState === PLAY){
    //move the ground
    ground.velocityX = -6 - score/100;
    score = score + Math.round(getFrameRate()/60);
    
    if(keyDown("space")&& trex.y >= 150) {
      trex.velocityY = -13;
      jump.play();
    }
    spawnClouds();
    
    trex.velocityY = trex.velocityY + 0.8
    
    if (ground.x < 0){
    ground.x = ground.width/2;
    }
    
    if (score > 0 && score % 100 === 0) {
      checkpoint.play();
      //ground.velocityX = ground.velocityX - 10; 
    }
    

    spawnObstacles();
    
 
  }
  else if(gameState === END){
    //stop the ground
    ground.velocityX = 0;
    cloudsGroup.setVelocityXEach(0);
    obstaclesGroup.setVelocityXEach(0);
    
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    trex.changeAnimation("collided", trex_collided);
    
    trex.velocityY = 0; 
    
    if (mousePressedOver(button1)) {
    
    reset();
    }
    
    button1.visible = true;
    gameover1.visible = true;
  }
  
  
  
  if (gameState === PLAY && trex.isTouching(obstaclesGroup)) {
    gameState = END; 
    die.play();
  }
  
  trex.collide(invisibleGround);
  
  trex.setCollider("circle", 0, 0, 40);
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,165,10,40);
   obstacle.velocityX = -6 - score/100;

   
    // //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //adding obstacles to the group
   obstaclesGroup.add(obstacle);
   
   trex.depth = obstacle.depth;
   trex.depth = trex.depth + 1;
 }
}

function reset() {
  
  gameState = PLAY;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running", trex_running);
  score = 0;
}


function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
     cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 210;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
  }
  
}