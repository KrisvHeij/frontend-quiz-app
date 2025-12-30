const body = document.querySelector("body");
const toggleSwitch = document.getElementById("toggle-switch");
const textContainer = document.getElementById("text-container");
const options = document.getElementById("options");
const optionsContainer = document.querySelector(".options-container");
const headerQuizSubject = document.getElementById("header-quiz-subject");
const answersContainer = document.querySelector(".answers-container");
const resultContainer = document.querySelector(".result-container");

let quizData = [];

const state = {
  selectedQuizIndex: null,
  currentQuestionIndex: 0,
  selectedOptionIndex: null,
  score: 0
}

// Function to get data from data.json
async function getData() {
  const response = await fetch("./data.json");
  const data = await response.json();

  return data.quizzes;
}

// Function for toggling dark mode
function darkMode() {
  body.classList.toggle("dark-mode");
}

// Render start screen / Show quiz options
function renderStartScreen(data) {
  // Create welcome text
  const headerDiv = document.createElement("div");
  const header = document.createElement("h1");
  header.className = "text-preset-2-light";
  header.textContent = "Welcome to the";
  const headerSpan = document.createElement("span");
  headerSpan.className = "text-preset-2-medium";
  headerSpan.textContent = "Frontend Quiz!";
  const subText = document.createElement("p");
  subText.classList.add("subtext", "text-preset-6-italic");
  subText.textContent = "Pick a subject to get started";
  // Append all element to container
  header.append(headerSpan);
  headerDiv.append(header, subText);
  textContainer.append(headerDiv);

  // Create options for quizzes
  data.forEach((quiz, index) => {
    const option = document.createElement("div");
    option.className = "option";
    option.dataset.index = index;
    const div = document.createElement("div");
    const img = document.createElement("img");
    img.classList.add("option-icon", `option-icon-${quiz.title.toLowerCase()}`);
    img.src = quiz.icon;
    img.alt = "";
    const p = document.createElement("p");
    p.classList.add("option-text", "text-preset-4-medium");
    p.textContent = `${quiz.title}`;

    div.append(img, p);
    option.append(div);
    optionsContainer.append(option);
    // options.append(optionsContainer);
  })
}

// Update state
function handleQuizSelect(e) {
  const closestQuizOption = e.target.closest(".option");
  if (closestQuizOption === null) {
    return;
  }
  
  state.selectedQuizIndex = e.target.closest(".option").dataset.index;

  startQuiz(quizData[state.selectedQuizIndex]);
}

// Render Header icon & quiz
function renderHeader(quiz) {
  const subjectImg = document.createElement("img");
  subjectImg.classList.add("option-icon", `option-icon-${quiz.title.toLowerCase()}`);
  subjectImg.src = quiz.icon;
  subjectImg.alt = "";
  const subjectTitle = document.createElement("p");
  subjectTitle.className = "text-preset-4-medium";
  subjectTitle.textContent = quiz.title;
  // Append all elements to header
  headerQuizSubject.append(subjectImg, subjectTitle);
}

