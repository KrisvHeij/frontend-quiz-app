const body = document.querySelector("body");
const toggleSwitch = document.getElementById("toggle-switch");
const welcomeText = document.getElementById("welcome-text");
const textContainer = document.getElementById("text-container");
const optionsContainer = document.getElementById("options-container");
const answersContainer = document.querySelector(".answer-container");
// const options = document.querySelectorAll(".option");
const headerQuizSubject = document.getElementById("header-quiz-subject");

let questionContainer, questionSubtext, question, progressBarInner, answerOptions, answerText, submitButton, selectedOption;
let quizData = [];
let quiz = null;

const state = {
  currentQuestionIndex : 0,
  selectedOptionIndex: null,
  score: 0
}

// Function to get data from data.json
async function getData() {
  const response = await fetch("./data.json");
  const data = await response.json();

  quizData = data.quizzes;
}

// Function for toggling dark mode
function darkMode() {
  body.classList.toggle("dark-mode");
}

// Function for checking/submitting answer
function selectAnswer() {
  // selectedOption = null;
      const option = e.target.closest(".answer-option");
      if(!option) return;
      
      document.querySelectorAll(".answer-option").forEach((el) => {
        el.classList.remove("selected");
      })
        
      errorMsg.classList.add("hidden");
      option.classList.add("selected");
      
      state.selectedOptionIndex = Number(option.dataset.index);
}  

// Function for next question
function nextQuestion() {
  state.currentQuestionIndex++;
  // Update question container
  questionSubtext.textContent = `Question ${state.currentQuestionIndex + 1} of 10`;
  question.textContent = quiz.questions[state.currentQuestionIndex].question;
  // Update progressbar
  progressBarInner.style.width = `${(state.currentQuestionIndex + 1)* 10}%`;
  // Update answer container
  // Remove previous styles
  const options =  document.querySelectorAll(".option");
  options.forEach((option) => {
    option.classList.remove("option-disabled", "selected", "correct", "false");
    const icon = option.querySelector("img");
    icon.classList.add("hidden");
  })
  answerOptions = quiz.questions[state.currentQuestionIndex].options;
  const answerTexts = document.querySelectorAll(".answer");
  answerOptions.forEach((answerOption, index) => {
    answerTexts[index].textContent = answerOption;
  })
  submitButton.textContent = "Submit answer";

}

// Start Quiz
function startQuiz(e) {
  const id = e.target.closest(".option")?.id;

  if(!id) {
    return;
  } else {
    quiz = quizData.find(q => q.title === id);

    // Show subject in header
    const headerImg = document.createElement("img");
    headerImg.classList.add("option-icon", `option-icon-${quiz.title.toLowerCase()}`);
    headerImg.src = quiz.icon;
    const headerSubjectText = document.createElement("p");
    headerSubjectText.className = "text-preset-4-medium";    
    headerSubjectText.textContent = quiz.title;
    headerQuizSubject.append(headerImg, headerSubjectText);

    // Clear welcome text and show first question
    textContainer.replaceChildren();

    questionContainer = document.createElement("div");
    questionContainer.className = "question-container";

    questionSubtext = document.createElement("p");
    questionSubtext.classList.add("subtext", "text-preset-6-italic");
    questionSubtext.textContent = `Question ${state.currentQuestionIndex + 1} of 10`;

    question = document.createElement("p");
    question.className = "text-preset-3-medium";
    question.textContent = quiz.questions[state.currentQuestionIndex].question;

    const progressBar = document.createElement("div");
    progressBar.className = "progress-bar";

    progressBarInner = document.createElement("div");
    progressBarInner.className = "progress-inner";
    progressBar.append(progressBarInner);

    progressBarInner.style.width = `${(state.currentQuestionIndex + 1)* 10}%`;
    
    questionContainer.append(questionSubtext, question, progressBar);
    textContainer.append(questionContainer);

    // Clear options and show render possible answers
    optionsContainer.replaceChildren();

    answersContainer = document.createElement("div");
    answersContainer.className = "answers-container";
    answerOptions = quiz.questions[state.currentQuestionIndex].options;

    // Create each answer option
    answerOptions.forEach((answerOption, index) => {
      const option = document.createElement("div");
      option.classList.add("option", "answer-option");
      option.dataset.index = index;
      const div = document.createElement("div");
      const letterOptions = ["A", "B", "C", "D"];
      const letter = document.createElement("p");
      letter.classList.add("option-icon", "option-letter", "text-preset-4-medium");
      letter.textContent = letterOptions[index];
      answerText = document.createElement("p");
      answerText.classList.add("answer", "text-preset-4-medium");
      answerText.textContent = answerOption;
      const answerIcon = document.createElement("img");
      answerIcon.classList.add("answer-icon", "hidden");

      div.append(letter, answerText, answerIcon);
      option.append(div);

      answersContainer.append(option);
    })

    // Create submit answer button
    submitButton = document.createElement("button");
    submitButton.id = "submit-btn";
    submitButton.classList.add("btn", "text-preset-4-medium");
    submitButton.textContent = "Submit answer";

    answersContainer.append(submitButton);

    // Create error message
    const errorMsg = document.createElement("div");
    errorMsg.id = "error-msg";
    errorMsg.classList.add("error-msg", "hidden");
    const errorMsgIcon = document.createElement("img");
    errorMsgIcon.src = "./assets/images/icon-error.svg";
    const errorMsgText = document.createElement("p");
    errorMsgText.textContent = "Please select an answer";

    errorMsg.append(errorMsgIcon, errorMsgText);
    answersContainer.append(errorMsg);

    optionsContainer.append(answersContainer);

    let chosenAnswer = null;
    let correctAnswer = null;
    submitButton.addEventListener("click", () => {
      if(!selectedOption) {
        errorMsg.classList.remove("hidden");
        return;
      }
      
      state.selectedOptionIndex = Number(selectedOption.dataset.index);
      chosenAnswer = quiz.questions[state.currentQuestionIndex].options[state.selectedOptionIndex];
      const question = quiz.questions[state.currentQuestionIndex];
      correctAnswer = question.answer;

      const icon = selectedOption.querySelector("img");
      
      if (chosenAnswer === correctAnswer) {
        state.score++;
        icon.src = "./assets/images/icon-correct.svg";
        icon.classList.remove("hidden");
        selectedOption.classList.add("correct");
      } else {
        icon.src = "./assets/images/icon-incorrect.svg";
        icon.classList.remove("hidden");
        selectedOption.classList.add("false");

        const correctIndex = question.options.indexOf(correctAnswer);
        const correctOption = document.querySelector(`.answer-option[data-index="${correctIndex}"]`);

        if (correctOption) {
          const correctOptionIcon = correctOption.querySelector("img");
          correctOptionIcon.src = "./assets/images/icon-correct.svg";
          correctOptionIcon.classList.remove("hidden");
        }
      }

      console.log("Score: " + state.score);

      // Disable options
      document.querySelectorAll(".answer-option").forEach((el) => {
        el.classList.add("option-disabled");
      })

      // Verder gaan met next Question optie + score bijhouden
      submitButton.textContent = "Next question";
      submitButton.addEventListener("click", () => {
        nextQuestion();
      })
      
    })

    console.log(quiz);
    
  }
}

// EventListeners
toggleSwitch.addEventListener("click", darkMode);

optionsContainer.addEventListener("click", (e) => {
  startQuiz(e);
})

answersContainer.addEventListener("click", (e) => {
  selectAnswer();
})


// Function to wait for data & start quiz
async function init() {
  await getData();
}

init();

// Aparte functions maken en eventListeners uit de functies halen