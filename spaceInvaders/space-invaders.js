var player;
var playerBullets = new Array();
var enemyBullets = new Array();

var totalPlayerBullets = 0;
var totalEnemyBullets = 0;

var loop;
var enemyLoop;
var UFOloop;

var score = 0;

/*Global variables*/
var maxLeft = 0;
var frame = 0;
var maxBullets = 1;
var bulletSpeed = 10;
var shootingFrames = 5;
var currentShootingFrame = 0;
var shooting = true;
var currentMargin = 0;
var world;

/* Game status */
var pausedGame = false;
var levelCleared = false;
var gameOver = false;

/* Animation ticks */
var fps = 60;
var enemyMovesPerSecond = 2;
var UFOenemyMovesPerSecond = 90;


/* Player dimensions */
var playerHeight = 37;
var playerWidth = 60;


/* Enemy movements  */
var verticalAdvance = 20;
var horizontalAdvance = 30;
var enemiesPerRow = 10;

/* Enemy dimensions */
var verticalNewRow = 35;
var enemyWidth = 40;
var enemyHeight = 27;
var enemyMargin = 30;

/* UFO dimmensions */
var UFOwidth = 60;
var UFOheight = 60;


/* Probabilities */
var firingProbability = 0.005;
var UFOprobability = 0.001;
var UFOspeed = 4;
var actualUFOSpeed = 0;





//Adds a row of aliens to the initial game. 
//Shifts every other row down
function addRow(){
    var a ='<div class="row entryRow">';
    for(var i =0; i<enemiesPerRow; i++){
	
	a+='<div class="enemy alive ';
	if(i==0)
	a+= 'firstEnemy right';
	a+= ' type'+(Math.floor(Math.random()*3));
	a+= ' color'+(Math.floor(Math.random()*6));
	a+='" health="3"></div>';
    }

    a+='</div>';
    $(".entryRow").removeClass("entryRow");
    $(".row").each(function(){
	var t = Number($(this).css('top').replace('px',''));
	$(this).css('top',t+verticalNewRow);

    });
    $("#world").append(a);

    
    var enemiesWidth = enemiesPerRow*enemyWidth + (enemiesPerRow-1)*enemyMargin;
    maxLeft = $(".entryRow").width()-enemiesWidth;
    $(".entryRow .firstEnemy").css('margin-left', maxLeft/2);
    $(".entryRow").css('top', 1.5*verticalNewRow+'px');
    currentMargin = maxLeft/2;
}

/***************   UFO MANAGEMENT *********************/
function insertUFO(){
    var r = Math.random();
    if(r<UFOprobability && $("#UFO").length == 0){
	$("#UFOpanel ").append("<div id='UFO' points='"
			       +(1000+Math.floor(Math.random()*4000))
			       +"'></div>");
	
	actualUFOSpeed = Math.random() >= 0.5? UFOspeed:-UFOspeed;
	if(actualUFOSpeed > 0){
	    $("#UFO").css("margin-left",-UFOwidth);
	}else{
	    $("#UFO").css("margin-left",world.width() + UFOwidth);
	}
	
	UFOloop = setInterval(function(){UFOadvance();},1000/UFOenemyMovesPerSecond)
	$("#ufosound").jPlayer("play");
	
	
    }
    
}


function UFOadvance(){
    var left = Number($("#UFO").css("margin-left").replace('px',''));
    left = left + actualUFOSpeed;
    var UFO = $("#UFO");
    UFO.css("margin-left",left);
    var killUFOloop = false;
    var o = UFO.offset();
    $(".playerBullets").each(function(){
	var ob = $(this).offset();
	if((o.left <= ob.left && (o.left + UFOwidth) >= ob.left) &&
	   (o.top <= ob.top && (o.top + UFOheight) >= ob.top)){
	    score += Number(UFO.attr('points'));
	    killUFOloop = true;
	    //Remove player bullet
	    UFO.addClass('deadufo');
	    $("#boom").jPlayer("play");
	    setTimeout(function(){$("#UFO").remove();},500);
	}
    });


    if(
	(actualUFOSpeed > 0 && left >= world.width() + UFOwidth) || 
	    (actualUFOSpeed < 0 && left <= -UFOwidth)) 
    {
	killUFOloop = true;
	UFO.remove();
    }
    if(killUFOloop){
	$("#ufosound").jPlayer("stop");
	clearInterval(UFOloop);
	UFOloop = null;
    }
}



/************** Game status check *********************/

