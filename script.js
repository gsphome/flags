// Obtener referencias a los elementos HTML
const flagImage = document.getElementById('flagImage');
const countryInfo = document.getElementById('countryInfo');
const startButton = document.createElement('button');
const teamsContainer = document.createElement('div');
const redCounter = document.createElement('div');
const blueCounter = document.createElement('div');
const greenCounter = document.createElement('div');
const continentFilter = document.getElementById('continentFilter');
const sovereignFilter = document.getElementById('sovereignFilter');
const maxCountriesInput = document.createElement('input');
const filterContainer = document.createElement('div'); // Contenedor para el combobox y el input

// Variables globales
let flags = []; // Almacena todas las banderas
let filteredFlags = []; // Almacena las banderas filtradas
let gameSequence = []; // Secuencia de juego
let currentIndex = 0; // Índice actual del juego
let redScore = 0;
let blueScore = 0;
let greenScore = 0;
let gameActive = false; // Indica si el juego está activo
let aleatorio = true;
let Sovereign_State = 'All';

// Configuración inicial del DOM
startButton.textContent = 'Start Game';
startButton.id = 'startButton';
startButton.onclick = toggleGameState;

teamsContainer.id = 'teamsContainer';

redCounter.id = 'redCounter';
redCounter.textContent = 'Red Team: 0';

blueCounter.id = 'blueCounter';
blueCounter.textContent = 'Blue Team: 0';

greenCounter.id = 'greenCounter';
greenCounter.textContent = 'Green Team: 0';

maxCountriesInput.id = 'maxCountries';
maxCountriesInput.type = 'number';
maxCountriesInput.min = '1';
maxCountriesInput.placeholder = 'Max Countries';
maxCountriesInput.disabled = false;
maxCountriesInput.addEventListener('input', validateMaxCountries);

filterContainer.id = 'filterContainer'; // Configuración del contenedor
filterContainer.style.display = 'flex';
filterContainer.style.gap = '10px'; // Espaciado entre elementos

filterContainer.appendChild(continentFilter);
filterContainer.appendChild(sovereignFilter);
filterContainer.appendChild(maxCountriesInput);

teamsContainer.appendChild(redCounter);
teamsContainer.appendChild(blueCounter);
teamsContainer.appendChild(greenCounter);

continentFilter.onchange = function () {
  updateMaxCountries();
};

sovereignFilter.onchange = function () {
  updateMaxCountries();
};

document.body.insertBefore(startButton, document.querySelector('.container'));
document.body.insertBefore(filterContainer, document.querySelector('.container'));
document.body.insertBefore(teamsContainer, document.querySelector('.container'));

// Cargar banderas al iniciar la página
fetch('flags.json')
  .then(response => response.json())
  .then(data => {
    flags = data; // Cargar todas las banderas
    filteredFlags = [...flags]; // Inicializar las filtradas con todas las banderas
    updateMaxCountries(); // Inicializar el valor máximo de países
  })
  .catch(error => console.error('Error loading flags:', error));

// Función que alterna el estado del juego
function toggleGameState() {
  if (gameActive) {
    endGame(); // Finaliza el juego
  } else {
    startGame(); // Inicia el juego
  }
}

// Función para iniciar el juego
function startGame() {
  const selectedContinent = continentFilter.value;
  const selectedSovereign = sovereignFilter.value;
  const maxCountries = parseInt(maxCountriesInput.value, 10);

  // Filtrar las banderas por continente
  filteredFlags = selectedContinent === 'All'
    ? [...flags] // Usar todas las banderasS
    : flags.filter(flag => flag.Continent === selectedContinent);

  // Filtrar las banderas por estado soberano
  filteredFlags = selectedSovereign === 'All'
    ? filteredFlags
    : filteredFlags.filter(flag => flag.Sovereign_State === selectedSovereign);
  
    // Ajustar el límite de países si es necesario
  if (!isNaN(maxCountries) && maxCountries > 0 && maxCountries <= filteredFlags.length) {
    filteredFlags = filteredFlags.slice(0, maxCountries);
  }

  gameActive = true;
  startButton.textContent = 'End Game';
  maxCountriesInput.disabled = true; // Bloquear el campo de entrada
  lockComboBox(true); // Bloquear el combo
  resetGame();
  generateGameSequence();
  displayFlag();
}

// Función para finalizar el juego
function endGame() {
  updateFinalScores(); // Actualizar puntajes antes de finalizar
  setTimeout(() => alert('Game over!'), 100);
  flagImage.src = "https://flagcdn.com/un.svg";
  gameActive = false;
  startButton.textContent = 'Start Game';
  maxCountriesInput.disabled = false; // Desbloquear el campo de entrada
  lockComboBox(false); // Desbloquear el combo
  resetGame(); // Reiniciar las variables del juego
}

