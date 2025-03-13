const BASE_URL = 'http://localhost:3000';

async function Salam22(){
  const response = await fetch(`${BASE_URL}/user/dash`, {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
    },
  });
  
  const apiResponse = await response.json();
  
  const groupedData = apiResponse.data.reduce((acc, item) => {
    const key = item.type;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});
  
  console.log(groupedData);
  //console.log('Data => ',apiResponse);
}

async function Salam() {
  try {
    const response = await fetch(`${BASE_URL}/user/dash`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const apiResponse = await response.json();

    // Debug: Log the API response to check its structure
    console.log("API Response:", apiResponse);

    // Ensure that 'treatments' exists and is an array
    if (!Array.isArray(apiResponse.treatments)) {
      throw new Error('API response does not contain valid "treatments" array');
    }

    // Group data by type
    return apiResponse.treatments.reduce((acc, item) => {
      const key = item.type;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {});
  } catch (error) {
    console.error("Error fetching data:", error);
    return {}; // Return an empty object on failure
  }
}

async function displayHealthHistory() {
  const historySection = document.getElementById("history");
  
  // Hide section content
  historySection.innerHTML = "";

  // Add the card for blood type
  const bloodTypeCard = createBloodTypeCard();
  historySection.appendChild(bloodTypeCard);

  // Fetch and wait for data
  const healthHistoryData = await Salam();

  console.log('HealthHistory:', healthHistoryData);

  // Loop through each grouped type and create a card
  Object.entries(healthHistoryData).forEach(([type, items]) => {
    const card = createCardWithDoctor(type, items);
    historySection.appendChild(card);
  });
}

function createCardWithDoctor(type, items) {
  const card = document.createElement("div");
  card.className = "history-card";

  const cardTitle = document.createElement("h3");
  
  // Convert type to number and match correctly
  switch (Number(type)) {
    case 0: cardTitle.textContent = "Vaccination"; break;
    case 1: cardTitle.textContent = "Operation"; break;
    case 2: cardTitle.textContent = "Consultation"; break;
    case 3: cardTitle.textContent = "Lunettes"; break;
    case 4: cardTitle.textContent = "Changement"; break;
    default: cardTitle.textContent = "Unknown Type"; break;
  }

  card.appendChild(cardTitle);

  // Add each item as a paragraph
  items.forEach(item => {
    const itemParagraph = document.createElement("p");
    itemParagraph.textContent = `${item.first_name} ${item.last_name} - ${item.descript}`;
    card.appendChild(itemParagraph);
  });

  return card;
}



// BLOOD type constent for patient
const patientBloodType = "A+";
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

  //if the section is history display health history for patient
  if (sectionId === "history") {
      displayHealthHistory();
  }
  //if section is doctors , display list of doctors
  if (sectionId === "doctors") {
      displayDoctors();
  }
  if (sectionId === "reclamation") {
    populateDoctorsDropdown();
}
}

// data of doctors(name,speciality)
const doctors = [
  { name: "Dr. Smith", specialty: "Cardiologist" },
  { name: "Dr. Johnson", specialty: "Dermatologist" },
  { name: "Dr. Brown", specialty: "Pediatrician" },
  { name: "Dr. Lee", specialty: "Orthopedic Surgeon" },
];

// function to display doctors
function displayDoctors() {
  const doctorsList = document.getElementById("doctors-list");

  //  Empty existent content
  doctorsList.innerHTML = "";

  //  add doctor to the list
  doctors.forEach((doctor) => {
      const doctorCard = document.createElement("div");
      doctorCard.classList.add("doctor-card");

      const doctorName = document.createElement("h3");
      doctorName.textContent = doctor.name;

      const doctorSpecialty = document.createElement("p");
      doctorSpecialty.textContent = doctor.specialty;

      doctorCard.appendChild(doctorName);
      doctorCard.appendChild(doctorSpecialty);

      doctorsList.appendChild(doctorCard);
  });
}

// Simulated data for vaccinations, allergies, surgeries, and medications
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

// function to regroup elements by doctor
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

// function to create the blood type section
function createBloodTypeCard() {
  const card = document.createElement("div");
  card.className = "history-card";

  const cardTitle = document.createElement("h3");
  cardTitle.textContent = "Patient Blood Type";
  card.appendChild(cardTitle);

  const bloodTypeInfo = document.createElement("p");
  bloodTypeInfo.textContent = `Blood Type: ${patientBloodType}`;
  card.appendChild(bloodTypeInfo);

  return card;
}


// Function to populate doctors dropdown in reclamation form
function populateDoctorsDropdown() {
  const doctorSelect = document.getElementById("doctor");
  doctorSelect.innerHTML = ""; // Clear the existing options

  // Add default "Select a doctor" option
  const defaultOption = document.createElement("option");
  defaultOption.textContent = "Select a doctor";
  doctorSelect.appendChild(defaultOption);

  // Add each doctor to the dropdown
  doctors.forEach((doctor) => {
      const option = document.createElement("option");
      option.value = doctor.name;
      option.textContent = doctor.name;
      doctorSelect.appendChild(option);
  });
}

// Function to handle reclamation submission
function submitReclamation() {
  const doctor = document.getElementById("doctor").value;
  const reclamationText = document.getElementById("reclamation").value;

  // Validate input
  if (!doctor || !reclamationText) {
      alert("Please select a doctor and provide your reclamation.");
      return;
  }

  // Simulate sending the reclamation (e.g., to a server or display a confirmation)
  alert(`Your reclamation has been submitted to ${doctor}. Thank you!`);

  // Clear the form
  document.getElementById("doctor").value = "";
  document.getElementById("reclamation").value = "";
}
// call the dashboard function to display dashboard when we display the page
window.onload = () => {
  showSection("dashboard"); 
};

function logout() {
  window.location.href = "login.html";  // logout to login.html
}
