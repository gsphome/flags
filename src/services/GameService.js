/**
 * Service for managing game logic and operations
 */
export class GameService {
    constructor(gameState) {
        this.gameState = gameState;
    }

    generateGameSequence(countries) {
        const indices = Array.from({ length: countries.length }, (_, i) => i);
        
        if (this.gameState.isRandomMode) {
            this.shuffleArray(indices);
        }
        
        this.gameState.gameSequence = indices;
        return indices;
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const randomIndex = Math.floor(Math.random() * (i + 1));
            [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
        }
    }

    startGame(countries) {
        this.gameState.reset();
        this.gameState.isActive = true;
        this.generateGameSequence(countries);
    }

    endGame() {
        this.gameState.isActive = false;
    }

    processTeamScore(teamColor) {
        if (this.gameState.isActive && this.gameState.hasNextFlag) {
            this.gameState.incrementTeamScore(teamColor);
            this.gameState.nextFlag();
            return true;
        }
        return false;
    }

    getCurrentCountry(countries) {
        if (!this.gameState.hasNextFlag) return null;
        
        const currentSequenceIndex = this.gameState.gameSequence[this.gameState.currentIndex];
        return countries[currentSequenceIndex];
    }
}