var player;
var playerBullets = new Array();
var enemyBullets = new Array();
var totalPlayerBullets = 0;
var totalEnemyBullets = 0;
var loop;
var score = 0;

/* Game status */
var pausedGame = false;
var levelCleared = false;
var gameOver = false;
var maxLeft = 0;
var frame = 0;
var maxBullets = 5;
/* */
var ticksPerMovement = 40;
var fps = 30;

/* Player dimensions */
var playerHeight = 20;
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

/* Enemy stats */
var firingProbability = 0.01;



/**/
var currentMargin = 0;
var world;



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

function checkWinningConditions(){
    var aliveEnemies = $(".enemy.alive").length;
    if(aliveEnemies == 0){
	pausedGame = true;
	levelCleared = true;
	stopGame();
    }
}

function detectColisions(){

    var removeIds = new Array();
    $(".playerBullets").each(function(){
	var b = $(this);
	var bp = b.offset();
	
	if(bp.top > 0){

	    $(".enemy.alive").each(function(){
		var e = $(this);
		var ep = e.offset();		
		
		
		if( ep.left <= bp.left && (ep.left + enemyWidth) >= bp.left
		   &&  ep.top >= bp.top && (ep.top - enemyHeight) <= bp.top ){
		    $(this).removeClass("alive").addClass("dead");
		    var id = b.attr('id');
		    removeIds.push(id);
		    $(b).remove();
		    $("#boom").jPlayer("play");

		    score += 100;
		}
 	    });
	}
    });
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
	    pausedGame = true;
	    gameOver = true;
	    stopGame();
	    alert(' YOU ARE DEAD! ');

	}
    
    });

    
}

function enemyFire(){
    $(".enemy.alive").each(function(){
	var r = Math.random();
	if(r <= firingProbability){
	    addEnemyBullet($(this));
	}
    });
}


function refreshWorld(){
    frame++;
    checkWinningConditions();
    $(".playerBullets, .enemyBullets").remove();
    var top = $(".entryRow").css('top').replace('px','');
    
    if(frame%ticksPerMovement == 0){

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
	
	   enemyFire()
    }

    
    var remove = new Array();
    _.each(playerBullets, function(e){
	var bullet = $("<div class='playerBullets'></div>").css('left',e.x-2)
	    .css("bottom",e.y).attr('id', 'pb-'+e.id);
	$("#world").append(bullet);
	e.y = e.y +10;
	if(e.y > $("#world").height()){
	    remove.push(e);
	}
    });
    playerBullets = _.difference(playerBullets,remove);

    remove = new Array();
    _.each(enemyBullets, function(e){
	var bullet = $("<div class='enemyBullets'></div>").css('left',e.x-2)
	    .css("top",e.y).attr('id', 'eb-'+e.id);
	$("#world").append(bullet);
	e.y = e.y +10;
	if(e.y > $("#world").height()){
	    remove.push(e);
	}
    });
    enemyBullets = _.difference(enemyBullets,remove);
 
    detectColisions();

    $("#score").html(score);

}

function addPlayerBullet(){
    if(playerBullets.length < maxBullets){	
	$("#fire").jPlayer("play");
	var pos = Number(player.css('left').replace('px','')) + (player.width()/2);
	playerBullets.push( { id:totalPlayerBullets, x:pos, y:25});
	totalPlayerBullets++;
    }
}

function addEnemyBullet(enemy){
    var left = enemy.offset().left  -  $("#world").offset().left ;
    var top  = enemy.parent().position().top + enemyHeight ;
    enemyBullets.push( { id:totalEnemyBullets, x:left, y:top});
    totalEnemyBullets++;
}

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
     $("#soundtrack").jPlayer("volume",0.1);
}

function unpauseGame(){
    $("#gameOver").hide();
    $("#pause").hide();

    loop= setInterval(function(){
	refreshWorld();
    },1000/fps);
     $("#soundtrack").jPlayer("volume",1);
}

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

    $("#fire").jPlayer({
	ready: function () {
            $(this).jPlayer("setMedia", {
                mp3: "./media/shoot.mp3"
            })
        },
	volume: 0.3,
	swfPath: "./libs/",
	supplied: "mp3"
    });

    $("#boom").jPlayer({
	ready: function () {
            $(this).jPlayer("setMedia", {
                mp3: "./media/explosion.mp3"
            })
        },
	volume:0.3,
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
	
	player.css('left',x2-(width/2));
    
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
    
    initWorld(true);
    
    
    $("#ticksPerMovement").change(function(){ 
	pausedGame =true;
	stopGame();
	unpauseGame();
	pausedGame =false;
	ticksPerMovement = $(this).val();
    });
    $("#ticksPerSecond").change(function(){ 
	pausedGame =true;
	stopGame();
	unpauseGame();
	pausedGame =false;
	fps = $(this).val();
    });
    $("#verticalSpeed").change(function(){ 
	verticalAdvance = $(this).val();
    });
    $("#horizontalSpeed").change(function(){ 
	horizontalAdvance = $(this).val();
    });

    $("#reset").click(function(){ 
	if(confirm("Are you sure you want to reset? All progress will be lost")){
	    initWorld(true);
	}
    });


    // This is how we move to the next level
    $("#nextLevelLink").click(function(){
	//0 increase firing rate
	//1 increase horizontal speed
	//2 increase vertical speed
	//3 decrease ticks per movement
	firingProbability = firingProbability*2; 
	$("#firingProbability").val(firingProbability);

	ticksPerMovement -= 2;
	$("#ticksPerMovement").val(ticksPerMovement);
	$("#levelCleared").hide();
	initWorld(false);
	
    });

});



function initWorld(reset){
    $(".row,.enemyBullet,.playerBullet").remove();
    $("#gameOver").hide();
    $("#pause").hide();
    
    if(loop){
	clearInterval(loop);
	loop = null;
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
	ticksPerMovement = 40;
	fps = 30;
    
	/* Enemy movements  */
	verticalAdvance = 20;
	horizontalAdvance = 30;
	
	/* Enemy stats */
	firingProbability = 0.01;
    }

    for(var i =0; i<5; i++){
	addRow();
    }
    loop = setInterval(function(){
	refreshWorld();
    },1000/fps);

}

