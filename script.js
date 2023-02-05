// https://github.com/public-apis/public-apis
// https://pokeapi.co/
// https://developer.spotify.com/documentation/web-api/

const sprites = document.querySelector(".sprites")


function startNewQuestion(){
	// generate array of 9 random Pokemon ids
	let randomPokemonArray = generateRandomPokemon()
	// first pokemon in array is chosen as correct answer
	let correctAnswerId = randomPokemonArray[0]
	console.log(correctAnswerId)

	// fetch API for correctAnswerId
	let correctAnswerData = getPokemon(correctAnswerId, true)
	
	// fetch API for correctAnswerDescription
	fetchDescription(correctAnswerData)




}

// activate first question
startNewQuestion()


function generateRandomPokemon(){
	// generate random answer Pokemon
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
		let randomPokemonId = Math.floor(Math.random()*maximumId)
		randomPokemonArray.push(randomPokemonId)
	}
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
	let spriteArray = Object.keys(pokemonData.sprites)
	for(let key of spriteArray){
		// only display front facing image
		if(key=== "front_default"){
			if(pokemonData.sprites[key]!==null&&typeof(pokemonData.sprites[key])!== "object"){
				let newSpriteImage = document.createElement("img")
				newSpriteImage.src = `${pokemonData.sprites[key]}`
				sprites.append(newSpriteImage)
			}
		}
	}
}






/*
Pokemon quiz
generate random (winning pokemon)
fetch pokemonData.species.url for the description
pokemonData.game_indices limit to old school pokemon

display four option button with 3 random pokemon
	and the winning pokemon that matches the description

add score counter


*/