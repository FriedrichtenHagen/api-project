// https://github.com/public-apis/public-apis
// https://pokeapi.co/
// https://developer.spotify.com/documentation/web-api/

const sprite = document.querySelector(".sprite")
// three states of promises: pending, resolved, rejected

const searchButton = document.querySelector("#searchButton")
searchButton.addEventListener("click", () => {
	// read query from input element
	let query = document.querySelector("#pokeSearch").value.toLowerCase()
	console.log("search query: " + query)

	makeSearchrequest(query)
	makeTypeRequest(query)
})


// using async and await syntax
async function makeSearchrequest(query){
	
	// fetch data from api
	const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`)
	// fetch returns a promise
	try{
		console.log(response)
		let data = await response.json()
		console.log(data)
		displaySprite(data)
		displayName(data)
		fetchDescriptions(data)	
	} catch (error){
		console.log("MY ERROR: " +error)
	}
}

async function fetchDescriptions(data){
	try{
		const pokemonUrl = data.species.url
		const response = await fetch(pokemonUrl)
		let pokemonData = await response.json()
		console.log(pokemonData)
		console.log(pokemonData.genera[7].genus) // english poke type
		
		console.log(pokemonData.flavor_text_entries[0].flavor_text)
	} catch(error){
		console.log("Pokemon Retrieval error: " + error)
	}	
}




async function makeTypeRequest(query){

	const pokeTypeColors = {
		"Psi Pokémon" : "purple",

	}

	// fetch data from api
	const response = await fetch(`https://pokeapi.co/api/v2/type/${query}/`)
	// fetch returns a promise
	try{
		console.log(response)
		let data = await response.json()
		console.log(data)
		
	} catch (error){
		console.log("MY ERROR: " +error)
	}



}




function displayName(data){
	const name = document.querySelector(".name")
	name.textContent = data.name
}


// display the pokemon sprites in the DOM
function displaySprite(data){
	let spriteArray = Object.keys(data.sprites)
	for(let key of spriteArray){
		// only display front facing image
		if(key=== "front_default"){
			if(data.sprites[key]!==null&&typeof(data.sprites[key])!== "object"){
				let newSpriteImage = document.createElement("img")
				newSpriteImage.src = `${data.sprites[key]}`
				sprite.append(newSpriteImage)
			}
		}
	}
}

/*
Pokemon quiz
generate random (winning pokemon)
fetch data.species.url for the description
data.game_indices limit to old school pokemon

display four option button with 3 random pokemon
	and the winning pokemon that matches the description

add score counter


*/