// https://github.com/public-apis/public-apis
// https://pokeapi.co/
// https://developer.spotify.com/documentation/web-api/

const sprites = document.querySelector(".sprites")


function generateRandomPokemon(){
	// generate random answer Pokemon
	let rightPokemon = 1

	// generate 8 other random Pokemon
	let wrongPokemon = 1
}



// using async and await syntax
async function getPokemon(){
	
	// query must be ID of that Pokemon
	let query = "pikachu" 

	// fetch pokemonData from api
	const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`)
	// fetch returns a promise
	try{
		console.log(response)
		// transform response into json
		let pokemonData = await response.json()
		console.log(pokemonData)

		// get description for answer
		fetchDescription(pokemonData)	

		// display the description of answer pokemon
		displayDescription(pokemonData)

		// display all 9 pokemon in DOM
		displaySprites(pokemonData)


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


async function makeTypeRequest(query){
	const pokeTypeColors = {
		"Psi Pokémon" : "purple",
		"Flame Pokémon": "red"

	}
	// fetch pokemonData from api
	const response = await fetch(`https://pokeapi.co/api/v2/type/ground/`)
	// fetch returns a promise
	try{
		console.log(response)
		let pokemonData = await response.json()
		console.log(pokemonData)
		
	} catch (error){
		console.log("MY ERROR: " +error)
	}
}

getPokemon()


/*
Pokemon quiz
generate random (winning pokemon)
fetch pokemonData.species.url for the description
pokemonData.game_indices limit to old school pokemon

display four option button with 3 random pokemon
	and the winning pokemon that matches the description

add score counter


*/