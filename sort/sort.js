/***

I chose quicksort for the sorting algoritm as it has fairly 
small asociated constants, is done in-site which allows for lower memory consumption
and allows cache usage. Quick sort is O(n log n) which is known to be the optimal order 
for sorting arrays. 

The tests set up in sort.html show how this algorithm is high scalable sorting 
random arrays of up to 1.000.000 items in under a second on a 

2GHz Intel Core i7 with 8gb of ram....

Mind you this is being ran in a browser. 
It would probably be faster if ran as a library for a node program


***/


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







