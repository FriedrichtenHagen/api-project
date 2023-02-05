const sprites = document.querySelector(".sprites")

// store correctAnswer globaly, so it can be accessed by all functions
let correctAnswerId;
let score = 0;
let selectedLanguage = "en"

function startNewQuestion(){
	// clear field of all previous sprites
	clearSprites()
	// generate array of 9 random Pokemon ids
	let randomPokemonArray = generateRandomPokemon()

	// fetch API for correctAnswerId and display description
	getPokemon(correctAnswerId, true)
	
	// fetch and display all 9 sprites
	getAllSprites(randomPokemonArray)

}

async function fillLanguageSelect(){
	const response = await fetch(`https://pokeapi.co/api/v2/language/`)
		try{
			let languageResponse = await response.json()
			let availableLanguages = languageResponse.results.map(function(a) {return a.name;});
			console.log(availableLanguages)

			// access all available language abreviations e.g. "en"
			const languageSelect = document.querySelector("#language")
			availableLanguages.map(( lang, i) => {
				let opt = document.createElement("option");
				opt.value = lang; // the index
				opt.textContent = lang;
				languageSelect.append(opt);
			})
			languageSelect.addEventListener("change", ()=> {
				selectedLanguage = languageSelect.value
				console.log(selectedLanguage)
			})
		}catch{
			
		}
}

function clearSprites(){
	while (sprites.firstChild) {
		sprites.removeChild(sprites.lastChild);
	}
}

async function getAllSprites(randomPokemonArray){
	for(element of randomPokemonArray) {
		const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${element}`)
		try{
			let singlePokemonResponse = await response.json()
			console.log(singlePokemonResponse)
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
	let randomNumber = Math.floor(Math.random()*numberOfRandomPokemon)

	correctAnswerId = randomPokemonArray[randomNumber]
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
		
		// iterate over flavor_text array to keep all entries in selected language
		let validDescriptions = [];
		pokemonSpeciesJson.flavor_text_entries.forEach(element => {
			if(element.language.name===selectedLanguage){
				validDescriptions.push(element.flavor_text)
			}
		});
		// choose random description from validDescriptions
		let chosenDescription = Math.floor(Math.random()*validDescriptions.length)

		displayDescription(validDescriptions[chosenDescription])

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
		const scoreDiv = document.querySelector(".score")
		scoreDiv.textContent = score
	} else{
		spriteImage.classList.add("incorrect")
	}
}



// activate first question
startNewQuestion()
// fill the select with currently available languages from api
fillLanguageSelect()
/*
cleaning up description
		enable language modes (also korean)
	remove unnecessary spaces from description

prevent duplicate random ids


make different generations different levels

add error handeling
*/