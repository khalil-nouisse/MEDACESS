const BASE_URL = 'http://localhost:3000';

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


let doctorIDs = []; // Stores extracted addedBy values (doctor IDs)
let doctorsData = []; // Stores the final list of doctor details

// Function to fetch user health history and extract doctor IDs
async function fetchAndProcessHealthHistory() {
  try {
    // Fetch the first set of data (addedBy values) from /user/dash3
    const response1 = await fetch(`${BASE_URL}/user/dash3`);
    const responseData1 = await response1.json();

    if (responseData1.success && Array.isArray(responseData1.data)) {
      // Extract doctor IDs from the response data
      doctorIDs = transformData(responseData1.data);
      console.log("Extracted Doctor IDs from dash:", doctorIDs);

      // Now fetch corresponding doctor data from /user/dash2 based on the doctor IDs
      await fetchDoctorsByID(doctorIDs);
    } else {
      console.error("Error fetching data from /user/dash3 or invalid data format");
    }
  } catch (error) {
    console.error("Error fetching health history:", error);
  }
}

// Function to extract only the "addedBy" values (doctor IDs)
function transformData(data) {
  return data.map(item => item.addedBy);
}

// Function to fetch doctor details using their IDs from /user/dash2
async function fetchDoctorsByID(doctorIDs) {
  try {
    if (doctorIDs.length === 0) {
      console.log("No doctor IDs found.");
      return;
    }

    // Debug: Log what we're sending
    console.log("Sending to server:", JSON.stringify({ doctorIDs }));

    // Send the doctor IDs to /user/dash2
    const response = await fetch(`${BASE_URL}/user/dash2`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ doctorIDs })
    });

    const doctorData = await response.json();
    
    if (!doctorData || !doctorData.success || !Array.isArray(doctorData.data)) {
      console.error("Error fetching doctor details or invalid response format:", doctorData);
      return;
    }

    // Store the fetched doctor data
    doctorsData = doctorData.data;
    displayDoctors(doctorsData);
  } catch (error) {
    console.error("Full error fetching doctor details:", error);
  }
}

// Function to display the fetched doctors
function displayDoctors(doctors) {
  const doctorsList = document.getElementById("doctors-list");

  // Clear the existing content
  doctorsList.innerHTML = "";

  const n = doctors.length;

  // Add each doctor to the list
  for (let i = 0; i < n; i++) {
    const doctorCard = document.createElement("div");
    doctorCard.classList.add("doctor-card");

    // Display doctor's last name
    const doctorName = document.createElement("h3");
    doctorName.textContent = doctors[i].last_name;

    // Display doctor's first name
    const doctorFirstName = document.createElement("p");
    doctorFirstName.textContent = `First Name: ${doctors[i].first_name}`;

    // Display doctor's email or specialty
    const doctorSpecialty = document.createElement("p");
    doctorSpecialty.textContent = `Email: ${doctors[i].mail}`;

    // Display doctor's phone number (assuming tel is the field for phone)
    const doctorPhone = document.createElement("p");
    doctorPhone.textContent = `Phone: ${doctors[i].tel}`;

    // Append all elements to the doctor card
    doctorCard.appendChild(doctorName);
    doctorCard.appendChild(doctorFirstName);
    doctorCard.appendChild(doctorSpecialty);
    doctorCard.appendChild(doctorPhone);

    // Append doctor card to the list
    doctorsList.appendChild(doctorCard);
  }
}

// Call the function to fetch and log the health history
fetchAndProcessHealthHistory();

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
    itemParagraph.textContent = `${item.first_name || "Unknown"} ${item.last_name || "Doctor"} - ${item.descript || "No description"}`;
    card.appendChild(itemParagraph);
  });

  return card;
}

window.addEventListener("load", () => {
  showSection("dashboard");
});

function logout() {
  window.location.href = "./auth/logout"; // logout to login.html
}