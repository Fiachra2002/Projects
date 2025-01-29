import readlineSync from 'readline-sync';
import chalk from 'chalk';

function displayMainMenu() {
    console.log(chalk.green("Node Pointaire Game"));
    console.log(chalk.green("*****************************"));
    var Men1 = [chalk.cyan('Play'), chalk.cyan('Game Admin'), chalk.cyan('Top 5 Scores')];
    var index = readlineSync.keyInSelect(Men1, chalk.yellow('Choose option: '));

    switch (index) {
        case 0:
            return 'Play';
        case 1:
            return 'Game Admin';
        case 2:
            return 'Top 5 Scores';
        default:
            return 'Cancel';
    }
}

export default displayMainMenu;