//Verify if level has been cleared
function checkWinningConditions(){
    var aliveEnemies = $(".enemy.alive").length;
    if(aliveEnemies == 0){
	pausedGame = true;
	levelCleared = true;
	stopGame();
    }
}

//Verify if level has been lost. This is triggered when alive aliens reach the player height.
function checkLosingConditions(){
    
    
    $(".enemy.alive").each(function(){
	//Player height
	var pTop = $("#playerIcon").offset().top;
	//Enemy height
	var aTop = $(this).offset().top + enemyHeight;
	
	//If players reached, pause game, trigger game over and play 
	//sound and animation for death
	if(aTop > pTop){
	    pausedGame = true;
	    gameOver = true;
	    $("#boom").jPlayer("play");
	    $("#playerIcon").addClass("playerdead");
	    stopGame();	}
    });
}

//Check for collisions between playerBullets and alive enemies or 
//enemy bullets and the player
function detectColisions(){
    
    var removeIds = new Array();
    
    //Go through player bullets
    $(".playerBullets").each(function(){
	var b = $(this);
	var bp = b.offset();
	
	if(bp.top > 0){

	    $(".enemy.alive").each(function(){
		var e = $(this);
		var ep = e.offset();		
		
		//check if bullet is in bounding box of the enemy
		if( ep.left <= bp.left && (ep.left + enemyWidth) >= bp.left
		   &&  ep.top >= bp.top && (ep.top - enemyHeight) <= bp.top ){


		    //KILL THE ALIENS!!!! KILL KILL KILL!!
		    $(this).removeClass("alive").addClass("dead").addClass("explode");
		    var id = b.attr('id');
		    removeIds.push(id);
		    $(b).remove();
		    $("#invaderkilled").jPlayer("play");
		    score += 100;
		}
 	    });
	}
    });
    
    //Remove bullets that have collided
    var rObj = new Array();
    for(var i = 0; i <= removeIds.length; i++){
	for(var j =0; j< playerBullets.length; j++){
	    if('pb-'+playerBullets[j].id == removeIds[i]){
		rObj.push(playerBullets[j]);
	    }
	}
    }
    playerBullets = _.difference(playerBullets,rObj);  

    /*********  PLAYER VS ENEMY BULLETS ******************/

    $(".enemyBullets").each(function(){
	var bp = $(this).offset();
	var ep = $("#playerIcon").offset();
	
	if( ep.left <= bp.left && (ep.left + enemyWidth) >= bp.left
	    &&  ep.top >= bp.top && (ep.top - enemyHeight) <= bp.top ){
	    
	    //Well,... the player is dead... start funeral rites
	    pausedGame = true;
	    gameOver = true;
	    $("#boom").jPlayer("play");
	    $("#playerIcon").addClass("playerdead");
	    stopGame();
	}
    
    });

    
}

//Get enemy to randomly fire at you
function enemyFire(){
    $(".enemy.alive").each(function(){
	var r = Math.random();
	if(r <= firingProbability){
	    addEnemyBullet($(this));
	}
    });
}


//Move enemies forward
//This method is driven by the enemyLoop
function moveEnemies(){
    $(".explode").removeClass("explode");
    $(".enemy").toggleClass("step2");
    $(".firstEnemy").each(function(item){
	var left = Number($(this).css('margin-left').replace('px',''));
	if($(this).hasClass('right')){
	    left+= horizontalAdvance
	    
	    if(left>=maxLeft){
		$(this).removeClass('right').addClass('left');
		$(this).parents(".row").each(function(item){
		    var t = Number($(this).css('top').replace('px',''));
		    $(this).css('top',t+verticalAdvance);
		});
	    }else{
		$(this).css('margin-left',left);
	    }
	}
	
	if($(this).hasClass('left')){
	    left-= horizontalAdvance;
	    if(left<=0){
		$(this).removeClass('left').addClass('right');
		$(this).parents(".row").each(function(item){
		    var t = Number($(this).css('top').replace('px',''));
		    $(this).css('top',t+verticalAdvance);
		});
		
	    }else{
		$(this).css('margin-left',left);
	    }
	}
	currentMargin = left;
    });
    enemyFire();
    checkLosingConditions();

}


