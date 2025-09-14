// ARCHIVO LEGACY - MANTENER COMO REFERENCIA
// Este archivo contiene la implementación original antes de la refactorización

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

// ... resto del código original ...