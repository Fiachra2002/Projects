import fs from 'fs'; // Import the fs (file system) module to work with files
import inquirer from 'inquirer'; // Import the inquirer module for interactive command-line prompts

const questionsFilePath = './Questions.json'; // Define the path to the questions file

// Function to load questions from the JSON file
function loadQuestions() {
  const questionsData = fs.readFileSync(questionsFilePath); // Read the content of the file
  return JSON.parse(questionsData); // Parse the content as JSON and return it
}

// Function to save questions to the JSON file
function saveQuestions(questions) {
  fs.writeFileSync(questionsFilePath, JSON.stringify(questions, null, 2)); // Write the questions back to the file
}

// Function to delete a question
function deleteQuestion() {
  const questions = loadQuestions(); // Load questions from the file

  // Create choices for the user to select which question to delete
  const choices = questions.quiz.map((q, index) => ({
    name: `${index + 1}. ${q.question}`,
    value: index
  }));

  // Prompt the user to select a question for deletion
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'questionIndex',
        message: 'Select a question to delete:',
        choices: choices
      }
    ])
    .then((answers) => {
      const index = answers.questionIndex;
      questions.quiz.splice(index, 1); // Remove the selected question from the array

      saveQuestions(questions); // Save the updated questions back to the file

      console.log(`Question ${index + 1} has been deleted.`);
    });
}

// Main function for Game Admin menu
export default function gameAdmin() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'adminChoice',
        message: 'Game Admin Menu:',
        choices: [
          'View Questions',
          'Add Question',
          'Edit Question',
          'Delete Question'
        ]
      }
    ])
    .then((answers) => {
      switch (answers.adminChoice) {
        case 'View Questions':
          // Add logic to view questions
          break;
        case 'Add Question':
          // Add logic to add a question
          break;
        case 'Edit Question':
          // Add logic to edit a question
          break;
        case 'Delete Question':
          deleteQuestion(); // Call the deleteQuestion function
          break;
        default:
          console.log('Invalid choice. Please try again.');
          break;
      }
    });
}
