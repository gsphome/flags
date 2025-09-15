import fs from 'fs';

// Read the flags data
const data = JSON.parse(fs.readFileSync('./assets/data/flags.json', 'utf8'));

// Filter territories (Sovereign_State: "No")
const territories = data.filter(item => item.Sovereign_State === "No");

// Sort by name length (Spanish name) in descending order
const sortedTerritories = territories.sort((a, b) => 
    b.Country_Spanish.length - a.Country_Spanish.length
);

// Get top 10
const top10 = sortedTerritories.slice(0, 10);

console.log("Los 10 territorios con los nombres más largos:");
console.log("=".repeat(50));

top10.forEach((territory, index) => {
    console.log(`${index + 1}. ${territory.Country_Spanish} (${territory.Country_Spanish.length} caracteres)`);
    console.log(`   Inglés: ${territory.Country_English}`);
    console.log(`   Continente: ${territory.Continent}`);
    console.log("");
});