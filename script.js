function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll("main section").forEach(section => {
      section.style.display = "none";
  });

  // Show the selected section
  document.getElementById(sectionId).style.display = "block";

  // Remove active class from all sidebar items
  document.querySelectorAll(".sidebar ul li").forEach(item => {
      item.classList.remove("active");
  });

  // Add active class to clicked sidebar item
  event.currentTarget.classList.add("active");
}

