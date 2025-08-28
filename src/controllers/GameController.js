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
        this.view.elements.maxCountriesInput.addEventListener('input', () => this.validateMaxCountriesInput());
        
        // Flag click to reveal answer
        this.view.elements.flagImage.onclick = () => this.view.showCountryInfo();
        
        // Team scoring
        Object.keys(this.view.elements.teamCounters).forEach(teamColor => {
            this.view.elements.teamCounters[teamColor].onclick = () => this.handleTeamScore(teamColor);
        });
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
        this.displayCurrentFlag();
    }

    endGame() {
        this.gameService.endGame();
        this.updateFinalScores();
        this.view.showGameEndMessage(this.gameState.teamScores);
        this.view.setDefaultFlag();
        this.view.clearCountryInfo();
        this.view.updateStartButton(false);
        this.view.setFiltersEnabled(true);
        this.view.setSettingsButtonVisible(true);
        this.resetTeamScores();
    }

    handleTeamScore(teamColor) {
        if (!this.gameState.isActive) return;
        
        // Show country info if not visible
        if (this.view.elements.countryInfo.style.visibility !== 'visible') {
            this.view.showCountryInfo();
            return;
        }

        // Process score and move to next flag
        const scoreProcessed = this.gameService.processTeamScore(teamColor);
        if (scoreProcessed) {
            this.view.updateTeamScore(teamColor, this.gameState.teamScores[teamColor]);
            this.displayCurrentFlag();
        }
    }

    displayCurrentFlag() {
        const currentCountry = this.gameService.getCurrentCountry(this.filteredCountries);
        
        if (currentCountry) {
            this.view.updateFlagDisplay(currentCountry);
        } else {
            this.endGame();
        }
    }

    updateMaxCountriesLimit() {
        const filters = this.view.getFilterValues();
        const maxCount = this.countryService.getCountryCount(filters);
        this.view.updateMaxCountriesInput(maxCount);
    }

    validateMaxCountriesInput() {
        const input = this.view.elements.maxCountriesInput;
        const max = parseInt(input.max, 10);
        const min = parseInt(input.min, 10);
        let value = parseInt(input.value, 10);

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
}