const sprites = document.querySelector(".sprites")

// store correctAnswer globaly, so it can be accessed by all functions
let correctAnswerId;
let score = 0;
let selectedLanguage = "en"
const pokemonGenerations = ["Generation 1","Generation 2","Generation 3","Generation 4","Generation 5","Generation 6","Generation 7","Generation 8","Generation 9"]
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
		startNewQuestion()
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
		}catch(error){
			console.log(`getting Sprites: ${error}`)
		}
	}
}

const pokemonGenerationId = {
	"Generation 1": {min: 1, max: 151}, 
	"Generation 2": {min: 152, max: 251},
	"Generation 3": {min: 252, max: 386},
	"Generation 4": {min: 387, max: 493},
	"Generation 5": {min: 494, max: 649},
	"Generation 6": {min: 650, max: 721},
	"Generation 7": {min: 722, max: 809},
	"Generation 8": {min: 810, max: 905},
	// "Generation 9": {min: 906, max: 1008},
}

function generateRandomPokemon(){
	let numberOfRandomPokemon = 9
	let minimumId = pokemonGenerationId[currentGeneration].min
	let maximumId = pokemonGenerationId[currentGeneration].max
	let randomPokemonArray = []

	for(let i=0; i<numberOfRandomPokemon; i++){
		
		let randomPokemonId = Math.floor(Math.random()*(maximumId-minimumId+1)+minimumId)
		// check if random Id already exists in randomPokemonArray (to prevent duplicates)
		while((randomPokemonArray.includes(`${randomPokemonId}`))){
			randomPokemonId = Math.floor(Math.random()*(maximumId-minimumId+1)+minimumId)
		}
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
		// refresh description and sprites
		setTimeout(() => {

			// check if new level is reached
			switch(score){
				case levelScoreBoard.level2:
					// start level 2
					currentGeneration = pokemonGenerations[1]
					updateLevel()
					break;
				case levelScoreBoard.level3:
					currentGeneration = pokemonGenerations[2]
					updateLevel()
					break;
				case levelScoreBoard.level4:
					currentGeneration = pokemonGenerations[3]
					updateLevel()
					break;
				case levelScoreBoard.level5:
					currentGeneration = pokemonGenerations[4]
					updateLevel()
					break;
				case levelScoreBoard.level6:
					currentGeneration = pokemonGenerations[5]
					updateLevel()
					break;
				case levelScoreBoard.level7:
					currentGeneration = pokemonGenerations[6]
					updateLevel()
					break;
				case levelScoreBoard.level8:
					currentGeneration = pokemonGenerations[7]
					updateLevel()
					break;
				// case levelScoreBoard.level9:
				// 	currentGeneration = pokemonGenerations[8]
				// 	updateLevel()
				// 	break;
			}
			startNewQuestion()

		// update score in DOM
		const scoreDiv = document.querySelector(".score")
		scoreDiv.textContent = score
		}, "1000")
	} else{
		spriteImage.classList.add("incorrect")
	}
}
const levelScoreBoard = {
	level2: 1,
	level3: 2, 
	level4: 3,
	level5: 4,
	level6: 5,
	level7: 6,
	level8: 7, 
	// level9: 8,
}
function updateLevel(){
	const level = document.querySelector(".generation")
	level.textContent = currentGeneration
	// generation animation
	level.classList.add("grow")

	// pokestar animation
	const pokeStar = document.querySelector(".pokeStar")
	pokeStar.classList.add("spin")

	setTimeout(()=>{
		// remove animation classes
		pokeStar.classList.remove("spin")
		level.classList.remove("grow")
	}, 1000)
}


// activate first question
startNewQuestion()
// fill the select with currently available languages from api
fillLanguageSelect()



/*
cleaning up description
	remove unnecessary spaces from description \n \f ?

make language select more beautiful

add a start page with prof oak explaining the rules
add a success page after level 8
add an open categorie after level 8
*/