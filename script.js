const body = document.querySelector("body");
const toggleSwitch = document.getElementById("toggle-switch");
const welcomeText = document.getElementById("welcome-text");
const textContainer = document.getElementById("text-container");
const optionsContainer = document.getElementById("options-container");
const options = document.querySelectorAll(".option");
const headerQuizSubject = document.getElementById("header-quiz-subject");

let questionNumber = 1;
// Function to get data from data.json
let quizData = [];

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
    // headerQuizSubject.classList.remove("hidden");
    const headerImg = document.createElement("img");
    headerImg.classList.add("option-icon", `option-icon-${quiz.title.toLowerCase()}`);
    headerImg.src = quiz.icon;
    const headerSubjectText = document.createElement("p");
    headerSubjectText.className = "text-preset-4-medium";    headerSubjectText.textContent = quiz.title;
    headerQuizSubject.append(headerImg, headerSubjectText);

    // Clear welcome text and show first question
    textContainer.removeChild(welcomeText);



    
    // textContainer.innerHTML = `
    //   <div class="question-container">
    //       <p class="subtext text-preset-6-italic">
    //         Question <span>${questionNumber}</span> of 10
    //       </p>
    //       <p class="text-preset-3-medium">
    //         Which of these color contrast ratios defines the minimum WCAG 2.1
    //         Level AA requirement for normal text?
    //       </p>
    //       <div class="progress-bar">
    //         <div class="progress-inner"></div>
    //       </div>
    //     </div>
    // `;

    console.log(quiz);
  }
}

// Show question
function showQuestion(topic) {
  // const quiz = quizData.find(q => q.title === topic);
  // console.log(quiz);
}

// EventListeners
toggleSwitch.addEventListener("click", darkMode);

optionsContainer.addEventListener("click", (e) => {
  startQuiz(e);
})

getData();