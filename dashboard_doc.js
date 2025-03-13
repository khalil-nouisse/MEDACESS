//function to display a section and hide others
function showSection(sectionId) {
  // hide all sections
  document.querySelectorAll("main section").forEach(section => {
      section.style.display = "none";
  });

  // display the selected section
  document.getElementById(sectionId).style.display = "block";

  // delete active from all li of the sidebar
  document.querySelectorAll(".sidebar ul li").forEach(item => {
      item.classList.remove("active");
  });

  // Add the active for the selected section
  const clickedItem = document.querySelector(`.sidebar ul li[onclick*="${sectionId}"]`);
  if (clickedItem) {
      clickedItem.classList.add("active");
  }
  //if the section si history
  if (sectionId === "history") {
    displayHealthHistory();
}

//if its the patient sections
if (sectionId === "patients") {
    displayPatients();
}
}
const patients = [
  { name: "Samir Alami", cin: "GK22345" },
  { name: "Ahmed Hamid", cin: "AB3Y8273" },
  { name: "Oumaima belabbas", cin: "PH77738" },
  { name: "Imane benAli", cin: "Y47747" },
];
function displayPatients() {
  const patientsList = document.getElementById("patients-list");

  // Empty existent content
  patientsList.innerHTML = "";

  // add patient to the list
  patients.forEach((patient) => {
      const patientCard = document.createElement("div");
      patientCard.classList.add("patient-card");

      const patientName = document.createElement("h3");
      patientName.textContent = patient.name;

      const patientCin = document.createElement("p");
      patientCin.textContent = patient.cin;

      patientCard.appendChild(patientName);
      patientCard.appendChild(patientCin);

      patientsList.appendChild(patientCard);
  });
}

const patientsdata = [
  { name: "Samir Alami", cin: "GK22345", age: 30, bloodType: "A+", history: "No allergies" },
  { name: "Ahmed Hamid", cin: "AB3Y8273", age: 40, bloodType: "B+", history: "Diabetes" },
  { name: "Oumaima Belabbas", cin: "PH77738", age: 25, bloodType: "O-", history: "No medical issues" },
  { name: "Imane BenAli", cin: "Y47747", age: 35, bloodType: "AB+", history: "Asthma" },
];

// Function to display Health History section and dynamically create the input
function displayHealthHistory() {
  const historySection = document.getElementById("history");
  const patientDataContainer = document.getElementById("patient-data");

  // Check if the CIN input and button already exist. If they do, return early.
  if (document.getElementById("cin-input")) return;

  // Clear previous content (CIN input and patient data)
  historySection.innerHTML = ""; // Clear entire section

  // Create and append the CIN input and submit button
  const cinInput = document.createElement("input");
  cinInput.setAttribute("type", "text");
  cinInput.setAttribute("id", "cin-input");
  cinInput.placeholder = "Enter Patient CIN";

  const submitButton = document.createElement("button");
  submitButton.textContent = "View Patient Data";
  submitButton.setAttribute("onclick", "displayPatientData()");

  historySection.appendChild(cinInput);
  historySection.appendChild(submitButton);

  // Create the container for patient data
  const patientDataContainerDiv = document.createElement("div");
  patientDataContainerDiv.setAttribute("id", "patient-data");
  historySection.appendChild(patientDataContainerDiv);
}

// Function to display patient data based on CIN entered
function displayPatientData() {
  const cinInput = document.getElementById("cin-input").value;
  const patientDataContainer = document.getElementById("patient-data");

  // Find the patient by CIN
  const patient = patientsdata.find(p => p.cin === cinInput);

  if (patient) {
    // If the patient is found, display their data
    const patientInfo = `
      <h3>Patient Information</h3>
      <p><strong>Name:</strong> ${patient.name}</p>
      <p><strong>CIN:</strong> ${patient.cin}</p>
      <p><strong>Age:</strong> ${patient.age}</p>
      <p><strong>Blood Type:</strong> ${patient.bloodType}</p>
      <p><strong>Health History:</strong> ${patient.history}</p>
    `;
    patientDataContainer.innerHTML = patientInfo;
  } else {
    // If no patient is found, display an error message
    patientDataContainer.innerHTML = "<p>Patient not found. Please check the CIN and try again.</p>";
  }
}