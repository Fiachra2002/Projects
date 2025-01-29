import displayMainMenu from './mainMenu.js';
import startGame from './gameModule.js';
import chalk from 'chalk';
import { updateScore, getTopScores, displayTopScores } from './scoreModule.js';
//import { gameAdmin } from './gameAdminModule.js'; 

const choice = displayMainMenu();

switch (choice) {
    case 'Play':
        startGame();
        break;
    case 'Game Admin':
        gameAdmin();
        break;
    case 'Top 5 Scores':
        displayTopScores();
        break;
    case 'Cancel':
        console.log(chalk.red('Exiting...'));
        break;
    default:
        console.log(chalk.red('Invalid choice. Please try again.'));
        break;
}
