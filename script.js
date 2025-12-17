const body = document.querySelector("body");
const toggleSwitch = document.getElementById("toggle-switch");
const welcomeText = document.getElementById("welcome-text");
const textContainer = document.getElementById("text-container");
const optionsContainer = document.getElementById("options-container");
// const options = document.querySelectorAll(".option");
const headerQuizSubject = document.getElementById("header-quiz-subject");

let questionCount = 1;
let quizData = [];

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

// Start Quiz
function startQuiz(e) {
  const id = e.target.closest(".option")?.id;

  if(!id) {
    return;
  } else {
    console.log(id);
    console.log(quizData)
    const quiz = quizData.find(q => q.title === id);

    // Show subject in header
    const headerImg = document.createElement("img");
    headerImg.classList.add("option-icon", `option-icon-${quiz.title.toLowerCase()}`);
    headerImg.src = quiz.icon;
    const headerSubjectText = document.createElement("p");
    headerSubjectText.className = "text-preset-4-medium";    headerSubjectText.textContent = quiz.title;
    headerQuizSubject.append(headerImg, headerSubjectText);

    // Clear welcome text and show first question
    textContainer.replaceChildren();

    const questionContainer = document.createElement("div");
    questionContainer.className = "question-container";

    const questionSubtext = document.createElement("p");
    questionSubtext.classList.add("subtext", "text-preset-6-italic");
    questionSubtext.textContent = `Question ${questionCount} of 10`;

    const question = document.createElement("p");
    question.className = "text-preset-3-medium";
    question.textContent = quiz.questions[questionCount - 1].question;

    const progressBar = document.createElement("div");
    progressBar.className = "progress-bar";

    const progressBarInner = document.createElement("div");
    progressBarInner.className = "progress-inner";
    progressBar.append(progressBarInner);

    progressBarInner.style.width = `${questionCount * 10}%`;
    
    questionContainer.append(questionSubtext, question, progressBar);
    textContainer.append(questionContainer);

    // Clear options and show render possible answers
    optionsContainer.replaceChildren();

    const answersContainer = document.createElement("div");
    answersContainer.className = "answers-container";
    const answerOptions = quiz.questions[questionCount - 1].options;

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
      const answer = document.createElement("p");
      answer.classList.add("answer", "text-preset-4-medium");
      answer.textContent = answerOption;
      const answerIcon = document.createElement("img");
      answerIcon.classList.add("answer-icon", "hidden");

      div.append(letter, answer, answerIcon);
      option.append(div);

      answersContainer.append(option);
    })

    // Create submit answer button
    const submitButton = document.createElement("button");
    submitButton.id = "submit-btn";
    submitButton.classList.add("btn", "text-preset-4-medium");
    submitButton.textContent = "Submit answer";
    submitButton.disabled = true;

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

    // Submit & check answer
    answersContainer.addEventListener("click", (e) => {
      const option = e.target.closest(".answer-option");
      if(!option) return;
      
      document.querySelectorAll(".answer-option").forEach((el) => {
        el.classList.remove("selected");
      })

      option.classList.add("selected");
      submitButton.disabled = false;

      // Verder gaan met submit & antwoord check

      const chosenIndex = option.dataset.index;
      const chosenAnswer = quiz.questions[questionCount - 1].options[chosenIndex];

      console.log(chosenAnswer);
    })

    console.log(quiz);
  }

  
}

// EventListeners
toggleSwitch.addEventListener("click", darkMode);

optionsContainer.addEventListener("click", (e) => {
  startQuiz(e);
})

getData();