const game = () => {
    let playerScore = 0;
    let computerScore = 0;
    let moves = 10;

    const playGame = () => {
        const rock = document.querySelector('.rock');
        const paper = document.querySelector('.paper');
        const scissors = document.querySelector('.scissors'); 
        const playerOptions = [rock, paper, scissors];
        const computerOptions = ['rock', 'paper', 'scissors'];

        playerOptions.forEach(option => {
            option.addEventListener('click', function () {
                const movesLeft = document.querySelector('.movesLeft'); // fixed class name case
                const result = document.querySelector('.result');
                const playerScoreBoard = document.querySelector('.Player_count'); // fixed selector
                const computerScoreBoard = document.querySelector('.Score_count'); // fixed selector

                // Update moves left
                moves--;
                movesLeft.innerText = `Moves Left: ${moves}`;

                // Generate computer choice
                const choiceNumber = Math.floor(Math.random() * 3);
                const computerChoice = computerOptions[choiceNumber];

                // Call winner logic
                const playerChoice = this.innerText.toLowerCase(); // normalize to lowercase
                checkWinner(playerChoice, computerChoice, result, playerScoreBoard, computerScoreBoard);

                // End game if no moves left
                if (moves === 0) {
                    gameOver(playerOptions, movesLeft);
                }
            });
        });
    };

    // Determine winner
    const checkWinner = (player, computer, result, playerScoreBoard, computerScoreBoard) => {
        if (player === computer) {
            result.textContent = 'Tie';
        } else if (
            (player === 'rock' && computer === 'scissors') ||
            (player === 'paper' && computer === 'rock') ||
            (player === 'scissors' && computer === 'paper')
        ) {
            result.textContent = 'Player Won';
            playerScore++;
            playerScoreBoard.textContent = playerScore;
        } else {
            result.textContent = 'Computer Won';
            computerScore++;
            computerScoreBoard.textContent = computerScore;
        }
    };

    // End game UI state
    const gameOver = (playerOptions, movesLeft) => {
        const result = document.querySelector('.result');
        result.textContent = 'Game Over';

        // Disable all buttons
        playerOptions.forEach(option => {
            option.disabled = true;
        });

        // Show reload button
        const reloadBtn = document.querySelector('.reload');
        reloadBtn.textContent = "Restart";
        reloadBtn.style.display = 'block';

        reloadBtn.addEventListener('click', () => {
            window.location.reload();
        });
    };

    // Start the game
    playGame();
};

// Start it all
game();

// THANK YOU GEEKS FOR GEEKS CAUSE AINT NO WAYYYY I WAS GONNA WRITE THAT WHOLE ASS IF
// being completely honest i think i might be delusional HOLLLLLLLYYYY FUCKKKKKKKK
//cleaned typos and schizophrenia by chat gpt TM

//final web page w 20 connections
//game w a lot of mechanics, ex: runner
//wednesday we stop doing
//apparently a dress up game w a save and make your own clothes is complex I WON