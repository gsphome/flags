import fs from 'fs';

const data = JSON.parse(fs.readFileSync('./assets/data/flags.json', 'utf8'));

const entriesToRemove = [
    'British Indian Ocean Territory',
    'Northern Mariana Islands', 
    'Caribbean Netherlands'
];

const filteredData = data.filter(item => 
    !entriesToRemove.includes(item.Country_English)
);

fs.writeFileSync('./assets/data/flags.json', JSON.stringify(filteredData, null, 4));

console.log(`Eliminadas ${data.length - filteredData.length} entradas:`);
entriesToRemove.forEach(entry => console.log(`- ${entry}`));
console.log(`Total de entradas restantes: ${filteredData.length}`);