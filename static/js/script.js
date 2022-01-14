// Objects database
let blackjackGame = {
    'you': { 'scoreSpan': '#your-blackjack-result', 'div': '#your-box', 'score': 0 },
    'dealer': { 'scoreSpan': '#dealer-blackjack-result', 'div': '#dealer-box', 'score': 0 },
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'J', 'Q', 'A'],
    'cardsMap': { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'K': 10, 'J': 10, 'Q': 10, 'A': [1, 11] },
    'wins': 0,
    'losses': 0,
    'draws': 0,
    'isStand': false,
    'turnsOver': false
}

const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer'];

// Audios
const hitSound = new Audio('static/sounds/swish.m4a');
const winSound = new Audio('static/sounds/cash.mp3');
const lossSound = new Audio('static/sounds/aww.mp3');

// Adding event listeners
document.querySelector('#blackjack-hit-button').addEventListener('click', blackjackHit);
document.querySelector('#blackjack-deal-button').addEventListener('click', blackjackDeal);
document.querySelector('#blackjack-stand-button').addEventListener('click', blackjackStand);

// Generating random cards
function randomCard() {
    let rand = Math.floor(Math.random() * 13);
    return blackjackGame['cards'][rand];
}

var hit = false, stand = false;
// Function for button hit
function blackjackHit() {
    if (blackjackGame['isStand'] === false) {
        let card = randomCard();
        showCard(card, YOU);
        updateScore(card, YOU)
        showScore(YOU);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Function for button stand
async function blackjackStand() {
    blackjackGame['isStand'] = true;

    while (DEALER['score'] <= 15 && blackjackGame['isStand'] === true) {
        let card = randomCard();
        showCard(card, DEALER);
        updateScore(card, DEALER);
        showScore(DEALER);
        await sleep(700);
    }

    if (DEALER['score'] > 15) {
        blackjackGame['turnsOver'] = true;

        // Making sound effect for win, loss, draw and result
        let winner = computerWinner();
        showResult(winner);
    }
}

// Function for button deal
function blackjackDeal() {
    if (blackjackGame['turnsOver'] === true) {
        blackjackGame['isStand'] = false;
        // Removing images
        let yourImages = document.querySelector(YOU['div']).querySelectorAll('img');
        let dealerImages = document.querySelector(DEALER['div']).querySelectorAll('img');

        for (let i = 0; i < yourImages.length; i++) {
            yourImages[i].remove();
        }
        for (let i = 0; i < dealerImages.length; i++) {
            dealerImages[i].remove();
        }

        // Resetting score to 0 after deal
        YOU['score'] = 0;
        DEALER['score'] = 0;

        document.querySelector('#your-blackjack-result').textContent = 0;
        document.querySelector('#your-blackjack-result').style.color = 'white';
        document.querySelector('#dealer-blackjack-result').textContent = 0;
        document.querySelector('#dealer-blackjack-result').style.color = 'white';

        // Resetting default message 
        document.querySelector('#blackjack-result').textContent = "Let's Play";
        document.querySelector('#blackjack-result').style.color = 'black ';

        blackjackGame['turnsOver'] = true;
    }
}

// Show the cards at the frontend
function showCard(card, activePlayer) {
    if (activePlayer['score'] <= 21) {
        let cardImage = document.createElement('img');
        cardImage.src = `static/images/cards-images/${card}.png`;
        document.querySelector(activePlayer['div']).appendChild(cardImage);
        hitSound.play();
    }
}

// Update score 
function updateScore(card, activePlayer) {
    if (card === 'A') {
        // If adding 11 keeps me below 21 add 11, otherwise add 1
        if (activePlayer['score'] + blackjackGame['cardsMap'][card][1] <= 21) {
            activePlayer['score'] += blackjackGame['cardsMap'][card][1];
        }
        else {
            activePlayer['score'] += blackjackGame['cardsMap'][card][0];
        }
    }
    else {
        activePlayer['score'] += blackjackGame['cardsMap'][card];
    }
}

// Show current score
function showScore(activePlayer) {
    if (activePlayer['score'] > 21) {
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST!';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
    }
    else {
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }
}

// Compute winner and return who just won
function computerWinner() {
    let winner;

    if (YOU['score'] <= 21) {

        // condition: Higher score than dealer or when dealer bust's but you doesn't
        if (YOU['score'] > DEALER['score'] || (DEALER['score'] > 21)) {
            blackjackGame['wins']++;
            winner = YOU;
        }

        // condition: dealer's score is higher than you
        else if (YOU['score'] < DEALER['score']) {
            blackjackGame['losses']++;
            winner = DEALER;
        }

        // condition: Wher both score are equal
        else if (YOU['score'] == DEALER['score']) {
            blackjackGame['draws']++;
        }
    }

    // condition: when user bust's but dealer doesn't
    else if (YOU['score'] > 21 && DEALER['score'] <= 21) {
        blackjackGame['losses']++;
        winner = DEALER;
    }

    // condition: when both bust's 
    else if (YOU['score'] > 21 && DEALER['score'] > 21) {
        blackjackGame['draws']++;
    }

    console.log("Winner is ", winner);
    return winner;
}

// Showing result at the forntend
function showResult(winner) {
    let message, messageColor;

    if (blackjackGame['turnsOver'] === true) {

        if (winner === YOU) {
            message = "You won!";
            messageColor = "green";
            winSound.play();
            document.querySelector('#wins').textContent = blackjackGame['wins'];
        }
        else if (winner === DEALER) {
            message = "You lost!";
            messageColor = "red";
            lossSound.play();
            document.querySelector('#losses').textContent = blackjackGame['losses'];
        }
        else {
            message = "You drew!";
            messageColor = "black";
            document.querySelector('#draws').textContent = blackjackGame['draws'];
        }

        document.querySelector('#blackjack-result').innerHTML = "<div style='color: " + messageColor + ";width: 15%;margin: auto;margin-top:16px;background-color: aliceblue;padding: 3px;font-size: 18px;border-radius: 15px;'>" + message + "</div>";
    }
}