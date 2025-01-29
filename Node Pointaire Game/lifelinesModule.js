import inquirer from 'inquirer';
import chalk from 'chalk';

function apply50_50(questions, questionCount) {
    console.log('Implementing 50/50 logic...'); // Indicate that 50/50 logic is being applied
    const { correct } = questions.quiz[questionCount]; // Get the correct answer for the current question
    const options = ['a', 'b', 'c', 'd']; // Define answer options
    const filteredOptions = options.filter(option => option !== correct.toLowerCase()); // Remove the correct answer from options
    const eliminatedAnswers = [];
    for (let i = 0; i < 2; i++) {
        const randomIndex = Math.floor(Math.random() * filteredOptions.length);
        eliminatedAnswers.push(filteredOptions[randomIndex]);
        filteredOptions.splice(randomIndex, 1);
    }
    questions.quiz[questionCount].content.forEach((choice, i) => eliminatedAnswers.includes(String.fromCharCode(97 + i).toLowerCase()) || console.log(chalk.yellow(` ${String.fromCharCode(97 + i)}. ${choice}`))); // Display remaining choices
}

function callAFriend(questions, questionCount) {
    const correctAnswer = questions.quiz[questionCount].correct; // Get the correct answer for the current question

    // Determine the friend's answer 
    const friendChance = Math.random();
    let friendAnswer;

    if (friendChance <= 0.6) {
        friendAnswer = correctAnswer; // If random chance is less than or equal to 0.6, the friend gives the correct answer
    } else {
        const options = ['a', 'b', 'c', 'd'].filter(option => option !== correctAnswer); // Create an array of incorrect options
        friendAnswer = options[Math.floor(Math.random() * 3)]; // Randomly select an incorrect option
    }

    console.log(`Friend thinks the answer is: ${friendAnswer}`); // Display the friend's answer
}

function askTheAudience(questions, questionCount) {
    const correctAnswer = questions.quiz[questionCount].correct; // Get the correct answer for the current question

    const audiencePercentages = [0, 0, 0, 0]; // Initialize an array to hold audience percentages
    let totalPercentage = 0; // Initialize a variable to keep track of the total percentage

    for (let i = 0; i < 4; i++) { // Loop through the answer choices
        if (correctAnswer.toLowerCase() === String.fromCharCode(97 + i)) { // If the answer choice is the correct answer
            const percentage = Math.floor(Math.random() * 60) + 30; // Generate a random percentage between 30 and 90
            totalPercentage += audiencePercentages[i] = percentage;
        } else {
            totalPercentage += audiencePercentages[i] = Math.floor(Math.random() * 20); // Generate a random percentage between 20 and 40 for incorrect choices
        }
    }

    const remainingPercentage = 100 - totalPercentage;
    audiencePercentages[Math.floor(Math.random() * 3)] += remainingPercentage; // Distribute remaining percentage randomly

    console.log('Audience percentages:');

    ['a', 'b', 'c', 'd'].forEach((option, i) => console.log(` ${option.toUpperCase()}. ${option}: ${audiencePercentages[i]}%`)); // Display percentages
}

export { apply50_50, callAFriend, askTheAudience };
