const body = document.querySelector("body");
const toggleSwitch = document.getElementById("toggle-switch");
const welcomeText = document.getElementById("welcome-text");
const textContainer = document.getElementById("text-container");
const options = document.getElementById("options");
const optionsContainer = document.querySelector(".options-container");
const answersContainer = document.querySelector(".answers-container");
const headerQuizSubject = document.getElementById("header-quiz-subject");

// let questionContainer, questionSubtext, question, progressBarInner, answerOptions, answerText, submitButton, selectedOption;
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

  return data.quizzes;
}

// Function for toggling dark mode
function darkMode() {
  body.classList.toggle("dark-mode");
}

// Next question
function nextQuestion(e) {
  // Empty options
  options.replaceChildren();


}

// Show first Question
function showQuestion(e) {
  const option = e.target.closest(".option");

  if (!option) {
    return
  } 
    
  const currentIndex = Number(state.selectedOptionIndex = option.dataset.index);
  const currentQ = Number(state.currentQuestionIndex);

  // Show quiz topic in header
  const subjectImg = document.createElement("img");
  subjectImg.classList.add("option-icon", `option-icon-${quizData[currentIndex].title.toLowerCase()}`);
  subjectImg.src = quizData[currentIndex].icon;
  const subjectTitle = document.createElement("p");
  subjectTitle.className = "text-preset-4-medium";
  subjectTitle.textContent = quizData[currentIndex].title;
  // Append all elements to header
  headerQuizSubject.append(subjectImg, subjectTitle);

  // Question container
  // Empty text container
  textContainer.replaceChildren();
  // Create element for question container
  const questionContainer = document.createElement("div");
  questionContainer.className = "question-container";
  // Subtext with question number
  const questionCountEl = document.createElement("p");
  questionCountEl.classList.add("subtext", "text-preset-6-italic");
  questionCountEl.textContent = `Question ${(currentQ + 1)} of ${(quizData[currentIndex].questions.length)}`;
  // Question
  const questionEL = document.createElement("p");
  questionEL.className = "text-preset-3-medium";
  questionEL.textContent = quizData[currentIndex].questions[currentIndex].question;
  // Progressbar
  const progressBar = document.createElement("div");
  progressBar.className = "progress-bar";
  const progressBarInner= document.createElement("div");
  progressBarInner.className = "progress-inner";
  progressBarInner.style.width = `${(currentQ + 1) * (quizData[currentIndex].questions.length)}%`;

  // Append all elements to text container
  progressBar.append(progressBarInner);
  questionContainer.append(questionCountEl, questionEL, progressBar);
  textContainer.append(questionContainer);

  // Answer container
  // Show answers in options container
  options.replaceChildren();
  
  // Create options with answers
  const answerOptions = quizData[currentIndex].questions[currentIndex].options;
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
}

// Function to wait for data & start quiz
async function renderStartScreen() {
  quizData = await getData();
  
  quizData.forEach((quiz, index) => {
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

  console.log(quizData);
}

renderStartScreen();

// EventListeners
toggleSwitch.addEventListener("click", darkMode);

optionsContainer,addEventListener("click", (e) => {
  showQuestion(e);
})

// Eerst startQuiz om de elementen te creeeren en daarna een renderQuestion maken voor de overige vragen via de submit button