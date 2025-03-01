export class Leaderboard {
    constructor() {
        this.currentMode = 'standard';
        this.playerName = '';
    }

    async submitScore(score, mode) {
        try {
            if (!this.playerName) {
                console.error('Player name is required');
                return;
            }
            
            const response = await fetch('/api/scores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: this.playerName,
                    score,
                    mode
                })
            });
            
            const result = await response.json();
            if (result.score > score) {
                console.log('Previous high score remains:', result.score);
            } else if (result.score === score) {
                console.log('Score submitted:', score);
            } else {
                console.log('New high score:', score);
            }
            return result;
        } catch (error) {
            console.error('Error submitting score:', error);
        }
    }

    async getTopScores(mode) {
        try {
            const response = await fetch(`/api/scores/${mode}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching scores:', error);
            return [];
        }
    }

    createLeaderboardElement() {
        const leaderboard = document.createElement('div');
        leaderboard.style.position = 'fixed';
        leaderboard.style.top = '50%';
        leaderboard.style.left = '50%';
        leaderboard.style.transform = 'translate(-50%, -50%)';
        leaderboard.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        leaderboard.style.padding = '20px';
        leaderboard.style.borderRadius = '10px';
        leaderboard.style.color = 'white';
        leaderboard.style.zIndex = '1000';
        leaderboard.style.minWidth = '300px';
        return leaderboard;
    }

    async showLeaderboard(mode = this.currentMode) {
        const leaderboard = this.createLeaderboardElement();
        const scores = await this.getTopScores(mode);
        
        leaderboard.innerHTML = `
            <h2 style="text-align: center; color: #007bff;">Top Scores - ${mode} Mode</h2>
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <tr>
                    <th style="padding: 8px; border-bottom: 1px solid #007bff;">Rank</th>
                    <th style="padding: 8px; border-bottom: 1px solid #007bff;">Name</th>
                    <th style="padding: 8px; border-bottom: 1px solid #007bff;">Score</th>
                </tr>
                ${scores.map((score, index) => `
                    <tr>
                        <td style="padding: 8px; text-align: center;">${index + 1}</td>
                        <td style="padding: 8px;">${score.name}</td>
                        <td style="padding: 8px; text-align: right;">${score.score}</td>
                    </tr>
                `).join('')}
            </table>
            <button id="closeLeaderboard" style="
                margin-top: 20px;
                padding: 10px 20px;
                background: #007bff;
                border: none;
                color: white;
                border-radius: 5px;
                cursor: pointer;
                width: 100%;
            ">Close</button>
        `;

        document.body.appendChild(leaderboard);
        
        document.getElementById('closeLeaderboard').onclick = () => {
            document.body.removeChild(leaderboard);
        };
    }

    createNameInput() {
        const nameInput = document.createElement('div');
        nameInput.style.marginBottom = '20px';
        nameInput.innerHTML = `
            <input type="text" 
                id="playerNameInput" 
                placeholder="Enter your name"
                maxlength="15"
                style="
                    padding: 10px;
                    font-size: 16px;
                    border: 2px solid #007bff;
                    border-radius: 5px;
                    width: 200px;
                    margin-bottom: 10px;
                    background: white;
                    color: black;
                "
            >
        `;
        return nameInput;
    }
} 