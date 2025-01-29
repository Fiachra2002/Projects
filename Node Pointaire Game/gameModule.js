import { readFileSync } from 'fs'; 
import inquirer from 'inquirer';
import chalk from 'chalk';
import readlineSync from 'readline-sync';
import { updateScore } from './scoreModule.js';
import { apply50_50, callAFriend, askTheAudience } from './lifelinesModule.js'; 

// Function to start the game
function startGame() {
    // Starting the game
    console.log("Starting the game..."); 

    // Asking for the user's name
    const userName = readlineSync.question(chalk.yellow('Enter your name: '));

    // Initializing variables for score, question count, and lifelines usage
    let pointTally = 0, questionCount = 0;
    let lifelinesUsed = {'50/50': false, 'Phone a Friend': false, 'Ask the Audience': false}; 

    // Loading questions from a file
    const questions = JSON.parse(readFileSync('questions.json')); 

    // Function to generate a random integer
    const getRandomInt = max => Math.floor(Math.random() * max);

    // Function to shuffle questions
    function shuffleQuestions() {
        for (let i = questions.quiz.length - 1; i > 0; i--) {
            const j = getRandomInt(i + 1);
            [questions.quiz[i], questions.quiz[j]] = [questions.quiz[j], questions.quiz[i]]; // Shuffle the questions
        }
    }

    // Function to ask a question
    function askQuestion(index) {
        const { question, content } = questions.quiz[index]; // Get question and its choices
        console.log(chalk.green.bold(`\nQuestion: ${question}`)); // Display the question
        content.forEach((choice, i) => console.log(chalk.yellow(` ${String.fromCharCode(97 + i)}. ${choice}`))); // Display the choices (unicode)
    }

    // Function to check if the answer is correct
    function checkAnswer(index, answer) {
        return answer.toLowerCase() === questions.quiz[index].correct.toLowerCase(); // Check if the provided answer is correct
    }

    // Function to apply a lifeline
    async function applyLifeline() {
        // Ask user to choose a lifeline
        const { lifeline } = await inquirer.prompt([{type: 'list', name: 'lifeline', message: 'Choose a lifeline:', choices: ['50/50', 'Phone a Friend', 'Ask the Audience']}]); 
        if (lifelinesUsed[lifeline]) {
            console.log(`You've already used ${lifeline} lifeline.`);
        } else {
            // Applying selected lifeline
            const lifelineFunctions = { '50/50': apply50_50, 'Phone a Friend': callAFriend, 'Ask the Audience': askTheAudience };
            lifelineFunctions[lifeline](questions, questionCount);
            lifelinesUsed[lifeline] = true; // Mark the lifeline as used
        }
    }

    // Main game loop
    async function main() {
        shuffleQuestions();
        while (questionCount < 15) {
            console.log(chalk.magenta.underline(`\nPlayer: ${userName}`));
            console.log(chalk.blue(`\nCurrent points: ${pointTally}`));
            console.log(chalk.cyan(`Current Question: ${questionCount + 1}`));
            askQuestion(questionCount);
            const { answer } = await inquirer.prompt([{type: 'input', name: 'answer', message: 'Your answer (a, b, c, d), lifeline (L)?:'}]); 
            const userAnswer = answer.toLowerCase();
            if (userAnswer === 'l') {
                await applyLifeline(); 
            } else if (checkAnswer(questionCount, userAnswer)) {
                pointTally += 1;
                questionCount++;
                console.log(chalk.green('Correct answer!'));
            } else {
                console.log(chalk.red(`Wrong answer. Game over. You scored ${pointTally} points`)); 
                break; 
            }
        }
        if (questionCount === 15) {
            console.log(chalk.green('Congratulations! You win!'));
        }
        updateScore(userName, pointTally);
    }

    main(); 
}

export default startGame; // Export the startGame function as the default export
