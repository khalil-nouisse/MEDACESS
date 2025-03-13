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
  { name: "Samir Alami", cin: "GK22345", age: 30, bloodType: "A+", medicaments: "Aspirin", operations: "Appendectomy", vaccination: "Flu", allergies: "None" },
  { name: "Ahmed Hamid", cin: "AB3Y8273", age: 40, bloodType: "B+", medicaments: "Insulin", operations: "Knee Surgery", vaccination: "COVID-19", allergies: "Penicillin" },
  { name: "Oumaima Belabbas", cin: "PH77738", age: 25, bloodType: "O-", medicaments: "None", operations: "None", vaccination: "Hepatitis B", allergies: "Peanuts" },
  { name: "Imane BenAli", cin: "Y47747", age: 35, bloodType: "AB+", medicaments: "None", operations: "C-section", vaccination: "COVID-19", allergies: "Dust" },
];

// Function to display Health History section and create CIN input
function displayHealthHistory() {
  const historySection = document.getElementById("history");
  const patientDataContainer = document.getElementById("patient-data");

  // Check if the CIN input already exists. If it does, return.
  if (document.getElementById("cin-input")) return;

  // Clear the section content
  historySection.innerHTML = "";

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
    // If the patient is found, display editable fields for their data
    const patientInfo = `
      <h3>Patient Information</h3>
      <label><strong>Name:</strong></label>
      <input type="text" id="name-input" value="${patient.name}" readonly><br>
      
      <label><strong>CIN:</strong></label>
      <input type="text" id="cin-input-display" value="${patient.cin}" disabled><br>
      
      <label><strong>Age:</strong></label>
      <input type="number" id="age-input" value="${patient.age}"><br>
      
      <label><strong>Blood Type:</strong></label>
      <input type="text" id="blood-type-input" value="${patient.bloodType}"><br>
      
      <label><strong>Medicaments:</strong></label>
      <input type="text" id="medicaments-input" value="${patient.medicaments}"><br>
      
      <label><strong>Operations:</strong></label>
      <input type="text" id="operations-input" value="${patient.operations}"><br>
      
      <label><strong>Vaccination:</strong></label>
      <input type="text" id="vaccination-input" value="${patient.vaccination}"><br>
      
      <label><strong>Allergies:</strong></label>
      <input type="text" id="allergies-input" value="${patient.allergies}"><br>

      <button onclick="savePatientData('${patient.cin}')">Save Changes</button>
    `;
    patientDataContainer.innerHTML = patientInfo;
  } else {
    // If no patient is found, display an error message
    patientDataContainer.innerHTML = "<p>Patient not found. Please check the CIN and try again.</p>";
  }
}

// Function to save the modified patient data
function savePatientData(cin) {
  const patient = patientsdata.find(p => p.cin === cin);

  if (patient) {
    // Update the patient data with modified values from the input fields
    patient.age = document.getElementById("age-input").value;
    patient.bloodType = document.getElementById("blood-type-input").value;
    patient.medicaments = document.getElementById("medicaments-input").value;
    patient.operations = document.getElementById("operations-input").value;
    patient.vaccination = document.getElementById("vaccination-input").value;
    patient.allergies = document.getElementById("allergies-input").value;

    // Display a success message
    alert("Patient data saved successfully!");
  } else {
    alert("Error: Patient not found.");
  }
}
window.onload = () => {
  showSection("dashboard"); 
};

function logout() {
  window.location.href = "login.html";  // logout to login.html
}