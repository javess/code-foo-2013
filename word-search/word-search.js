var matrix = ['xntgjhealthuskbwasta',
'soujynzwxbtgmvybolah',
'htiltsleqdcrandrpxzb',
'pshepbnorebazookasbu',
'lidnolyprvasjppjosrd',
'ievyrumgbelsgrylhcxz',
'ahmhonkilltacularoby',
'boieqdonsybsotxograp',
'howiteuzatysedobfevs',
'aiscarkaeidisichiopt',
'odbadbohdrynylevelae',
'ldkuiujiregsdasqabgv',
'diucbstadlklhyaspile',
'vojcishjgodyoomgolds',
'wrilkdbglayiristgxgm',
'ltscragahdesdqbahwdo',
'healtirnofuyealwyehm',
'fmushroomehappindrto',
'lhfhpyonukacolaorebv',
'parelzddkaprotomanpl',
'mjopouyomlqualinldwy',
'wapanyrrrjyoahznixem',
'mlsriwhftinogrolseys',
'lyldnikuoydluowukdeo',
'oyoqyakdjeblunderscu'];

var Words =
[
'Health',
'Score',
'Zerg',
'Assassin',
'Reload',
'Pylon',
'Level',
'Bazooka',
'Blunderbuss',
'Killtacular',
'Heist',
'Duck',
'Halo',
'Mushroom',
'Horde',
'Ganondorf',
'Protoman',
'Hydralisk',
'Shepard',
'NukaCola',
'Plasmid',
'Would you kindly',
'Metroid',
'Xin Zhao'];

var colors=["red","green","blue", "black"];

var hash = new Array();

//Create a letter hash for easy access to initial letters of words
function createHash(){
    
    for(var i = 0; i < matrix.length; i++){
	for(var j = 0; j < matrix[i].length; j++){
	    
	    if(!hash[matrix[i][j]]){
		hash[matrix[i][j]] = new Array();
	    }	
	    hash[matrix[i][j]].push([i,j]);
	}
    }
}


//Search for a word. Returns if a word was found and in which positions
function findWord(word,index,x,y, direction, positions){


    var char = word[index];
    if(index == word.length){
	positions.push([x,y]);
	return {found:true, positions:positions}
	
    }else if(index == 0){
	var inits = hash[char];
	var result;
	
	for(var i =0; i<inits.length; i++){
	    for(var k = -1; k<=1; k++){
		for(var j = -1; j<=1; j++){
		    if(j==0 && i==0)
			continue;
		    result = findWord(word,index+1, inits[i][0], inits[i][1], 
				      [k,j], []);
		    if(result.found){
			return result;
		    }
		}
	    }
	    
	    if(result.found){
		return result;
		break;
	    }
	}
	return {found:false, positions:positions};
    }else{
	positions.push([x,y]);
	//Check if next word in in the matrix and if character matches necesary values
 	if ( (x+direction[0]) >= 0 && 
	     (x+direction[0])< matrix.length && 
	     (y+direction[1]) >= 0 && 
	     (y + direction[1]) < matrix[x+direction[0]].length &&
	     char == matrix[x+direction[0]][y+direction[1]]){
	    return findWord(word, index+1, x+direction[0], y+direction[1], direction, positions);
	}
	return {found:false, positions:positions};
    }
    
}


//Display method
function printMatrix(){
    for(var i = 0; i<matrix.length;i++){
	for(var j = 0; j<matrix[i].length;j++){
	    document.write("<span id='l-"+i+"-"+j+"' class='letter'>"+matrix[i][j]+"</span>");
	}
	document.write("<br/>");
    }
}

//Word highlighting
function highlightWord(positions, color){
    for(var i = 0; i<positions.length; i++){
	var d = document.getElementById("l-"+positions[i][0]+"-"+positions[i][1]);
	d.className = d.className + " inword " + color;
    }
}

createHash();
printMatrix();


for(var i =0; i<Words.length; i++){
    var word= Words[i].toLowerCase().replace(/\s+/g, '');
    var result = findWord(word,0);
    if(result.found){
	console.log(word);
	highlightWord(result.positions, colors[i%colors.length]);
    }else{
	console.log(word + " not found!");
    }
}


