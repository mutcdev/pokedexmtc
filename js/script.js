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
const btnFavorite = document.querySelector('.btn_favorite')
const btnViewFav = document.querySelector('.btn_viewFav')

const statBars = {
    hp: document.querySelector('.hp'),
    attack: document.querySelector('.attack'),
    defense: document.querySelector('.defense'),
    "special-attack": document.querySelector('.spAttack'),
    "special-defense": document.querySelector('.spDefense'),
    speed: document.querySelector('.speed')
}

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
let favorites = JSON.parse(localStorage.getItem('favorite')) || []
let indexFavs = 0
let favMode = false
let lastPoke = 25

btnFavorite.addEventListener('click', favoritePoke)
btnViewFav.addEventListener('click', viewFavorites)

async function searchPokemon(pokemon){
    try{
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)

        if (!response.ok){
            pokemonName.textContent='Not Found'
            return
        }

        const data = await response.json();

        currentId = data.id;

        const gif = pokemonImage.src = data.sprites.versions['generation-v']['black-white'].animated.front_default

        if (gif){
            pokemonImage.src=gif
        }else{
            pokemonImage.src=data.sprites.front_default
        }
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

        if (favorites.includes(data.name)){
            btnFavorite.classList.add('active')
        }else{
            btnFavorite.classList.remove('active')
        }
        if (!favMode){
            lastPoke = data.id
        }

        data.stats.forEach(stat => {
            const nameS = stat.stat.name
            const value = stat.base_stat

            const percent = (value/255) * 100

            if (statBars[nameS]){
                statBars[nameS].style.width = percent + '%'
                statBars[nameS].style.background = getColor(value)
            }
        })
        pokemonAblities.textContent=''

        data.abilities.forEach(a => {
            const nameA = a.ability.name
            pokemonAblities.textContent += nameA + ' • '
        })
    }
    catch (error){
        pokemonName.textContent='Error'
        console.log('Error: ', error)
    }
}

function getColor(value){
    if (value < 50) return 'red'
    if (value <100) return 'orange'
    if (value <150) return 'yellow'
    return 'rgb(7, 228, 198)'
}

function favoritePoke(){
    const name = pokemonName.textContent
    
    if (favorites.includes(name)){
        favorites = favorites.filter(f => f !== name)
        btnFavorite.classList.remove('active')
    }else{
        favorites.push(name)
        btnFavorite.classList.add('active')
    }
    
    localStorage.setItem('favorite', JSON.stringify(favorites))
    
}

function viewFavorites(){
    if (favMode){
        favMode = false
        btnViewFav.textContent = 'View Favorites'
        searchPokemon(lastPoke)
    }else{
        if (favorites.length > 0){
        favMode=true
        indexFavs=0
        btnViewFav.textContent = 'Exit Favorites'
        searchPokemon(favorites[0])
        }else{
            alert('No favorites yet')
        }
    }
    
    
}

form.addEventListener('submit', (event) => {
    favMode=false
    event.preventDefault()
    const value=input.value.toLowerCase().trim()
    if (value) searchPokemon(value)
})

btnPrev.addEventListener('click', () => {
    if (favMode){
        if (indexFavs > 0){
            indexFavs--
            searchPokemon(favorites[indexFavs])}
    }else{
        if (currentId>1) searchPokemon(currentId-1)
    }
})

btnNext.addEventListener('click', () => {
    if (favMode){
        if (indexFavs < favorites.length -1){
            indexFavs++
            searchPokemon(favorites[indexFavs])}
    }else{
    searchPokemon(currentId+1)
    }
})



searchPokemon(25)