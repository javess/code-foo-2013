//Define family tree class

function FamilyTree(){
    
    //Generations stored by level
    this.generation = new Array();
    
    //Add member to family tree
    this.addMember = function(member){
	if(!this.generation[member.generation]){
	    this.generation[member.generation] = new Array();	    
	    
	}
	this.generation[member.generation].push(member);
    }

    //Does a somewhat smart search in the family tree
    this.findMember = function(name, g){
	if(name==null && g ==null){
	    console.log("No search specified. Returning whole tree.");
	    return this;
	}else if(g == null){
	    var matchedItems = new Array();
	    
	    
	    for(var i in  this.generation){
		for(var j =0; j< this.generation[i].length; j++){
		    
		    if(this.generation[i][j].name.toLowerCase().indexOf(name.toLowerCase()) >=0)
		    {
			//Filter matched			 
			matchedItems.push(this.generation[i][j]);


		    }		
		}
		
	    }
	    return matchedItems;
	}else{
	    var items = this.generation[g];
	    var matchedItems = new Array();
	    for(var i =0; i< items.length; i++){
		if(name == null ||//No filter for names
		   items[i].name.toLowerCase().indexOf(name.toLowerCase()) >=0 //Filter matched
		  ){
		    matchedItems.push(items[i]);
		}
		
	    }
	    return matchedItems;
	}
    }
    
}

//Class for family member. Generation can be forced but is normally derived from that of the parents
function FamilyMember(name, father,mother, generation){
    this.father = null;    
    var fatherGen = -1;
    var motherGen = -1;
    if(father){
	fatherGen = father.generation;
	father.addChildren(this)
	this.father = father;
    }
    this.mother = null;
    if(mother){
	motherGen = mother.generation;
	mother.addChildren(this);
	this.mother = mother;
    }
    this.name = name;
    if(this.father == null && this.mother == null){
	this.generation = 1;
    }else{

	this.generation = 
	    fatherGen > motherGen?
	    fatherGen+1:motherGen+1;
    }
    
    if(generation){
	this.generation = generation;
    }
    this.children= new Array();
    this.addChildren = function(child){
	this.children.push(child);
    }
}



//In any case where a non-family member is added they would inherit their generation from that of the person he/she is marrying
var tree = new FamilyTree();
//Generation 1
var Richard = new FamilyMember('Rickard Stark');
tree.addMember(Richard);

//Generation 2
var Benjen = new FamilyMember('Benjen Stark', Richard);
var Brandon = new FamilyMember('Brandon Stark', Richard);
var Lyanna = new FamilyMember('Lyanna Stark', Richard);
var Ned = new FamilyMember('Eddard Stark',Richard);

tree.addMember(Benjen);
tree.addMember(Brandon);
tree.addMember(Lyanna);
tree.addMember(Ned);


//Marrying from the outside
var Cat = new FamilyMember('Catelyn Tully',null,null,2);
tree.addMember(Cat);

//Generation 3
var Robb  = new FamilyMember('Robb Stark',Ned,Cat);
var Sansa  = new FamilyMember('Sansa Stark',Ned,Cat);
var Arya   = new FamilyMember('Arya Stark',Ned,Cat);
var Bran  = new FamilyMember('Bran Stark',Ned,Cat);
var Rickon = new FamilyMember('Rickon Stark',Ned,Cat);

tree.addMember(Robb);
tree.addMember(Sansa);
tree.addMember(Arya);
tree.addMember(Bran);
tree.addMember(Rickon);

//Bastard child of Ned Star
var Jon = new FamilyMember('Jon Snow',Ned);
tree.addMember(Jon);

//Generation 4
var JonJr = new FamilyMember('Jon Stark',Jon);
tree.addMember(JonJr);
var CatJr = new FamilyMember('Catelyn Snow',Jon);
tree.addMember(CatJr);




console.log('Full family tree');
console.log(tree);

console.log('Generation 1');
console.log(tree.findMember(null, 1));
console.log('Generation 2');
console.log(tree.findMember(null, 2));
console.log('Generation 2 Filter name = "Edd" ');
console.log(tree.findMember('Edd', 2));
console.log('No generation gilter name = "Cat" ');
console.log(tree.findMember('Cat', null));

console.log('No filter');
console.log(tree.findMember(null, null));
