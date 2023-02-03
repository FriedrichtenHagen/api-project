// https://github.com/public-apis/public-apis
// https://pokeapi.co/
// https://developer.spotify.com/documentation/web-api/


/*
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
*/

let test;
const sprite = document.querySelector(".sprite")

// three states of promises: pending, resolved, rejected

fetch("https://pokeapi.co/api/v2/pokemon/ditto")
	// fetch returns a promise
	.then((res)=> {
		console.log(res)
		res.json().then((data)=>{
			console.log(data)		
			sprite.src= data.sprites.back_default
		})
	})
	.catch((err)=>{
		console.log(err)
	})

