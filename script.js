// https://github.com/public-apis/public-apis
// https://pokeapi.co/
// https://developer.spotify.com/documentation/web-api/



new Promise(function(resolve, reject) {
	// A mock async action using setTimeout
	setTimeout(function() { reject(10); }, 3000);
})
.then(function(num) { console.log('second then: ', num); return num * 2; })
.then(function(num) { console.log('last then: ', num);})
.catch(function(num){
    console.log("catch: ", num)
})
.finally(res => { console.log("finally") });

throw Error ("bad parameters")
var request1 = fetch('/users.json');
var request2 = fetch('/articles.json');

Promise.all([request1, request2]).then(function(results) {
	// Both promises done!
});


// split-callback design as an example, similiar to Promise in ES6
function success(data) {
	console.log( data );
}

function failure(err) {
	console.error( err );
}
ajax( "http://some.url.1", success, failure );