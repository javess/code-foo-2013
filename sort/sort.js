/***

I chose quicksort for the sorting algoritm as it has fairly 
small asociated constants, is done in-site which allows for lower memory consumption
and allows cache usage. Quick sort is O(n log n) which is known to be the optimal order 
for sorting arrays. 

The tests set up in sort.html show how this algorithm is high scalable sorting 
random arrays of up to 1.000.000 items in under a second on a 

2GHz Intel Core i7 with 8gb of ram....

Mind you this is being run on a browser. 
It would probably be faster if ran as a library for a node program

This algorithm can be generalized by passing a comparer function as a parameter. 
However it seemed hardly worth it for this specific case


***/




//Just a nice function wrapper to avoid adding the extra indexes on the user side
function sort(a){
    quickSort(a,0,a.length-1);
}


//quick sort method driver
function quickSort(a,lo,hi){
    if(hi <= lo) return;
    var j = partition(a,lo,hi);
    //Sort lower part
    quickSort(a,lo,j-1);
    //Sort higher part
    quickSort(a,j+1,hi);    
}


//Partition array a from lo to hi
function partition(a,lo,hi){
    var i = lo;
    var j = hi+1;

    //Pivot value
    var v = a[lo].score;
    
    while(true){
	//increase i until we hit the pivot or the hi
	while(a[++i].score < v){	
	    if(i == hi) break;
	}
	//decrease j until we hit the pivot or the lo
	while(v < a[--j].score){
	    if(j == lo) break;
	}
	
	//if the index crossed get out
	if( i >= j) break;
	
	//if we found items that can be swapped go ahead and swap them
	swap(a,i,j);
    }
    
    //swap the pivot
    swap(a,lo,j);
    return j;
}

//swap two elements in array
// a= array
// i= index 1
// j = index 2
function swap(a,i,j){
    var tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
}

var a = []; 







