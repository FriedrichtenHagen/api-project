// https://github.com/public-apis/public-apis
// https://pokeapi.co/
// https://developer.spotify.com/documentation/web-api/

const sprites = document.querySelector(".sprites")

// store correctAnswer globaly, so it can be accessed by all functions
let correctAnswerId;
let score;

function startNewQuestion(){
	// clear field of all previous sprites

	while (sprites.firstChild) {
		sprites.removeChild(sprites.lastChild);
	}
	// generate array of 9 random Pokemon ids
	let randomPokemonArray = generateRandomPokemon()

	// fetch API for correctAnswerId and display description
	getPokemon(correctAnswerId, true)
	
	// fetch and display all 9 sprites
	getAllSprites(randomPokemonArray)

}

async function getAllSprites(randomPokemonArray){
	for(element of randomPokemonArray) {
		const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${element}`)
		try{
			let singlePokemonResponse = await response.json()
			console.log(singlePokemonResponse)
			console.log("cool")
			displaySprites(singlePokemonResponse)
		}catch{
			
		}
	}
}

function generateRandomPokemon(){
	let numberOfRandomPokemon = 9
	let maximumId = 151 // limits the pokemon to first generation
	/*
	Pokemon Generation Ids
	1-151 Gen 1
	152-251 Gen 2
	252-386 Gen 3
	387-493 Gen 4
	494-649 Gen 5
	650-721 Gen 6
	722-809 Gen 7
	810-905 Gen 8
	906-1009 Gen 9
	*/ 
	let randomPokemonArray = []

	for(let i=0; i<numberOfRandomPokemon; i++){
		let randomPokemonId = Math.floor(Math.random()*maximumId+1)
		randomPokemonArray.push(randomPokemonId)
	}
	// decide which pokemon is the correct answer (1-numberOfRandomPokemon)
	let randomNumber = Math.floor(Math.random()*numberOfRandomPokemon+1)

	correctAnswerId = randomPokemonArray[randomNumber]
	console.log(correctAnswerId)

	console.log(randomPokemonArray)
	return randomPokemonArray
}

// using async and await syntax
async function getPokemon(id, isCorrect){
	// fetch pokemonData from api
	const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
	// fetch returns a promise
	try{
		let pokemonData = await response.json()
		console.log(pokemonData)
		// get and display the description for correct answer
		if(isCorrect){
			// fetch and display the description
			fetchDescription(pokemonData)
		}
	} catch (error){
		console.log("MY ERROR: " +error)
	}
}

async function fetchDescription(pokemonData){
	try{
		const pokemonUrl = pokemonData.species.url
		const response = await fetch(pokemonUrl)
		let pokemonSpeciesJson = await response.json()
		console.log(pokemonSpeciesJson)
		
		displayDescription(pokemonSpeciesJson.flavor_text_entries[0].flavor_text)

	} catch(error){
		console.log("Pokemon Retrieval error: " + error)
	}	
}
function displayDescription(speciesDescription){
	const name = document.querySelector(".description")
	name.textContent = speciesDescription
}



// display the pokemon sprites in the DOM
function displaySprites(pokemonData){
	let currentId = pokemonData.id
	let spriteArray = Object.keys(pokemonData.sprites)
	for(let key of spriteArray){
		// only display front facing image
		if(key=== "front_default"){
			if(pokemonData.sprites[key]!==null&&typeof(pokemonData.sprites[key])!== "object"){
				let newSpriteImage = document.createElement("img")
				newSpriteImage.src = `${pokemonData.sprites[key]}`
				newSpriteImage.classList.add("sprite")
				sprites.append(newSpriteImage)

				// add eventlistener for click
				newSpriteImage.addEventListener("click", ()=> {
					evaluateClick(newSpriteImage, currentId) 
				})
			}
		}
	}
}

function evaluateClick(spriteImage, currentId){
	console.log(currentId, correctAnswerId)
	if(currentId===correctAnswerId){
		spriteImage.classList.add("correct")
		// increase score
		score++
		// check if new level is reached

		// refresh description and sprites
		setTimeout(() => {
			startNewQuestion()
		}, "2000")
		
		// update score in DOM

	} else{
		spriteImage.classList.add("incorrect")
	}
}



// activate first question
startNewQuestion()

/*
cleaning up description
	only display english descriptions
		enable language modes (also korean)
	remove unnecessary spaces from description

prevent duplicate random ids


add score counter
make different generations different levels

*/