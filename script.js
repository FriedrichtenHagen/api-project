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

const searchButton = document.querySelector("#searchButton")
searchButton.addEventListener("click", makeSearchrequest)

function makeSearchrequest(){
	// read query from input element
	let query = document.querySelector("#pokeSearch").value.toLowerCase()
	console.log("search query: " + query)
	// fetch data from api
	fetch(`https://pokeapi.co/api/v2/pokemon/${query}`)
	// fetch returns a promise
	.then((response)=> {
		console.log(response)
		response.json().then((data)=>{
			console.log(data)
			displaySprite(data)
			displayName(data)		
		})
	})
	.catch((err)=>{
		console.log(err)
	})
}

function displayName(data){
	const name = document.querySelector(".name")
	name.textContent = data.name
}


// display the pokemon sprites in the DOM
function displaySprite(data){
	let spriteArray = Object.keys(data.sprites)

	for(let key of spriteArray){
		// only display front facing images
		if(key.includes("front")){
			if(data.sprites[key]!==null&&typeof(data.sprites[key])!== "object"){
				let newSpriteImage = document.createElement("img")
				newSpriteImage.src = `${data.sprites[key]}`
				sprite.append(newSpriteImage)
				
			}
		}
	}
}