// Render question & answers options
function renderQuestion(quiz) {
  // Question container
  // Empty text container
  textContainer.replaceChildren();
  // Create element for question container
  const questionContainer = document.createElement("div");
  questionContainer.className = "question-container";
  // Subtext with question number
  const questionCountEl = document.createElement("p");
  questionCountEl.classList.add("subtext", "text-preset-6-italic");
  questionCountEl.textContent = `Question ${(state.currentQuestionIndex + 1)} of ${(quiz.questions.length)}`;
  // Question
  const questionEL = document.createElement("p");
  questionEL.className = "text-preset-3-medium";
  questionEL.textContent = quiz.questions[state.currentQuestionIndex].question;
  // Progressbar
  const progressBar = document.createElement("div");
  progressBar.className = "progress-bar";
  const progressBarInner= document.createElement("div");
  progressBarInner.className = "progress-inner";
  progressBarInner.style.width = `${((state.currentQuestionIndex + 1) / (quiz.questions.length)) * 100}%`;

  // Append all elements to text container
  progressBar.append(progressBarInner);
  questionContainer.append(questionCountEl, questionEL, progressBar);
  textContainer.append(questionContainer);

  // Answer container
  // Empty options container
  optionsContainer.replaceChildren();
  answersContainer.replaceChildren();
  
  // Create options with answers
  const answerOptions = quiz.questions[state.currentQuestionIndex].options;
  answerOptions.forEach((answer, index) => {
    const option = document.createElement("div");
    option.classList.add("option", "answer-option");
    option.dataset.index = index;
    const div = document.createElement("div");
    const letter = document.createElement("p");
    letter.classList.add("option-icon", "option-letter", "text-preset-4-medium");
    letter.textContent = String.fromCharCode(65 + index);
    const p = document.createElement("p");
    p.classList.add("answer", "text-preset-4-medium");
    p.textContent = answer;
    const img = document.createElement("img");
    img.classList.add("answer-icon", "hidden");

    // Append elements to answer container
    div.append(letter, p, img);
    option.append(div);
    answersContainer.append(option);
    options.append(answersContainer);
  })

  // Create submit button
  const submitBtn = document.createElement("button");
  submitBtn.id = "submit-btn";
  submitBtn.classList.add("btn", "text-preset-4-medium");
  submitBtn.textContent = "Submit answer";

  // Create error message
  const errorMsg = document.createElement("div");
  errorMsg.id = "error-msg";
  errorMsg.classList.add("error-msg", "hidden");
  const errorImg = document.createElement("img");
  errorImg.src = "./assets/images/icon-error.svg";
  const errorText = document.createElement("p");
  errorText.textContent = "Please select an answer";
  errorMsg.append(errorImg, errorText);

  // Append submit button & error message to answers container
  answersContainer.append(submitBtn, errorMsg);
  options.append(answersContainer);
}

function showErrorMsg() {
  const errorMsg = document.getElementById("error-msg");
  errorMsg.classList.remove("hidden");
}

function removeErrorMsg() {
  const errorMsg = document.getElementById("error-msg");
  errorMsg.classList.add("hidden");
}

// Handle answer selection
function handleAnswerSelect(e) {
  const closestAnswerOption = e.target.closest(".answer-option");
  if (closestAnswerOption === null) {
    return;
  }

  state.selectedOptionIndex = e.target.closest(".answer-option").dataset.
  index;

  renderSelectedOption();
}

// Show border on selected answer option
function renderSelectedOption() {
  const options = document.querySelectorAll(".answer-option");
  options.forEach((option) => {
    option.classList.remove("selected");
  })
  
  options[state.selectedOptionIndex].classList.add("selected");

  removeErrorMsg();
}

// Submit answer
function submitAnswer(answer) {
  if (state.selectedOptionIndex === null) {
    showErrorMsg();
    return;
  } else {
    
    const correctAnswer = quizData[state.selectedQuizIndex].questions[state.currentQuestionIndex].answer;
    const options = document.querySelectorAll(".option");
    options.forEach((option) => {
      option.classList.add("option-disabled");
    })

    // Find correct answer and show icon in option
    const icon = options[state.selectedOptionIndex].querySelector("img");
    if (answer === correctAnswer) {
      options[state.selectedOptionIndex].classList.add("correct");
      icon.src = "./assets/images/icon-correct.svg";
      icon.classList.remove("hidden");

      // Update score
      state.score ++;
    } else {
      options[state.selectedOptionIndex].classList.add("false");
      icon.src = "./assets/images/icon-incorrect.svg";
      icon.classList.remove("hidden");
      
      options.forEach((option, index) => {
        const icon = option.querySelector("img");
        const optionText = option.querySelector(".answer").textContent;

        if (optionText === correctAnswer) {
          icon.src = "./assets/images/icon-correct.svg";
          icon.classList.remove("hidden");
        }
      })
    }
  }

  // Check for last question for textcontent button
  if (state.currentQuestionIndex === (quizData[state.selectedQuizIndex].questions.length - 1)) {
    document.querySelector("#submit-btn").textContent = "Show score";
  } else {
    document.querySelector("#submit-btn").textContent = "Next question";
  }
}

