const sprites = document.querySelector(".sprites")

// store correctAnswer globaly, so it can be accessed by all functions
let correctAnswerId;
let score = 0;
let selectedLanguage = "en"
const pokemonGenerations = ["gen1","gen2","gen3","gen4","gen5","gen6","gen7","gen8","gen9"]
let currentGeneration = pokemonGenerations[0]

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
	// hard code available languages
	const availableLanguages = ["en","ko", "fr", "de", "es", "it", "ja"]

	// access all available language abreviations e.g. "en"
	const languageSelect = document.querySelector("#language")
	availableLanguages.map(( lang, i) => {
		let opt = document.createElement("option");
		opt.value = lang; 
		opt.textContent = lang;
		languageSelect.append(opt);
	})
	languageSelect.addEventListener("change", ()=> {
		selectedLanguage = languageSelect.value
		console.log(selectedLanguage)
	})
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

const pokemonGenerationMaxId = {
	gen1: 151, 
	gen2: 251,
	gen3: 386,
	gen4: 493,
	gen5: 649,
	gen6: 721, 
	gen7: 809,
	gen8: 905,
	gen9: 1009,
}

function generateRandomPokemon(){
	let numberOfRandomPokemon = 9
	let maximumId = pokemonGenerationMaxId[currentGeneration] 
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

		// remove unnecessary spaces from string
		console.log(validDescriptions[chosenDescription])
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
		if(score === levelScoreBoard.level2){
			// start level 2
			currentGeneration = pokemonGenerations[1]
			updateLevel()
		}


		// refresh description and sprites
		setTimeout(() => {
			startNewQuestion()

		// update score in DOM
		const scoreDiv = document.querySelector(".score")
		scoreDiv.textContent = score
		}, "2000")
	} else{
		spriteImage.classList.add("incorrect")
	}
}
const levelScoreBoard = {
	level2: 5,
	level3: 10, 
	level4: 15,
	level5: 20,
	level6: 25,
	level7: 30,
	level8: 35, 
	level9: 40,
}
function updateLevel(){
	const level = document.querySelector(".generationNumber")
	level.textContent = currentGeneration
}


// activate first question
startNewQuestion()
// fill the select with currently available languages from api
fillLanguageSelect()
/*
cleaning up description
	remove unnecessary spaces from description

prevent duplicate random ids

add minimum id, so that each level only shows the current generation

make language select more beautiful

make different generations different levels
	make star spin when score 10 is reached
	display current Gen

add error handeling
*/