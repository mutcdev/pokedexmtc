const pokemonImage = document.querySelector('.pokemon_image')
const pokemonNumber = document.querySelector('.pokemon_number')
const pokemonName = document.querySelector('.pokemon_name')
const form = document.querySelector('.form')
const input = document.querySelector('.input_search')
const btnPrev = document.querySelector('.btn_prev')
const btnNext = document.querySelector('.btn_next')
const pokemonType = document.querySelector('.pokemon_type')
const pokemonHeight = document.querySelector('.pokemon_height')
const pokemonWeight = document.querySelector('.pokemon_weight')
const pokemonAblities = document.querySelector('.pokemon_ablities')

const typeIcons = {
    normal: '⚪',
    fire: '🔥',
    water: '💧',
    electric: '⚡',
    grass: '🌿',
    ice: '❄️',
    fighting: '🥊',
    poison: '☠️',
    ground: '🌍',
    flying: '🕊️',
    psychic: '🔮',
    bug: '🐛',
    rock: '🪨',
    ghost: '👻',
    dragon: '🐉',
    dark: '🌑',
    steel: '⚙️',
    fairy: '🌸'
}

let currentId = 25;

async function searchPokemon(pokemon){
    try{
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)

        if (!response.ok){
            pokemonName.textContent='Not Found'
            return
        }

        const data = await response.json();

        currentId = data.id;

        pokemonImage.src = data.sprites.versions['generation-v']['black-white'].animated.front_default
        pokemonNumber.textContent = `#${data.id}`
        pokemonName.textContent = data.name
        
        pokemonType.textContent = ''
        data.types.forEach(t => {
            const type = t.type.name
            const icon = typeIcons[type] || '❓'
            pokemonType.textContent += `${type} ${icon}`
        })

        pokemonHeight.textContent = data.height / 10
        pokemonWeight.textContent = data.weight / 10
    }
    catch (error){
        pokemonName.textContent='Error'
        console.log('Erro: ', error)
    }
}

form.addEventListener('submit', (event) => {
    event.preventDefault()
    const value=input.value.toLowerCase().trim()
    if (value) searchPokemon(value)
})

btnPrev.addEventListener('click', () => {
    if (currentId>1) searchPokemon(currentId-1)
})

btnNext.addEventListener('click', () => {
    searchPokemon(currentId+1)
})

searchPokemon(25)
