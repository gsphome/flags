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
            capitalInfo: document.getElementById('capitalInfo'),
            continentFilter: document.getElementById('continentFilter'),
            sovereignFilter: document.getElementById('sovereignFilter'),
            gameModeFilter: document.getElementById('gameModeFilter'),
            startButton: this.createStartButton(),
            teamsContainer: this.createTeamsContainer(),
            maxCountriesInput: this.createMaxCountriesInput(),
            practiceModeCheckbox: this.createPracticeModeCheckbox()
        };
        
        elements.filterContainer = this.createFilterContainer(elements);
        elements.settingsButton = this.createSettingsButton();
        elements.teamCounters = this.createTeamCounters(elements);
        elements.progressContainer = this.createProgressContainer();
        
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
        
        // Crear botón de cierre
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '✕';
        closeButton.className = 'filter-close-btn';
        closeButton.onclick = () => this.closeSettingsPanel();
        
        container.appendChild(closeButton);
        container.appendChild(elements.gameModeFilter);
        container.appendChild(elements.continentFilter);
        container.appendChild(elements.sovereignFilter);
        container.appendChild(elements.maxCountriesInput);
        container.appendChild(elements.practiceModeCheckbox);
        
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

    createPracticeModeCheckbox() {
        const container = document.createElement('div');
        container.className = 'practice-mode-container';
        
        const checkbox = document.createElement('input');
        checkbox.id = 'practiceMode';
        checkbox.type = 'checkbox';
        
        const label = document.createElement('label');
        label.htmlFor = 'practiceMode';
        label.textContent = 'Modo Práctica';
        
        container.appendChild(checkbox);
        container.appendChild(label);
        return container;
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

    createProgressContainer() {
        const container = document.createElement('div');
        container.id = 'progressContainer';
        container.className = 'progress-container';
        
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        
        const progressFill = document.createElement('div');
        progressFill.className = 'progress-fill';
        progressFill.id = 'progressFill';
        
        const progressText = document.createElement('div');
        progressText.className = 'progress-text';
        progressText.id = 'progressText';
        progressText.textContent = '0 / 0';
        
        const timer = document.createElement('div');
        timer.className = 'timer';
        timer.id = 'timer';
        timer.textContent = '00:00';
        
        const countdownTimer = document.createElement('div');
        countdownTimer.className = 'countdown-timer';
        countdownTimer.id = 'countdownTimer';
        countdownTimer.textContent = '3';
        
        progressBar.appendChild(progressFill);
        container.appendChild(progressText);
        container.appendChild(progressBar);
        const timerContainer = document.createElement('div');
        timerContainer.className = 'timer-container';
        timerContainer.appendChild(timer);
        timerContainer.appendChild(countdownTimer);
        container.appendChild(timerContainer);
        
        document.querySelector('.container').insertBefore(container, document.getElementById('flagImage'));
        
        return { container, progressFill, progressText, timer, countdownTimer };
    }

    setupEventListeners() {
        // Event listeners will be set by the controller
    }

    updateFlagDisplay(country) {
        if (country) {
            this.elements.countryInfo.style.visibility = 'hidden';
            this.elements.flagImage.src = country.flagUrl;
            this.elements.countryInfo.textContent = country.displayName;
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
        this.elements.practiceModeCheckbox.querySelector('input').disabled = !enabled;
    }

    setSettingsButtonVisible(visible) {
        this.elements.settingsButton.style.display = visible ? 'flex' : 'none';
    }

    hideSettingsPanel() {
        this.closeSettingsPanel();
    }
    
    closeSettingsPanel() {
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
            // Si hay empate entre equipos (red/green) y draw, el equipo gana
            if (winners.includes('blue') && (winners.includes('red') || winners.includes('green'))) {
                const teamWinner = winners.find(team => team !== 'blue');
                winnerText = `🏆 ${teamNames[teamWinner]} Wins!`;
            } else {
                winnerText = '🤝 It\'s a Tie!';
            }
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
        this.elements.countryInfo.style.opacity = '1';
    }

    hideCountryInfo() {
        this.elements.countryInfo.style.visibility = 'hidden';
        this.elements.countryInfo.style.opacity = '0';
    }

    clearCountryInfo() {
        this.elements.countryInfo.textContent = 'Country Name';
        this.elements.countryInfo.style.opacity = '0';
    }

    updateProgress(current, total) {
        if (window.innerWidth > 600) {
            const percentage = total > 0 ? (current / total) * 100 : 0;
            this.elements.progressContainer.progressFill.style.width = `${percentage}%`;
            this.elements.progressContainer.progressText.textContent = `${current} / ${total}`;
        }
    }

    updateTimer(seconds) {
        if (window.innerWidth > 600) {
            const minutes = Math.floor(seconds / 60);
            const secs = seconds % 60;
            this.elements.progressContainer.timer.textContent = 
                `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
    }

    updateCountdown(seconds) {
        if (window.innerWidth > 600) {
            this.elements.progressContainer.countdownTimer.textContent = seconds;
            this.elements.progressContainer.countdownTimer.className = 
                seconds <= 2 ? 'countdown-timer urgent' : 'countdown-timer';
        }
    }

    hideCountdown() {
        if (window.innerWidth > 600) {
            this.elements.progressContainer.countdownTimer.style.opacity = '0';
        }
    }

    showCountdown() {
        if (window.innerWidth > 600) {
            this.elements.progressContainer.countdownTimer.style.opacity = '1';
        }
    }

    showProgressContainer() {
        if (window.innerWidth > 600) {
            this.elements.progressContainer.container.style.display = 'block';
        }
    }

    hideProgressContainer() {
        if (window.innerWidth > 600) {
            this.elements.progressContainer.container.style.display = 'none';
        }
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
            gameMode: this.elements.gameModeFilter.value,
            maxCount: parseInt(this.elements.maxCountriesInput.value, 10),
            practiceMode: this.elements.practiceModeCheckbox.querySelector('input').checked
        };
    }

    showCapitalInfo() {
        this.elements.capitalInfo.style.opacity = '1';
        this.elements.capitalInfo.style.display = 'block';
    }

    hideCapitalInfo() {
        this.elements.capitalInfo.style.opacity = '0';
        this.elements.capitalInfo.style.display = 'none';
    }

    clearCapitalInfo() {
        this.elements.capitalInfo.textContent = 'Capital Name';
        this.elements.capitalInfo.style.opacity = '0';
        this.elements.capitalInfo.style.display = 'none';
    }
}