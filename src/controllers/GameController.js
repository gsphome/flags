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
        this.defaultCountdownSeconds = 4;
        this.practiceCountdownSeconds = 2;
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
        this.view.elements.flagImage.onclick = () => this.handleRevealAction();
        
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

        this.gameState.isPracticeMode = filters.practiceMode;
        this.gameState.gameMode = filters.gameMode;
        this.gameService.startGame(this.filteredCountries);
        this.view.updateStartButton(true);
        this.view.setFiltersEnabled(false);
        this.view.hideSettingsPanel();
        this.view.setSettingsButtonVisible(false);
        this.resetTeamScores();
        this.startTimer();
        this.view.showProgressContainer();
        this.updateProgress();
        
        // Delay before showing first flag
        setTimeout(() => {
            this.displayCurrentFlag();
        }, 500);
    }

    endGame() {
        this.gameService.endGame();
        this.stopTimer();
        this.resetCountryState();
        this.updateFinalScores();
        this.view.showGameEndMessage(this.gameState.teamScores);
        this.view.setDefaultFlag();
        this.view.clearCountryInfo();
        this.view.clearCapitalInfo();
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
            if (this.gameState.gameMode === 'capitals') {
                this.view.showCountryInfo();
                this.view.clearCapitalInfo();
            }
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

    updateAllTeamScores(useCurrentScores = true) {
        Object.keys(this.gameState.teamScores).forEach(teamColor => {
            const score = useCurrentScores ? this.gameState.teamScores[teamColor] : 0;
            this.view.updateTeamScore(teamColor, score);
        });
    }

    resetTeamScores() {
        this.updateAllTeamScores(false);
    }

    updateFinalScores() {
        this.updateAllTeamScores(true);
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
        let countdownSeconds = this.gameState.isPracticeMode ? this.practiceCountdownSeconds : this.defaultCountdownSeconds;
        this.countryInfoRevealed = false;
        this.view.showCountdown();
        this.view.updateCountdown(countdownSeconds);
        
        this.countdownInterval = setInterval(() => {
            countdownSeconds--;
            this.view.updateCountdown(countdownSeconds);
            
            if (countdownSeconds <= 0) {
                this.revealCountryInfo();
                if (this.gameState.isPracticeMode) {
                    setTimeout(() => {
                        this.handleTeamScore('blue');
                    }, 2500);
                }
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
            if (this.gameState.gameMode === 'flags') {
                this.view.showCountryInfo();
            } else if (this.gameState.gameMode === 'capitals') {
                const currentCountry = this.gameService.getCurrentCountry(this.filteredCountries);
                if (currentCountry && currentCountry.capital) {
                    this.view.elements.capitalInfo.textContent = currentCountry.capital;
                    this.view.showCapitalInfo();
                }
            }
            this.stopCountdown();
        }
    }

    resetCountryState() {
        this.countryInfoRevealed = false;
        this.view.hideCapitalInfo();
        this.stopCountdown();
    }



    updateProgress() {
        const total = this.filteredCountries.length;
        const current = this.gameState.currentIndex;
        this.view.updateProgress(current, total);
    }

    handleRevealAction() {
        if (!this.countryInfoRevealed) {
            this.revealCountryInfo();
        }
    }

    handleKeyPress(event) {
        if (event.key === 'Enter' && !this.gameState.isActive) {
            this.startGame();
            return;
        }
        
        if (this.gameState.isActive) {
            switch(event.key) {
                case 'Enter':
                    this.handleRevealAction();
                    break;
                case 'Escape':
                    this.endGame();
                    break;
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