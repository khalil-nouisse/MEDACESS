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

// function to create a card (box) with items grouped by doctor.
function createCardWithDoctor(title, items) {
  const card = document.createElement("div");
  card.className = "history-card";

  const cardTitle = document.createElement("h3");
  cardTitle.textContent = title;
  card.appendChild(cardTitle);

  // group elements by doctor
  const groupedByDoctor = groupByDoctor(items);

  // Loop through each doctor and create a section for them
  for (const doctor in groupedByDoctor) {
      const doctorSection = document.createElement("div");
      doctorSection.className = "doctor-section";

      const doctorName = document.createElement("h4");
      doctorName.textContent = `Doctor: ${doctor}`;
      doctorSection.appendChild(doctorName);

      groupedByDoctor[doctor].forEach(item => {
          const itemDiv = document.createElement("div");
          itemDiv.className = "history-item";

          for (const key in item) {
              if (key !== "doctor") { 
                  const p = document.createElement("p");
                  p.textContent = `${key}: ${item[key]}`;
                  itemDiv.appendChild(p);
              }
          }

          doctorSection.appendChild(itemDiv);
      });

      card.appendChild(doctorSection);
  }

  return card;
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

// display data on the healthcare history section
function displayHealthHistory() {
  const historySection = document.getElementById("history");

  //hide section
  historySection.innerHTML = "";

  // Add the card for blood type
  const bloodTypeCard = createBloodTypeCard();
  historySection.appendChild(bloodTypeCard);

  // Create and add the cards for each category.
  const vaccinationsCard = createCardWithDoctor("Vaccinations", healthHistoryData.vaccinations);
  const allergiesCard = createCardWithDoctor("Allergies", healthHistoryData.allergies);
  const operationsCard = createCardWithDoctor("Operations", healthHistoryData.operations);
  const medicamentsCard = createCardWithDoctor("Medicaments", healthHistoryData.medicaments);

  // add cards to the section
  historySection.appendChild(vaccinationsCard);
  historySection.appendChild(allergiesCard);
  historySection.appendChild(operationsCard);
  historySection.appendChild(medicamentsCard);
}

// call the dashboard function to display dashboard when we display the page
window.onload = () => {
  showSection("dashboard"); 
};

function logout() {
  window.location.href = "login.html";  // logout to login.html
}
