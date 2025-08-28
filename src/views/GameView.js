/**
 * View class for managing DOM elements and UI updates
 */
export class GameView {
    constructor() {
        this.elements = this.initializeElements();
        this.setupEventListeners();
    }

    initializeElements() {
        const elements = {
            flagImage: document.getElementById('flagImage'),
            countryInfo: document.getElementById('countryInfo'),
            continentFilter: document.getElementById('continentFilter'),
            sovereignFilter: document.getElementById('sovereignFilter'),
            startButton: this.createStartButton(),
            teamsContainer: this.createTeamsContainer(),
            maxCountriesInput: this.createMaxCountriesInput()
        };
        
        elements.filterContainer = this.createFilterContainer(elements);
        elements.settingsButton = this.createSettingsButton();
        elements.teamCounters = this.createTeamCounters(elements);
        
        return elements;
    }

    createStartButton() {
        const button = document.createElement('button');
        button.textContent = 'Start Game';
        button.id = 'startButton';
        document.body.insertBefore(button, document.querySelector('.container'));
        return button;
    }

    createTeamsContainer() {
        const container = document.createElement('div');
        container.id = 'teamsContainer';
        document.body.insertBefore(container, document.querySelector('.container'));
        return container;
    }

    createFilterContainer(elements) {
        const container = document.createElement('div');
        container.id = 'filterContainer';
        
        container.appendChild(elements.continentFilter);
        container.appendChild(elements.sovereignFilter);
        container.appendChild(elements.maxCountriesInput);
        
        document.body.appendChild(container);
        return container;
    }

    createSettingsButton() {
        const button = document.createElement('button');
        button.id = 'settingsButton';
        button.innerHTML = '⚙️';
        button.title = 'Game Settings';
        
        button.onclick = () => {
            const filterContainer = document.getElementById('filterContainer');
            const isVisible = filterContainer.classList.contains('show');
            
            if (isVisible) {
                filterContainer.classList.remove('show');
                button.classList.remove('active');
            } else {
                filterContainer.classList.add('show');
                button.classList.add('active');
            }
        };
        
        document.body.appendChild(button);
        return button;
    }

    createMaxCountriesInput() {
        const input = document.createElement('input');
        input.id = 'maxCountries';
        input.type = 'number';
        input.min = '1';
        input.placeholder = 'Max Countries';
        return input;
    }

    createTeamCounters(elements) {
        const teams = [
            { id: 'red', name: 'Red Team' },
            { id: 'blue', name: 'Draw' },
            { id: 'green', name: 'Green Team' }
        ];
        const counters = {};
        
        teams.forEach(team => {
            const counter = document.createElement('div');
            counter.id = `${team.id}Counter`;
            counter.textContent = `${team.name}: 0`;
            counters[team.id] = counter;
            elements.teamsContainer.appendChild(counter);
        });
        
        return counters;
    }

    setupEventListeners() {
        // Event listeners will be set by the controller
    }

    updateFlagDisplay(country) {
        if (country) {
            this.elements.flagImage.src = country.flagUrl;
            this.elements.countryInfo.textContent = country.displayName;
            this.hideCountryInfo();
        }
    }

    updateTeamScore(teamColor, score) {
        const counter = this.elements.teamCounters[teamColor];
        if (counter) {
            const teamNames = {
                red: 'Red Team',
                blue: 'Draw',
                green: 'Green Team'
            };
            counter.textContent = `${teamNames[teamColor]}: ${score}`;
        }
    }

    updateStartButton(isGameActive) {
        this.elements.startButton.textContent = isGameActive ? 'End Game' : 'Start Game';
    }

    setFiltersEnabled(enabled) {
        this.elements.continentFilter.disabled = !enabled;
        this.elements.sovereignFilter.disabled = !enabled;
        this.elements.maxCountriesInput.disabled = !enabled;
    }

    setSettingsButtonVisible(visible) {
        this.elements.settingsButton.style.display = visible ? 'flex' : 'none';
    }

    hideSettingsPanel() {
        const filterContainer = document.getElementById('filterContainer');
        const settingsButton = document.getElementById('settingsButton');
        
        filterContainer.classList.remove('show');
        settingsButton.classList.remove('active');
    }

    showGameEndModal(teamScores) {
        const modal = document.createElement('div');
        modal.id = 'gameEndModal';
        modal.className = 'modal-overlay';
        
        const maxScore = Math.max(...Object.values(teamScores));
        const winners = Object.keys(teamScores).filter(team => teamScores[team] === maxScore);
        const teamNames = { red: 'Red Team', blue: 'Draw', green: 'Green Team' };
        
        let winnerText;
        if (winners.length > 1) {
            winnerText = '🤝 It\'s a Tie!';
        } else if (winners[0] === 'blue') {
            winnerText = '🤝 Most Draws!';
        } else {
            winnerText = `🏆 ${teamNames[winners[0]]} Wins!`;
        }
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>🎉 Game Over! 🎉</h2>
                </div>
                <div class="modal-body">
                    <div class="winner-announcement">
                        <h3>${winnerText}</h3>
                    </div>
                    <div class="final-scores">
                        <div class="score-item red">
                            <span class="team-name">Red Team</span>
                            <span class="score">${teamScores.red}</span>
                        </div>
                        <div class="score-item blue">
                            <span class="team-name">Draw</span>
                            <span class="score">${teamScores.blue}</span>
                        </div>
                        <div class="score-item green">
                            <span class="team-name">Green Team</span>
                            <span class="score">${teamScores.green}</span>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="modal-close-btn">Play Again</button>
                </div>
            </div>
        `;
        
        modal.querySelector('.modal-close-btn').onclick = () => {
            document.body.removeChild(modal);
        };
        
        document.body.appendChild(modal);
    }

    updateMaxCountriesInput(maxValue) {
        this.elements.maxCountriesInput.max = maxValue;
        this.elements.maxCountriesInput.value = maxValue;
    }

    showCountryInfo() {
        this.elements.countryInfo.style.visibility = 'visible';
    }

    hideCountryInfo() {
        this.elements.countryInfo.style.visibility = 'hidden';
    }

    clearCountryInfo() {
        this.elements.countryInfo.textContent = '';
        this.elements.countryInfo.style.visibility = 'hidden';
    }

    showGameEndMessage(teamScores) {
        this.showGameEndModal(teamScores);
    }

    setDefaultFlag() {
        this.elements.flagImage.src = "https://flagcdn.com/un.svg";
    }

    getFilterValues() {
        return {
            continent: this.elements.continentFilter.value,
            sovereigntyStatus: this.elements.sovereignFilter.value,
            maxCount: parseInt(this.elements.maxCountriesInput.value, 10)
        };
    }
}