//Refresh the world status. This method moves bullets, 
//tests for UFO appearances and checks for collisions
function refreshWorld(){
    insertUFO();
    if(shooting){
	if(currentShootingFrame > shootingFrames){
	    currentShootingFrame = 0;
	    shooting = 0;
	    $("#playerIcon").removeClass("shoot");
	}else{
	    currentShootingFrame++;
	}
    }
    
    frame++;
    checkWinningConditions();
    $(".playerBullets, .enemyBullets").remove();


    //Remove bullets out of bounds
    var remove = new Array();
    _.each(playerBullets, function(e){
	var bullet = $("<div class='playerBullets'></div>").css('left',e.x-2)
	    .css("bottom",e.y).attr('id', 'pb-'+e.id);
	$("#world").append(bullet);
	e.y = e.y +bulletSpeed;
	if(e.y > $("#world").height()){
	    remove.push(e);
	}
    });
    playerBullets = _.difference(playerBullets,remove);

    //Remove enemy bullets out of bounds
    remove = new Array();
    _.each(enemyBullets, function(e){
	var bullet = $("<div class='enemyBullets'></div>").css('left',e.x-2)
	    .css("top",e.y).attr('id', 'eb-'+e.id);
	$("#world").append(bullet);
	e.y = e.y +bulletSpeed;
	if(e.y > $("#world").height()){
	    remove.push(e);
	}
    });
    enemyBullets = _.difference(enemyBullets,remove);
 
    //Find any collisions
    detectColisions();
    
    //update score display
    $("#score").html(score);

}


//Add a player bullet to the world
function addPlayerBullet(){
    //Check if we haven't  already maxed the bullet cap
    if(playerBullets.length < maxBullets){
	shooting = true;
	$("#playerIcon").addClass("shoot");
	$("#fire").jPlayer("play");
	var pos = Number(player.css('left').replace('px','')) + (player.width()/2);
	playerBullets.push( { id:totalPlayerBullets, x:pos, y:25});
	totalPlayerBullets++;
    }
}

//Add enemy bullet to the world
function addEnemyBullet(enemy){
    var left = enemy.offset().left  -  $("#world").offset().left ;
    var top  = enemy.parent().position().top + enemyHeight ;
    enemyBullets.push( { id:totalEnemyBullets, x:left, y:top});
    totalEnemyBullets++;
}

//Pause, level cleared and game over stopping funciont
function stopGame(){
    if(levelCleared){
	$("#levelCleared").show();
    }else if(gameOver){
	$("#gameOver").show();
    }else{
	$("#pause").show();
    }
    clearInterval(loop);
    loop = null;
    clearInterval(enemyLoop);
    enemyLoop = null;
    clearInterval(UFOloop);
    UFOloop = null;
    $("#soundtrack").jPlayer("volume",0.1);
}

//Resume game from pause
function unpauseGame(){
    $("#gameOver").hide();
    $("#pause").hide();
    
    loop= setInterval(function(){refreshWorld();},1000/fps);
    enemyLoop = setInterval(function(){moveEnemies();},1000/enemyMovesPerSecond);
    if($("#UFO").length>0){
	UFOloop = setInterval(function(){UFOadvance();},1000/UFOenemyMovesPerSecond);
    }
    $("#soundtrack").jPlayer("volume",1);
}



