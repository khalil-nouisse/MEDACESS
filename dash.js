let menuicn = document.querySelector(".menuicn");
let nav = document.querySelector(".navcontainer");

menuicn.addEventListener("click", () => {
    nav.classList.toggle("navclose");
})
function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll('.box-container').forEach(section => {
      section.style.visibility="hidden";
  });

  // Show the selected section
  document.getElementById(sectionId).style.visibility = 'visible';
  document.querySelectorAll('.nav-option').forEach(option => {
    option.classList.remove('active-option');
    event.currentTarget.classList.add('active-option');
});
}

// Show only the Dashboard by default
document.addEventListener("DOMContentLoaded", function () {
  document.querySelector(".nav-option").classList.add("active-option");
  showSection('dashboard');
});