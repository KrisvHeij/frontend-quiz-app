const body = document.querySelector("body");
const toggleSwitch = document.getElementById("toggle-switch");
const welcomeText = document.getElementById("welcome-text");
const textContainer = document.getElementById("text-container");
const options = document.getElementById("options");
const optionsContainer = document.querySelector(".options-container");
const headerQuizSubject = document.getElementById("header-quiz-subject");
const answersContainer = document.querySelector(".answers-container");

let quizData = [];

const state = {
  currentQuestionIndex : 0,
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
  data.forEach((quiz, index) => {
    const option = document.createElement("div");
    option.className = "option";
    option.dataset.index = index;
    const div = document.createElement("div");
    const img = document.createElement("img");
    img.classList.add("option-icon", `option-icon-${quiz.title.toLowerCase()}`);
    img.src = quiz.icon;
    const p = document.createElement("p");
    p.classList.add("option-text", "text-preset-4-medium");
    p.textContent = `${quiz.title}`;

    div.append(img, p);
    option.append(div);
    optionsContainer.append(option);
  })
}

// Update state
function handleSelect(e) {
  state.selectedOptionIndex = e.target.closest(".option").dataset.index;

  startQuiz(quizData[state.selectedOptionIndex]);
  console.log(quizData[state.selectedOptionIndex]);
}

// Render Header icon & quiz
function renderHeader() {
  const subjectImg = document.createElement("img");
  subjectImg.classList.add("option-icon", `option-icon-${quizData[state.selectedOptionIndex].title.toLowerCase()}`);
  subjectImg.src = quizData[state.selectedOptionIndex].icon;
  const subjectTitle = document.createElement("p");
  subjectTitle.className = "text-preset-4-medium";
  subjectTitle.textContent = quizData[state.selectedOptionIndex].title;
  // Append all elements to header
  headerQuizSubject.append(subjectImg, subjectTitle);
}

// Show first Question
function startQuiz(quiz) {

  // Opsplitsen in (question + answers) function 


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


  // 4. Antwoorden renderen
  // Answer container
  // Empty options container
  options.replaceChildren();
  
  const answersContainer = document.createElement("div");
  answersContainer.className = "answers-container";
  // Create options with answers
  const answerOptions = quiz.questions[state.currentQuestionIndex].options;
  answerOptions.forEach((answer, index) => {
    const option = document.createElement("div");
    option.classList.add("option", "answer-option");
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
  errorMsg.src = "./assets/images/icon-error.svg";

  // Append submit button & error message to answers container
  answersContainer.append(submitBtn, errorMsg);
  options.append(answersContainer);
}

// Function to wait for data & start quiz
async function init() {
  quizData = await getData();
  
  renderStartScreen(quizData);
  console.log(quizData);
}

init();

// EventListeners
toggleSwitch.addEventListener("click", darkMode);

optionsContainer.addEventListener("click", (e) => {
  handleSelect(e);
})