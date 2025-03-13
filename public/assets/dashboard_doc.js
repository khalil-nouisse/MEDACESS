const BASE_URL = 'http://localhost:3000';
async function fetchTreatments() {
  try {
    const response = await fetch(`${BASE_URL}/user/dash`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const apiResponse = await response.json();

    console.log("API Response:", apiResponse); // Debugging

    // Ensure treatments is an array
    if (!Array.isArray(apiResponse.treatments)) {
      throw new Error('API response does not contain a valid "treatments" array');
    }

    return apiResponse.treatments; // Return treatments array directly
  } catch (error) {
    console.error("Error fetching data:", error);
    return []; // Return an empty array on failure
  }
}



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
    displayCINInput();
}

//if its the patient sections
if (sectionId === "patients") {
    displayPatients();
}
if (sectionId === "reclamations") {
  displayReclamations();
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
// Displays the CIN input form
function displayCINInput() {
  const historySection = document.getElementById("history");
  historySection.innerHTML = ""; // Clear existing content

  const cinForm = document.createElement("div");
  cinForm.innerHTML = `
      <label for="cin">Enter CIN:</label>
      <input type="text" id="cin-input" placeholder="Enter CIN">
      <button onclick="fetchPatientData()">Submit</button>
  `;

  historySection.appendChild(cinForm);
}

// Fetches patient data based on entered CIN and displays health history
function fetchPatientData() {
  const enteredCIN = document.getElementById("cin-input").value;

  // Check if the CIN matches any patient
  const patient = patients.find(p => p.cin === enteredCIN);
  if (!patient) {
      alert("No patient found with this CIN.");
      return;
  }

  // Display the patient's health history
  displayHealthHistory(patient);
}

// Displays the health history for the given patient
function displayHealthHistory(patient) {
  const historySection = document.getElementById("history");
  historySection.innerHTML = `<h2>Health History for ${patient.name}</h2>`;

  // Sample health data (this should be fetched dynamically)
  const healthHistoryData = {
    vaccinations: [
      { name: "COVID-19 Vaccine", date: "2023-01-15", doctor: "Dr. Smith" },
      { name: "Flu Vaccine", date: "2022-10-10", doctor: "Dr. Johnson" }
    ],
    allergies: [
      { name: "Pollen", severity: "Moderate", doctor: "Dr. Smith" },
      { name: "Peanuts", severity: "Severe", doctor: "Dr. Johnson" }
    ],
    operations: [
      { name: "Appendectomy", date: "2020-05-20", doctor: "Dr. Brown" },
      { name: "Knee Surgery", date: "2018-11-12", doctor: "Dr. Smith" }
    ],
    medicaments: [
      { name: "Paracetamol", dosage: "500mg", frequency: "Twice a day", doctor: "Dr. Johnson" },
      { name: "Ibuprofen", dosage: "400mg", frequency: "Once a day", doctor: "Dr. Brown" }
    ]
  };

  // Display each category
  Object.keys(healthHistoryData).forEach(category => {
    if (healthHistoryData[category].length > 0) {
      const card = createCardWithDoctor(category.toUpperCase(), healthHistoryData[category]);
      historySection.appendChild(card);
    }
  });
}

// Creates a card with input fields for each category (Vaccinations, Allergies, Operations, Medicaments)
function createCardWithDoctor(title, items) {
  const card = document.createElement("div");
  card.className = "history-card";
  card.setAttribute("data-category", title);

  const cardTitle = document.createElement("h3");
  cardTitle.textContent = title;
  card.appendChild(cardTitle);

  // Group items by doctor
  const groupedByDoctor = groupByDoctor(items);

  Object.keys(groupedByDoctor).forEach(doctor => {
    const doctorSection = document.createElement("div");
    doctorSection.className = "doctor-section";

    const doctorName = document.createElement("h4");
    doctorName.textContent = `Doctor: ${doctor}`;
    doctorSection.appendChild(doctorName);

    groupedByDoctor[doctor].forEach((item, index) => {
      const itemDiv = document.createElement("div");
      itemDiv.className = "history-item";

      Object.keys(item).forEach(key => {
        if (key !== "doctor") {
          const p = document.createElement("p");
          p.innerHTML = `${key}: <span>${item[key]}</span>`;
          itemDiv.appendChild(p);
        }
      });

      doctorSection.appendChild(itemDiv);
    });

    // Add New Entry Section with appropriate input fields for each category
    const addEntrySection = document.createElement("div");
    addEntrySection.className = "add-entry";

    let inputFields = '';

    if (title === "VACCINATIONS") {
      inputFields = `
        <input type="text" placeholder="Vaccine Name" class="new-entry-name">
        <input type="text" placeholder="Doctor Name" class="new-entry-doctor">
        <input type="date" placeholder="Vaccination Date" class="new-entry-date">
        <button onclick="addNewEntry('${title}')">Add</button>
        <button onclick="modifyNewEntry('${title}')">Modify</button>
      `;
    } else if (title === "ALLERGIES") {
      inputFields = `
        <input type="text" placeholder="Allergy Name" class="new-entry-name">
        <input type="text" placeholder="Severity" class="new-entry-severity">
        <input type="text" placeholder="Doctor Name" class="new-entry-doctor">
        <button onclick="addNewEntry('${title}')">Add</button>
        <button onclick="modifyNewEntry('${title}')">Modify</button>
      `;
    } else if (title === "OPERATIONS") {
      inputFields = `
        <input type="text" placeholder="Operation Name" class="new-entry-name">
        <input type="date" placeholder="Operation Date" class="new-entry-date">
        <input type="text" placeholder="Doctor Name" class="new-entry-doctor">
        <button onclick="addNewEntry('${title}')">Add</button>
        <button onclick="modifyNewEntry('${title}')">Modify</button>
      `;
    } else if (title === "MEDICAMENTS") {
      inputFields = `
        <input type="text" placeholder="Medicine Name" class="new-entry-name">
        <input type="text" placeholder="Dosage" class="new-entry-dosage">
        <input type="text" placeholder="Frequency" class="new-entry-frequency">
        <input type="text" placeholder="Doctor Name" class="new-entry-doctor">
        <button onclick="addNewEntry('${title}')">Add</button>
        <button onclick="modifyNewEntry('${title}')">Modify</button>
      `;
    }

    addEntrySection.innerHTML = inputFields;
    doctorSection.appendChild(addEntrySection);

    card.appendChild(doctorSection);
  });

  return card;
}

// Group items by the doctor name
function groupByDoctor(items) {
  return items.reduce((grouped, item) => {
    const doctor = item.doctor;
    if (!grouped[doctor]) {
      grouped[doctor] = [];
    }
    grouped[doctor].push(item);
    return grouped;
  }, {});
}

// Adds a new entry for a category and doctor
function addNewEntry(category) {
  const nameInput = document.querySelector(`[data-category="${category}"] .new-entry-name`).value;
  const doctorInput = document.querySelector(`[data-category="${category}"] .new-entry-doctor`).value;
  const dateInput = document.querySelector(`[data-category="${category}"] .new-entry-date`) ? document.querySelector(`[data-category="${category}"] .new-entry-date`).value : null;
  const severityInput = document.querySelector(`[data-category="${category}"] .new-entry-severity`) ? document.querySelector(`[data-category="${category}"] .new-entry-severity`).value : null;
  const dosageInput = document.querySelector(`[data-category="${category}"] .new-entry-dosage`) ? document.querySelector(`[data-category="${category}"] .new-entry-dosage`).value : null;
  const frequencyInput = document.querySelector(`[data-category="${category}"] .new-entry-frequency`) ? document.querySelector(`[data-category="${category}"] .new-entry-frequency`).value : null;

  if (!nameInput || !doctorInput || (category === "VACCINATIONS" && !dateInput) || (category === "OPERATIONS" && !dateInput) || (category === "ALLERGIES" && !severityInput) || (category === "MEDICAMENTS" && !dosageInput && !frequencyInput)) {
    alert("Please fill in all fields.");
    return;
  }

  // Find the correct doctor section
  const doctorSection = [...document.querySelectorAll(`[data-category="${category}"] .doctor-section`)]
    .find(section => section.querySelector("h4").textContent.includes(doctorInput));

  // Create the new entry based on category
  const newItemDiv = document.createElement("div");
  newItemDiv.className = "history-item";
  let newItemContent = '';

  if (category === "VACCINATIONS") {
    newItemContent = `
      <p>Name: <span>${nameInput}</span></p>
      <p>Doctor: <span>${doctorInput}</span></p>
      <p>Date: <span>${dateInput}</span></p>
    `;
  } else if (category === "ALLERGIES") {
    newItemContent = `
      <p>Name: <span>${nameInput}</span></p>
      <p>Severity: <span>${severityInput}</span></p>
      <p>Doctor: <span>${doctorInput}</span></p>
    `;
  } else if (category === "OPERATIONS") {
    newItemContent = `
      <p>Name: <span>${nameInput}</span></p>
      <p>Date: <span>${dateInput}</span></p>
      <p>Doctor: <span>${doctorInput}</span></p>
    `;
  } else if (category === "MEDICAMENTS") {
    newItemContent = `
      <p>Name: <span>${nameInput}</span></p>
      <p>Dosage: <span>${dosageInput}</span></p>
      <p>Frequency: <span>${frequencyInput}</span></p>
      <p>Doctor: <span>${doctorInput}</span></p>
    `;
  }

  newItemDiv.innerHTML = newItemContent;
  doctorSection.appendChild(newItemDiv);
}

// Modify Entry (Placeholder)
function modifyNewEntry(category) {
  alert(`Modify entry for ${category}`);
}

// Sample reclamations data
const reclamations = [
  { patientName: "Samir Alami", text: "Request for a follow-up appointment." },
  { patientName: "Ahmed Hamid", text: "Complaint about waiting times." },
  { patientName: "Oumaima belabbas", text: "Request for medication review." },
  { patientName: "Imane benAli", text: "General inquiry about test results." },
];

// Function to display reclamations in the "Reclamations" section
function displayReclamations() {
  const container = document.getElementById("reclamations-container");

  // Clear previous reclamations
  container.innerHTML = "";

  // Loop through the reclamations array and create elements dynamically
  reclamations.forEach(reclamation => {
    const reclamationCard = document.createElement("div");
    reclamationCard.classList.add("reclamation-card");

    const patientName = document.createElement("h3");
    patientName.textContent = reclamation.patientName;

    const reclamationText = document.createElement("p");
    reclamationText.textContent = reclamation.text;

    reclamationCard.appendChild(patientName);
    reclamationCard.appendChild(reclamationText);
    
    container.appendChild(reclamationCard);
  });
}


window.onload = () => {
  showSection("dashboard"); 
};

function logout() {
  window.location.href = "./auth/logout";  // logout to login.html
}