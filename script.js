const body = document.querySelector("body");
const toggleSwitch = document.getElementById("toggle-switch");
const welcomeText = document.getElementById("welcome-text");
const textContainer = document.getElementById("text-container");
const optionsContainer = document.getElementById("options-container");
const options = document.querySelectorAll(".option");
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
  setTimeout(() => {
    body.classList.toggle("dark-mode");
  }, 200);
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

    // Create each asnwer option
    answerOptions.forEach((answerOption, index) => {
      const option = document.createElement("div");
      option.className = "option";
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
    submitButton.classList.add("btn", "text-preset-4-medium");
    submitButton.textContent = "Submit answer";

    answersContainer.append(submitButton);

    optionsContainer.append(answersContainer);

    // Continue with check and submit answer....

    console.log(quiz);
  }
}

// EventListeners
toggleSwitch.addEventListener("click", darkMode);

optionsContainer.addEventListener("click", (e) => {
  startQuiz(e);
})

getData();