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
const sprite = document.querySelector(".sprite")
// three states of promises: pending, resolved, rejected

// fetch data from api
fetch("https://pokeapi.co/api/v2/pokemon/blastoise")
	// fetch returns a promise
	.then((res)=> {
		console.log(res)
		res.json().then((data)=>{
			console.log(data.sprites)
			displaySprites(data)		
		})
	})
	.catch((err)=>{
		console.log(err)
	})

// display the pokemon sprites in the DOM
function displaySprites(data){
	let spriteArray = Object.keys(data.sprites)
	console.log(spriteArray)
	
	for(let key of spriteArray){
		console.log(key + " -> " + data.sprites[key])
		if(data.sprites[key]!==null&&typeof(data.sprites[key])!== "object"){
			let newSpriteImage = document.createElement("img")
			newSpriteImage.src = `${data.sprites[key]}`
			sprite.append(newSpriteImage)
		}
	}
}