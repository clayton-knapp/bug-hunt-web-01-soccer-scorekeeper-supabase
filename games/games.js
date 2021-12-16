import { 
    logout, 
    checkAuth,
    getGames,
    createGame,
} from '../fetch-utils.js';
import { renderGame } from '../render-utils.js';

const currentGameEl = document.getElementById('current-game-container');
const logoutButton = document.getElementById('logout');

const nameForm = document.getElementById('name-form');
const teamOneAddButton = document.getElementById('team-one-add-button');
const teamTwoAddButton = document.getElementById('team-two-add-button');
const teamOneSubtractButton = document.getElementById('team-one-subtract-button');
const teamTwoSubtractButton = document.getElementById('team-two-subtract-button');
const finishGameButton = document.getElementById('finish-game-button');
const teamOneLabel = document.getElementById('team-one-name');
const teamTwoLabel = document.getElementById('team-two-name');
const pastGamesEl = document.getElementById('past-games-container');

checkAuth();

let pastGames = [];

let currentGame = {
    name1: '',
    name2: '',
    score1: 0,
    score2: 0,
};

nameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(nameForm);
  
    currentGame.name1 = formData.get('team-one');
    currentGame.name2 = formData.get('team-two');
    
    nameForm.reset();

    displayCurrentGameEl();
});


teamOneAddButton.addEventListener('click', () => {
    currentGame.score1++;
    
    displayCurrentGameEl();
});

teamTwoAddButton.addEventListener('click', () => {
    currentGame.score2++;

    displayCurrentGameEl();
});

teamOneSubtractButton.addEventListener('click', () => {
    currentGame.score1--;

    displayCurrentGameEl();
});

teamTwoSubtractButton.addEventListener('click', () => {
    currentGame.score2--;
    displayCurrentGameEl();
});

function displayCurrentGameEl() {
    currentGameEl.textContent = '';

    teamOneLabel.textContent = currentGame.name1;
    teamTwoLabel.textContent = currentGame.name2;

    const gameEl = renderGame(currentGame);
    
    gameEl.classList.add('current');

    currentGameEl.append(gameEl);
}


function displayAllGames() {
    for (let game of pastGames) {
        const gameEl = renderGame(game);

        gameEl.classList.add('past');
        
        pastGamesEl.append(gameEl);
    }
}


finishGameButton.addEventListener('click', async() => {
    //calls createGame and feeds it the currentGame object in state
    await createGame(currentGame);
    
    //calls getGames which calls supabase and returns the array, setting equal to returned Game Array
    const returnedGames = await getGames();

    //makes our pastGames array in state equal to the returnedGames from getGames call
    pastGames = returnedGames;
    
    displayAllGames();
    
    //reset current state
    currentGame = {
        name1: '',
        name2: '',
        score1: 0,
        score2: 0,
    };

    displayCurrentGameEl();
});

displayCurrentGameEl();


logoutButton.addEventListener('click', () => {
    logout();
});

window.addEventListener('load', async() => {
    const fetchedGames = await getGames();
    
    //if there is something in the fetchedGames array
    if (fetchedGames) {
        //then set the local past games array in state to the fetchedGames and Display
        pastGames = fetchedGames;

        displayAllGames();
    }
});
