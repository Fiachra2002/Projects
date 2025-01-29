// Importing necessary functions from the 'fs' module
import { readFileSync, writeFileSync } from 'fs';

// Function to update user's score
function updateScore(userName, points) {
    // Read the score data from 'score.json' file
    const scoreData = JSON.parse(readFileSync('score.json', 'utf-8'));

    // Check if the user's score is higher than the existing score or if the user is new
    if (!scoreData[userName] || scoreData[userName] < points) {
        // Update the user's score in the score data
        scoreData[userName] = points;
        
        // Write the updated score data back to 'score.json' file
        writeFileSync('score.json', JSON.stringify(scoreData));
    }
}

// Function to get the top 5 scores
function getTopScores() {
    // Read the score data from 'score.json' file
    const scoreData = JSON.parse(readFileSync('score.json', 'utf-8'));
    
    // Sort the scores in descending order and take the top 5
    const sortedScores = Object.entries(scoreData)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    return sortedScores;
}

// Function to display the top scores
function displayTopScores() {
    // Get the top scores
    const topScores = getTopScores();
    
    // Print the top scores to the console
    console.log('Top Scores:');
    topScores.forEach(([name, score]) => {
        console.log(`${name}: ${score}`);
    });
}

// Exporting the functions to be used in other modules
export { updateScore, getTopScores, displayTopScores };
