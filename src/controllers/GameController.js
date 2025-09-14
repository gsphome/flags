import { GameState } from '../models/GameState.js';
import { CountryService } from '../services/CountryService.js';
import { GameService } from '../services/GameService.js';
import { GameView } from '../views/GameView.js';

/**
 * Main controller orchestrating the flag guessing game
 */
export class GameController {
    constructor() {
        this.gameState = new GameState();
        this.countryService = new CountryService();
        this.gameService = new GameService(this.gameState);
        this.view = new GameView();
        this.filteredCountries = [];
        this.startTime = null;
        this.timerInterval = null;
        this.countdownInterval = null;
        this.countdownSeconds = 3;
        this.countryInfoRevealed = false;
        
        this.initializeGame();
    }

    async initializeGame() {
        try {
            await this.countryService.loadCountries();
            this.setupEventListeners();
            this.updateMaxCountriesLimit();
        } catch (error) {
            console.error('Failed to initialize game:', error);
        }
    }

    setupEventListeners() {
        // Start/End game button
        this.view.elements.startButton.onclick = () => this.toggleGameState();
        
        // Filter change listeners
        this.view.elements.continentFilter.onchange = () => this.updateMaxCountriesLimit();
        this.view.elements.sovereignFilter.onchange = () => this.updateMaxCountriesLimit();
        this.view.elements.maxCountriesInput.addEventListener('input', () => this.filterNumericInput());
        this.view.elements.maxCountriesInput.addEventListener('blur', () => this.validateMaxCountriesInput());
        
        // Flag click to reveal answer
        this.view.elements.flagImage.onclick = () => {
            if (!this.countryInfoRevealed) {
                this.revealCountryInfo();
            }
        };
        
        // Team scoring
        Object.keys(this.view.elements.teamCounters).forEach(teamColor => {
            this.view.elements.teamCounters[teamColor].onclick = () => this.handleTeamScore(teamColor);
        });
        
        // Keyboard events
        document.addEventListener('keydown', (event) => this.handleKeyPress(event));
    }

    toggleGameState() {
        if (this.gameState.isActive) {
            this.endGame();
        } else {
            this.startGame();
        }
    }

    startGame() {
        const filters = this.view.getFilterValues();
        this.filteredCountries = this.countryService.filterCountries(filters);
        
        if (this.filteredCountries.length === 0) {
            alert('No countries match the selected filters');
            return;
        }

        this.gameService.startGame(this.filteredCountries);
        this.view.updateStartButton(true);
        this.view.setFiltersEnabled(false);
        this.view.hideSettingsPanel();
        this.view.setSettingsButtonVisible(false);
        this.resetTeamScores();
        this.startTimer();
        this.view.showProgressContainer();
        this.updateProgress();
        this.displayCurrentFlag();
    }

    endGame() {
        this.gameService.endGame();
        this.stopTimer();
        this.resetCountryState();
        this.updateFinalScores();
        this.view.showGameEndMessage(this.gameState.teamScores);
        this.view.setDefaultFlag();
        this.view.clearCountryInfo();
        this.view.updateStartButton(false);
        this.view.setFiltersEnabled(true);
        this.view.setSettingsButtonVisible(true);
        this.view.hideProgressContainer();
        this.updateMaxCountriesLimit();
        this.resetTeamScores();
    }

    handleTeamScore(teamColor) {
        if (!this.gameState.isActive) return;
        
        // Show country info if not visible
        if (!this.countryInfoRevealed) {
            this.revealCountryInfo();
            return;
        }

        // Process score and move to next flag
        const scoreProcessed = this.gameService.processTeamScore(teamColor);
        if (scoreProcessed) {
            this.view.updateTeamScore(teamColor, this.gameState.teamScores[teamColor]);
            this.updateProgress();
            this.resetCountryState();
            this.displayCurrentFlag();
        }
    }

    displayCurrentFlag() {
        const currentCountry = this.gameService.getCurrentCountry(this.filteredCountries);
        
        if (currentCountry) {
            this.view.updateFlagDisplay(currentCountry);
            this.startCountdown();
        } else {
            this.endGame();
        }
    }

    updateMaxCountriesLimit() {
        const filters = this.view.getFilterValues();
        const maxCount = this.countryService.getMaxCountryCount(filters);
        this.view.updateMaxCountriesInput(maxCount);
    }

    filterNumericInput() {
        const input = this.view.elements.maxCountriesInput;
        // Solo permitir números, eliminar cualquier carácter no numérico
        input.value = input.value.replace(/[^0-9]/g, '');
    }

    validateMaxCountriesInput() {
        const input = this.view.elements.maxCountriesInput;
        const max = parseInt(input.max, 10);
        const min = parseInt(input.min, 10);
        let value = parseInt(input.value, 10);

        // Si el campo está vacío, no validar hasta que el usuario termine
        if (input.value === '') {
            return;
        }

        if (isNaN(value) || value < min) {
            value = min;
        } else if (value > max) {
            value = max;
        }

        input.value = value;
    }

    resetTeamScores() {
        Object.keys(this.gameState.teamScores).forEach(teamColor => {
            this.view.updateTeamScore(teamColor, 0);
        });
    }

    updateFinalScores() {
        Object.keys(this.gameState.teamScores).forEach(teamColor => {
            this.view.updateTeamScore(teamColor, this.gameState.teamScores[teamColor]);
        });
    }

    startTimer() {
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            this.view.updateTimer(elapsed);
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        this.stopCountdown();
    }

    startCountdown() {
        this.stopCountdown();
        this.countdownSeconds = 3;
        this.countryInfoRevealed = false;
        this.view.showCountdown();
        this.view.updateCountdown(this.countdownSeconds);
        
        this.countdownInterval = setInterval(() => {
            this.countdownSeconds--;
            this.view.updateCountdown(this.countdownSeconds);
            
            if (this.countdownSeconds <= 0) {
                this.revealCountryInfo();
            }
        }, 1000);
    }

    stopCountdown() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }
        this.view.hideCountdown();
    }

    revealCountryInfo() {
        if (!this.countryInfoRevealed) {
            this.countryInfoRevealed = true;
            this.view.showCountryInfo();
            this.stopCountdown();
        }
    }

    resetCountryState() {
        this.countryInfoRevealed = false;
        this.stopCountdown();
    }

    updateProgress() {
        const total = this.filteredCountries.length;
        const current = this.gameState.currentIndex;
        this.view.updateProgress(current, total);
    }

    handleKeyPress(event) {
        // Enter key to start game when waiting
        if (event.key === 'Enter' && !this.gameState.isActive) {
            this.startGame();
        }
        
        // Number keys for team selection during game
        if (this.gameState.isActive) {
            switch(event.key) {
                case '1':
                    this.handleTeamScore('red');
                    break;
                case '2':
                    this.handleTeamScore('blue');
                    break;
                case '3':
                    this.handleTeamScore('green');
                    break;
            }
        }
    }
}