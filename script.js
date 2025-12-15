const body = document.querySelector("body");
const toggleSwitch = document.getElementById("toggle-switch");
const optionsContainer = document.getElementById("options-container");
const options = document.querySelectorAll(".option");


// options.forEach((option) => {
//   option.addEventListener("click", (e) => {
//     console.log(e.currentTarget.id);
//     })
// })

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

// Function to start quiz
function startQuiz(e) {
  const id = e.target.closest(".option")?.id;

  if(!id) {
    return;
  } else {
    console.log(id);
    // console.log(quizData);
    showQuestion(id);
  }
}

// Show question
function showQuestion(topic) {
  const quiz = quizData.find(q => q.title === topic);
  console.log(quiz);
}

// EventListeners
toggleSwitch.addEventListener("click", darkMode);

optionsContainer.addEventListener("click", (e) => {
  startQuiz(e);
})

getData();