function handleNextQuestion() {
  if (state.currentQuestionIndex === (quizData[state.selectedQuizIndex].questions.length - 1)) {
    renderScore();
  } else {
    state.currentQuestionIndex++;
    state.selectedOptionIndex = null;
  
    renderQuestion(quizData[state.selectedQuizIndex]);
  }
}

// Render score
function renderScore() {
  // Empty textcontainer & options
  textContainer.replaceChildren();
  answersContainer.replaceChildren();

  // Create elements for text container
  const resultHeaderEl = document.createElement("div");
  resultHeaderEl.className = "result-header";
  const header = document.createElement("h1");
  header.className = "text-preset-2-light";
  header.textContent = "Quiz completed";
  const span = document.createElement("span");
  span.className = "text-preset-2-medium";
  span.textContent = "You scored...";
  // Append elements to text container
  header.append(span);
  resultHeaderEl.append(header);
  textContainer.append(resultHeaderEl);
  
  // Create elements for options container
  const div = document.createElement("div");
  const innerDiv = document.createElement("div");
  innerDiv.className = "header-subject";
  const headerImg = document.createElement("img");
  headerImg.classList.add("option-icon", `option-icon-${quizData[state.selectedQuizIndex].title.toLowerCase()}`);
  headerImg.src = quizData[state.selectedQuizIndex].icon;
  headerImg.alt = "";
  const headerText = document.createElement("p");
  headerText.className = "text-preset-4-medium";
  headerText.textContent = quizData[state.selectedQuizIndex].title;
  const score = document.createElement("p");
  score.className = "text-preset-1-medium";
  score.textContent = state.score;
  const scoreSubtext = document.createElement("p");
  scoreSubtext.classList.add("subtext", "text-preset-5-regular");
  scoreSubtext.textContent = `out of ${quizData[state.selectedQuizIndex].questions.length}`;
  const playBtn = document.createElement("button");
  playBtn.id = "play-btn";
  playBtn.classList.add("btn", "text-preset-4-medium");
  playBtn.textContent = "Play again";
  // Append element to container
  innerDiv.append(headerImg, headerText);
  div.append(innerDiv, score, scoreSubtext);
  resultContainer.append(div, playBtn);
  options.append(resultContainer);
}

// Show first Question
function startQuiz(quiz) {
  // Render header
  renderHeader(quiz);
  // Render question & answer options
  renderQuestion(quiz);
}

function playAgain(data) {
  // Clear all containers
  headerQuizSubject.replaceChildren();
  textContainer.replaceChildren();
  resultContainer.replaceChildren();
  // Reset state
  state.selectedQuizIndex = null;
  state.currentQuestionIndex = 0;
  state.selectedOptionIndex = null;
  state.score = 0;

  renderStartScreen(data);
}

// Function to wait for data & start quiz
async function init() {
  quizData = await getData();
  
  renderStartScreen(quizData);
}

// EventListeners
toggleSwitch.addEventListener("click", darkMode);

// Select quiz
optionsContainer.addEventListener("click", (e) => {
  handleQuizSelect(e);
})

// Select answer
answersContainer.addEventListener("click", (e) => {
  if (e.target.closest(".answer-option")) {
    handleAnswerSelect(e);
  }
  
  const submitBtn = document.getElementById("submit-btn");
  if (e.target === submitBtn) {
    if (submitBtn.textContent === "Submit answer") {
      submitAnswer(quizData[state.selectedQuizIndex].questions[state.currentQuestionIndex].options[state.selectedOptionIndex]);
    } else {
      handleNextQuestion();
    }
  }  
})

resultContainer.addEventListener("click", (e) => {
  const playAgainBtn = document.getElementById("play-btn");
  if (e.target === playAgainBtn) {
    playAgain(quizData);
  }
})

// Start app
init();

// Verder gaan met playAgain()