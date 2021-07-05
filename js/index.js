const pokemonContainer = document.querySelector('.pokemon-container');
const spinner = document.querySelector('#spinner');
const next = document.querySelector('#next');
const previous = document.querySelector('#previous');

let base = 1;
let limit = 8;

const createCardPokemon = (pokemon) => {
  const card = document.createElement("div");
  card.classList.add("pokemon-block");

  const spriteContainer = document.createElement("div");
  spriteContainer.classList.add("img-container");

  const sprite = document.createElement("img");
  sprite.src = pokemon.sprites.front_default;

  spriteContainer.appendChild(sprite);

  const number = document.createElement("p");
  number.textContent = `#${pokemon.id.toString().padStart(3, 0)}`;

  const name = document.createElement("p");
  name.classList.add("name");
  name.textContent = pokemon.name;

  card.appendChild(spriteContainer);
  card.appendChild(number);
  card.appendChild(name);

  const cardBack = document.createElement("div");
  cardBack.classList.add("pokemon-block-back");
  cardBack.appendChild(progressBars(pokemon.stats));

  const cardContainer = document.createElement("div");
  cardContainer.classList.add("card-container");
  cardContainer.appendChild(card);
  cardContainer.appendChild(cardBack);

  const flipCard = document.createElement("div");
  flipCard.classList.add("flip-card");
  flipCard.appendChild(cardContainer);

  pokemonContainer.appendChild(flipCard);
}

const progressBars = (stats) => {
  const statsContainer = document.createElement("div");
  statsContainer.classList.add("stats-container");

  for (let stat of stats) {
    const statBase = stat.base_stat;
    const statMaximo = 225;

    const statContainer = document.createElement("div");
    statContainer.classList.add("stat-container");

    const statName = document.createElement("p");
    statName.textContent = stat.stat.name;

    const progress = document.createElement("div");
    progress.classList.add("progress");

    const progressBar = document.createElement("div");
    progressBar.classList.add("progress-bar");
    progressBar.classList.add("progress-bar-striped");
    progressBar.classList.add("progress-bar-animated");
    if (stat.stat.name == 'hp') {
      progressBar.classList.add("bg-danger");
    } else {
      if (stat.stat.name == 'attack') {
        progressBar.classList.add("bg-info");
      } else {
        if (stat.stat.name == 'defense' || stat.stat.name == 'special-defense') {
          progressBar.classList.add("bg-success");
        } else {
          if (stat.stat.name == 'speed') {
            progressBar.classList.add("bg-warning");
          }
        }
      }
    }
    progressBar.setAttribute("role", "progressbar");
    progressBar.setAttribute("aria-valuenow", statBase);
    progressBar.setAttribute("aria-valuemin", 0);
    progressBar.setAttribute("aria-valuemax", statMaximo);
    progressBar.style.width = `${statBase / statMaximo * 100}%`;
    progressBar.textContent = statBase;

    progress.appendChild(progressBar);

    statContainer.appendChild(statName);
    statContainer.appendChild(progress);

    statsContainer.appendChild(statContainer);
  }

  return statsContainer;
}

const fetchPokemon = (id) => {
  fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
    .then((respuesta) => respuesta.json())
    .then((data) => {
      createCardPokemon(data);
      spinner.style.display = "none";
    });
}

const fetchPokemons = (base, limit) => {
  spinner.style.display = "block";
  for (let i = base; i <= base + limit; i++) {
    fetchPokemon(i);
  }
}

next.addEventListener("click", () => {
  base += 9;
  removeChildNodes(pokemonContainer);
  fetchPokemons(base, limit);
});

previous.addEventListener("click", () => {
  if (base > 1) {
    base -= 9;
    removeChildNodes(pokemonContainer);
    fetchPokemons(base, limit);
  } else {
    alert('Está en la primera página');
  }
});

const removeChildNodes = (parent) => {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

fetchPokemons(base, limit);