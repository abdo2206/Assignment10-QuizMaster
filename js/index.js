/**
 * ============================================
 * MAIN ENTRY POINT (index.js)
 * ============================================
 *
 * This file is the starting point of your application.
 * It handles:
 * - Getting DOM elements
 * - Form validation
 * - Starting the quiz
 * - Loading/error states
 *
 * DOM ELEMENTS TO GET:
 * - quizOptionsForm: #quizOptions
 * - playerNameInput: #playerName
 * - categoryInput: #categoryMenu
 * - difficultyOptions: #difficultyOptions
 * - questionsNumber: #questionsNumber
 * - startQuizBtn: #startQuiz
 * - questionsContainer: .questions-container
 *
 * FUNCTIONS TO IMPLEMENT:
 * - showLoading() - Display loading spinner
 * - hideLoading() - Remove loading spinner
 * - showError(message) - Display error card
 * - validateForm() - Check if form is valid
 * - showFormError(message) - Show error on form
 * - resetToStart() - Reset to initial state
 * - startQuiz() - Main function to start quiz
 */

import Quiz from "./quiz.js";
import Question from "./question.js";

// ============================================
// TODO: Get DOM Element References
// ============================================
// Use document.getElementById() and document.querySelector()
const quizOptions = document.getElementById("quizOptions");
const questionsContainer = document.getElementById("questionsContainer");
const playerName = document.getElementById("playerName");
const categoryMenu = document.getElementById("categoryMenu");
const difficultyOptions = document.getElementById("difficultyOptions");
const questionsNumber = document.getElementById("questionsNumber");
const startQuizBtn = document.getElementById("startQuiz");
const formError = document.getElementById("form-error");
const formErrorMessage = document.getElementById("form-error-message");
let formErrorTimeout = null;
// ============================================
// TODO: Create variable to store current quiz
// ============================================
// let currentQuiz = null;
let currentQuiz = null;

// ============================================
// TODO: Create showLoading() function
// ============================================
// Set questionsContainer.innerHTML to loading HTML
// See index.html for the HTML structure
// ============================================
// TODO: Create hideLoading() function
// ============================================
// Find and remove the loading overlay

function showLoading() {
  questionsContainer.innerHTML = `
    <div class="loading-overlay">
      <div class="loading-spinner"></div>
      <p class="loading-text">Loading Questions...</p>
    </div>
  `;
}

function hideLoading() {
  questionsContainer.querySelector(".loading-overlay")?.remove();
}

// ============================================
// TODO: Create showError(message) function
// ============================================
// Set questionsContainer.innerHTML to error HTML
// Include the message parameter in the display
// Add click listener to retry button that calls resetToStart()
function showError(message = "Failed to load questions. Please try again.") {
  questionsContainer.innerHTML = `
    <div class="game-card error-card">
      <div class="error-icon">
        <i class="fa-solid fa-triangle-exclamation"></i>
      </div>
      <h3 class="error-title">Oops! Something went wrong</h3>
      <p class="error-message"></p>
      <button type="button" class="btn-play retry-btn">
        <i class="fa-solid fa-rotate-right"></i> Try Again
      </button>
    </div>
    `;
  questionsContainer.querySelector(".error-message").textContent = message;
  questionsContainer.querySelector(".retry-btn").addEventListener("click", () => {
    resetToStart();
  });
}
// ============================================
// TODO: Create validateForm() function
// ============================================
// Return object: { isValid: boolean, error: string | null }
// Check:
// 1. questionsNumber has a value
// 2. Value is >= 1 (minimum questions)
// 3. Value is <= 50 (maximum questions)
function validateForm() {
  const questionsRegex = /^(?:[1-9]|[1-4]\d|50)$/;
  return {
    isValid: questionsRegex.test(questionsNumber.value),
    error: "Please enter a number of questions between 1 and 50.",
  };
}

// ============================================
// TODO: Create showFormError(message) function
// ============================================
// Create error div with class 'form-error'
// Insert before the start button
// Remove after 3 seconds with fade effect
function showFormError(message) {
  clearTimeout(formErrorTimeout);
  formError.classList.remove("hidden");
  formErrorMessage.textContent = message;
  formErrorTimeout = setTimeout(() => {
    formError.classList.add("hidden");
  }, 3000);
}
// ============================================
// TODO: Create resetToStart() function
// ============================================
// 1. Clear questionsContainer
// 2. Reset form values
// 3. Show the form (remove 'hidden' class)
// 4. Set currentQuiz = null
function resetToStart() {
  quizOptions.classList.remove("hidden");
  currentQuiz = null;
  questionsContainer.innerHTML = "";
  playerName.value = "";
  questionsNumber.value = "10";
}

// ============================================
// TODO: Create async startQuiz() function
// ============================================
// This is the main function, called when Start button is clicked
//
// Steps:
// 1. Validate the form
// 2. If not valid, show error and return
// 3. Get form values:
//    - playerName (use 'Player' if empty)
//    - category
//    - difficulty
//    - numberOfQuestions
// 4. Create new Quiz instance
// 5. Hide the form (add 'hidden' class)
// 6. Show loading spinner
// 7. Try to fetch questions:
//    - await currentQuiz.getQuestions()
//    - Hide loading
//    - Check if questions exist
//    - Create first Question and display it
// 8. Catch any errors:
//    - Hide loading
//    - Show error message
async function startQuiz() {
  const userName = playerName.value ? playerName.value : "Player";
  const formValid = validateForm();

  if (!formValid.isValid) {
    showFormError(formValid.error);
    return;
  }

  currentQuiz = new Quiz(
    categoryMenu.value,
    difficultyOptions.value,
    Number(questionsNumber.value),
    userName,
  );
  quizOptions.classList.add("hidden");
  showLoading();

  try {
    const questions = await currentQuiz.getQuestions();
    hideLoading();

    if (questions.length === 0) {
      throw new Error("No questions were available. Please try again.");
    }

    const question = new Question(
      currentQuiz,
      questionsContainer,
      resetToStart,
    );
    question.displayQuestion();
  } catch (error) {
    hideLoading();
    showError(error.message);
  }
}
// ============================================
// TODO: Add Event Listeners
// ============================================
// 1. startQuizBtn click -> call startQuiz()
// 2. questionsNumber keydown -> if Enter, call startQuiz()
startQuizBtn.addEventListener("click", () => {
  startQuiz();
});
questionsNumber.addEventListener("keydown", ({ key }) => {
  if (key == "Enter") startQuiz();
});
