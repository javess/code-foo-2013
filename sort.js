


function sort(a){
    quickSort(a,0,a.length-1);
}

function quickSort(a,lo,hi){
    if(hi <= lo) return;
    var j = partition(a,lo,hi);
    quickSort(a,lo,j-1);
    quickSort(a,j+1,hi);    
}

function partition(a,lo,hi){
    var i = lo;
    var j = hi+1;
    var v = a[lo].score;
    while(true){
	while(a[++i].score < v){	
	    if(i == hi) break;
	}
	while(v < a[--j].score){
	    if(j == lo) break;
	}
	if( i >= j) break;
	
	swap(a,i,j);
    }
    swap(a,lo,j);
    return j;
}

function swap(a,i,j){
    var tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
}

var a = []; 







var items = 1;
for(var j = 1; j < 7; j++){
    var items = items * 10;
    document.write('Creating random array of size: ' +items + '<br/>')
    var initArray = new Date();
    //Generate random array of size arrayLength
    for(var i = 0; i< items ; i++){
	a.push({score:Math.random()*100, name:'item ' + i});
	
    }
    var endArray = new Date();
    document.write('Array created in ' +(endArray - initArray)+'ms<br/>');
    var init = new Date();
    sort(a);
    var end = new Date();
    document.write('Array of size: ' +items + ' ordered in ' + (end-init) + 'ms<hr/>');

}