// Función para generar una secuencia aleatoria de banderas
function generateGameSequence() {
  const indices = Array.from({ length: filteredFlags.length }, (_, i) => i);

  if (aleatorio) {
    // Generar secuencia aleatoria
    for (let i = indices.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[randomIndex]] = [indices[randomIndex], indices[i]];
    }
  }
  gameSequence = indices;
}

// Función para mostrar la bandera actual
function displayFlag() {
  if (currentIndex < gameSequence.length) {
    const flag = filteredFlags[gameSequence[currentIndex]];
    flagImage.src = flag.Flag_URL;
    countryInfo.textContent = `${flag.Country_English} | ${flag.Country_Spanish}`;
    countryInfo.style.visibility = 'hidden';
  } else {
    updateFinalScores(); // Asegurar que los puntajes se muestren
    endGame();
  }
}

// Función para reiniciar el juego
function resetGame() {
  gameSequence = [];
  currentIndex = 0;
  redScore = 0;
  blueScore = 0;
  greenScore = 0;
  redCounter.textContent = 'Red Team: 0';
  blueCounter.textContent = 'Blue Team: 0';
  greenCounter.textContent = 'Green Team: 0';
  countryInfo.style.visibility = 'hidden';
}

// Función para actualizar el valor máximo permitido en el campo de entrada
function updateMaxCountries() {
  const selectedContinent = continentFilter.value;
  const selectedSovereign = sovereignFilter.value;

  // Filtrar las banderas por continente
  let applicableFlags = selectedContinent === 'All'
    ? [...flags] // Tomar todos los países si no hay filtro por continente
    : flags.filter(flag => flag.Continent === selectedContinent);

  // Filtrar las banderas por estado soberano
  applicableFlags = selectedSovereign === 'All'
    ? applicableFlags
    : applicableFlags.filter(flag => flag.Sovereign_State === selectedSovereign);

  // Determinar el número máximo de países aplicables
  const max = applicableFlags.length;

  // Actualizar el campo de entrada
  maxCountriesInput.max = max; // Establecer el máximo permitido
  maxCountriesInput.value = max; // Ajustar el valor actual
}

// Función para validar el valor ingresado en el campo de entrada
function validateMaxCountries() {
  const max = parseInt(maxCountriesInput.max, 10);
  const min = parseInt(maxCountriesInput.min, 10);
  let value = parseInt(maxCountriesInput.value, 10);

  if (isNaN(value) || value < min) {
    value = min;
  } else if (value > max) {
    value = max;
  }

  maxCountriesInput.value = value;
}

// Función para actualizar los puntajes finales antes de finalizar el juego
function updateFinalScores() {
  redCounter.textContent = `Red Team: ${redScore}`;
  blueCounter.textContent = `Blue Team: ${blueScore}`;
  greenCounter.textContent = `Green Team: ${greenScore}`;
}

// Evento para alternar respuesta
flagImage.onclick = function () {
  countryInfo.style.visibility = 'visible';
};

// Incrementa puntos para el equipo rojo
redCounter.onclick = function () {
  if (countryInfo.style.visibility !== 'visible') {
    makeCountryInfoVisible(); // Llama a la función para hacerlo visible
    return; // Detiene la ejecución del resto de la lógica
  }
  if (currentIndex < gameSequence.length) {
    redScore++;
    redCounter.textContent = `Red Team: ${redScore}`;
    nextFlag();
  }
};

// Incrementa puntos para el equipo azul
blueCounter.onclick = function () {
  if (countryInfo.style.visibility !== 'visible') {
    makeCountryInfoVisible(); // Llama a la función para hacerlo visible
    return; // Detiene la ejecución del resto de la lógica
  }
  if (currentIndex < gameSequence.length) {
    blueScore++;
    blueCounter.textContent = `Blue Team: ${blueScore}`;
    nextFlag();
  }
};

// Incrementa puntos para el equipo verde
greenCounter.onclick = function () {
  if (countryInfo.style.visibility !== 'visible') {
    makeCountryInfoVisible(); // Llama a la función para hacerlo visible
    return; // Detiene la ejecución del resto de la lógica
  }
  if (currentIndex < gameSequence.length) {
    greenScore++;
    greenCounter.textContent = `Green Team: ${greenScore}`;
    nextFlag();
  }
};

// Función que hace visible el campo countryInfo
function makeCountryInfoVisible() {
  countryInfo.style.visibility = 'visible';
}

// Función para bloquear o desbloquear el combo
function lockComboBox(shouldLock) {
  continentFilter.disabled = shouldLock;
  sovereignFilter.disabled = shouldLock;
  
}

// Avanza al siguiente índice de bandera
function nextFlag() {
  currentIndex++;
  displayFlag();
}