//Game initialization
$(document).ready(function(){


    /******************************
                Audio Setup
     *****************************/
    $("#soundtrack").jPlayer({
	ready: function () {
            $(this).jPlayer("setMedia", {
                mp3: "./media/spaceinvaders1.mp3"
            }).jPlayer("play"); // auto play
        },
        ended: function (event) {
            $(this).jPlayer("play");
        },
	swfPath: "./libs/",
	supplied: "mp3"
    });

    $("#ufosound").jPlayer({
	ready: function () {
            $(this).jPlayer("setMedia", {
                mp3: "./media/ufo_lowpitch.mp3"
            }) // auto play
        },
        ended: function (event) {
            $(this).jPlayer("play");
        },
	volume:0.1,
	swfPath: "./libs/",
	supplied: "mp3"
    });

    $("#fire").jPlayer({
	ready: function () {
            $(this).jPlayer("setMedia", {
                mp3: "./media/shoot.mp3"
            })
        },
	volume: 0.1,
	swfPath: "./libs/",
	supplied: "mp3"
    });

    $("#boom").jPlayer({
	ready: function () {
            $(this).jPlayer("setMedia", {
                mp3: "./media/explosion.mp3"
            })
        },
	volume:0.1,
	swfPath: "./libs/",
	supplied: "mp3"
    });

    $("#invaderkilled").jPlayer({
	ready: function () {
            $(this).jPlayer("setMedia", {
                mp3: "./media/invaderkilled.mp3"
            })
        },
	volume:0.1,
	swfPath: "./libs/",
	supplied: "mp3"
    });



    /******************************
                Game Setup
     *****************************/

    player =  $("#playerIcon");
    playerBullets = new Array();
    //spawnRow();
    world = $("#world");
    //Manage mouse tracking for player icon
    $(document).mousemove(function(event){
	var x = event.pageX;
	
	var offset = world.offset();
	
	var width = player.width();
	var worldWidth = world.width();
	
	var x2 = x-offset.left;
	
	if(x2<(width/2)){
	    x2=width/2;
	}
	if(x2 > worldWidth-(width/2)){
	    x2=worldWidth-width/2;
	}
	
	if(!pausedGame && !gameOver && !levelCleared){
	    player.css('left',x2-(width/2));
	}
    
    });
    
    

    //Bullet management
    $(document).click(function(event) {
	if(!pausedGame){
	    addPlayerBullet();
	}
    });

    $(document).keydown(function(event) {
	if(!pausedGame){
	    if(event.which == 32){
		addPlayerBullet();
		event.preventDefault();
	    }
	   
	}
	if(event.which == 80){
	    //press 'P'
	    if(!gameOver){
		if(pausedGame){
		    unpauseGame();
		}else{
		    stopGame();
		}
		pausedGame = !pausedGame;
	    }	
	}
	
    });

    
    //Initialize world to basic settings
    initWorld(true);
    
    $(".settings").focus(function(){
	if(!pausedGame){
	    pausedGame =true;
	    stopGame();
	}
    });
    
    //Bind apply settings button
    $("#applySettings").click(function(){ 
	
	enemyMovesPerSecond = Number($("#enemyMovesPerSecond").val());
   	fps = Number($("#ticksPerSecond").val());	
	verticalAdvance = Number($("#verticalSpeed").val());
	horizontalAdvance = Number($("#horizontalSpeed").val());	
	maxBullets = Number($("#maxBullets").val());
	firingProbability = Number($("#firingProbability").val());
	
	if(pausedGame){
	    unpauseGame();
	    pausedGame =false;
	}
    });
        

    //Reset game world 
    $("#reset").click(function(){ 
	if(confirm("Are you sure you want to reset? All progress will be lost")){
	    initWorld(true);
	}
    });


    // This is how we move to the next level
    $("#nextLevelLink").click(function(){
	firingProbability = firingProbability*2; 
	$("#firingProbability").val(firingProbability);
	enemyMovesPerSecond = enemyMovesPerSecond + 0.2;
	$("#enemyMovesPerSecond").val(enemyMovesPerSecond);
	$("#levelCleared").hide();
	initWorld(false);
	
    });

});



//Initialize world. reset == true implies defaulting to the original settings
function initWorld(reset){
    $("#UFO,.row,.enemyBullet,.playerBullet").remove();
    $("#playerIcon").removeClass("playerdead");
    $("#soundtrack").jPlayer("volume",1);
    $("#gameOver").hide();
    $("#pause").hide();
    
    if(loop){
	clearInterval(loop);
	loop = null;
    }
    
    if(enemyLoop){
	clearInterval(enemyLoop);
	enemyLoop = null;
    }
    
    playerBullets = new Array();
    enemyBullets = new Array();
    totalPlayerBullets = 0;
    totalEnemyBullets = 0;
    pausedGame = false;
    gameOver = false;
    levelCleared = false;
    
    if(reset){
	score = 0;
	/* Game status */
	maxLeft = 0;
	/* */
	enemyMovesPerSecond = 1;
	
	fps = 60;
    
	/* Enemy movements  */
	verticalAdvance = 20;
	horizontalAdvance = 30;
	
	/* Enemy stats */
	firingProbability = 0.005;
	maxBullets = 1;

	$("#enemyMovesPerSecond").val(enemyMovesPerSecond);
	$("#ticksPerSecond").val(fps);
	$("#verticalSpeed").val(verticalAdvance);
	$("#horizontalSpeed").val(horizontalAdvance);
	$("#maxBullets").val(maxBullets);
	$("#firingProbability").val(firingProbability);
    
    }

    for(var i =0; i<5; i++){
	addRow();
    }
    loop = setInterval(function(){refreshWorld();},1000/fps);
    enemyLoop = setInterval(function(){moveEnemies();},1000/enemyMovesPerSecond);
}

