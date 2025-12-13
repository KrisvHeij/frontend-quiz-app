const body = document.querySelector("body");
const toggleSwitch = document.getElementById("toggle-switch");
const optionsContainer = document.getElementById("options-container");
const options = document.querySelectorAll(".option");


// options.forEach((option) => {
//   option.addEventListener("click", (e) => {
//     console.log(e.currentTarget.id);
//     })
// })

// Function for toggling dark mode
function darkMode() {
  setTimeout(() => {
    body.classList.toggle("dark-mode");
  }, 200);
}


function chooseOption(event) {
  const option = event.target.closest(".option");
  if (!option) {
    return;
  }
  console.log(option.id);
}

// EventListeners
toggleSwitch.addEventListener("click", darkMode);

optionsContainer.addEventListener("click", (e) => {
  chooseOption(e);
})