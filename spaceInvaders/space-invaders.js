var player;
var playerBullets;
var totalPlayerBullets = 0;
var loop;
var pausedGame = false;
var maxLeft = 0;
var frame = 0;
var speedAdvance = 5;
var fps = 30;

function spawnRow(){
    var a ='<div class="row entryRow">';
    
    for(var i =0; i<4; i++){
	
	a+='<div class="enemy ';
	if(i==0)
	a+= 'firstEnemy right';
	a+='" health="3"></div>';
    }

    a+='</div>';
    $("body").append(a);
    
    maxLeft = Number($(".entryRow .firstEnemy").css('margin-left').replace('px',''));
    $(".entryRow .firstEnemy").css('margin-left', maxLeft*Math.random());
}

function detectColisions(){
    for(var i = 0; i < playerBullets.length;i++){
	
	var bullet = playerBullets[i];
	a

    }
    
}

function refreshWorld(){
    frame++;
    $(".playerBullets").remove();
    var top = $(".entryRow").css('top').replace('px','');
    if(Number(top) > 80){
	$(".entryRow").removeClass('entryRow');
	spawnRow();
    }
    
    if(frame%speedAdvance == 0){
	
	$(".firstEnemy").each(function(item){
	    var left = Number($(this).css('margin-left').replace('px',''));
	    console.log(left);
	    if($(this).hasClass('right')){
		left+= 10;
		$(this).css('margin-left',left);
		if(left>=maxLeft){
		    $(this).removeClass('right').addClass('left');
		}
	    }
	    
	    if($(this).hasClass('left')){
		left-= 10;
		$(this).css('margin-left',left);
		if(left<=0){
		    $(this).removeClass('left').addClass('right');
		}
	    }
	    
	    
	});
	

	$(".row").each(function(item){
	    var t = Number($(this).css('top').replace('px',''));
	    $(this).css('top',t+1);
	    
	});

	$(".enemy").each(function(){
	    var h = $(this).attr('health');
	    $(this).html(h);
	});
    }
    var remove = new Array();
    _.each(playerBullets, function(e){
	var bullet = $("<div class='playerBullets'></div>").css('left',e.x-2).css("bottom",e.y);
	$("#world").append(bullet);
	e.y = e.y +10;
	if(e.y > $("#world").height()){
	    remove.push(e);
	}
    });
    playerBullets = _.difference(playerBullets,remove);
}

function addPlayerBullet(){
    var pos = Number(player.css('left').replace('px','')) + (player.width()/2);
    playerBullets.push( { id:totalPlayerBullets, x:pos, y:25});
    totalPlayerBullets++;
    refreshWorld();
}

$(document).ready(function(){
    player =  $("#playerIcon");
    playerBullets = new Array();
    spawnRow();
    
    //Manage mouse tracking for player icon
    $(document).mousemove(function(event){
	var x = event.pageX;
	var width = player.width();
	player.css('left',x-(width/2));
    });
    

    //Bullet management
    $(document).click(function(event) {
	addPlayerBullet();
    });

    $(document).keydown(function(event) {
	if(event.which == 32){
	    addPlayerBullet();
	}
	if(event.which == 80){
	    //press 'P'
	    if(pausedGame){
		loop= setInterval(function(){
		    refreshWorld();
		},1000/60);
	    }else{
		alert("Game paused");
		clearInterval(loop);
	    }
	    pausedGame = !pausedGame;
	}
	
    });
    
    loop = setInterval(function(){
	refreshWorld();
    },1000/fps);
});

