const BASE_URL = 'http://localhost:3000';

let doctorIDs = []; // Stores extracted addedBy values (doctor IDs)
let doctorsData = []; // Stores the final list of doctor details

// Function to fetch user health history and extract doctor IDs
async function fetchAndProcessHealthHistory() {
  try {
    // Fetch the first set of data (addedBy values) from /user/dash
    const response1 = await fetch(`${BASE_URL}/user/dash`);
    const responseData1 = await response1.json();

    if (responseData1.success) {
      // Extract doctor IDs from the response data
      doctorIDs = transformData(responseData1.data);
      console.log("Extracted Doctor IDs from dash:", doctorIDs);

      // Now fetch corresponding doctor data from /user/dash2 based on the doctor IDs
      await fetchDoctorsByID(doctorIDs);
    } else {
      console.error("Error fetching data from /user/dash");
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
    console.log("Fetched Doctor Data:", doctorData);

    if (!doctorData.success) {
      console.error("Error fetching doctor details:", doctorData.message);
      return;
    }

    // Store the fetched doctor data
    doctorsData = doctorData.data;

    // Now you can display or use the doctorsData for your application
    displayDoctors(doctorsData);
    console.log(doctorsData);
  } catch (error) {
    console.error("Full error fetching doctor details:", error);
  }
}

// Function to display the fetched doctors
function displayDoctors(doctors) {
  const doctorsList = document.getElementById("doctors-list");

  // Clear the existing content
  doctorsList.innerHTML = "";

  const n=doctors.length;
    // Ajouter chaque médecin à la liste
    for(let i=0;i<n;i++) {
        const doctorCard = document.createElement("div");
        doctorCard.classList.add("doctor-card");
  
        const doctorName = document.createElement("h3");
        doctorName.textContent = doctors[i].last_name;
  
        const doctorSpecialty = document.createElement("p");
        doctorSpecialty.textContent = doctors[i].mail;
        console.log(doctors[i].first_name);
        doctorCard.appendChild(doctorName);
        doctorCard.appendChild(doctorSpecialty);
  
        doctorsList.appendChild(doctorCard);
    };
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
    itemParagraph.textContent = `${item.first_name} ${item.last_name} - ${item.descript}`;
    card.appendChild(itemParagraph);
  });

  return card;
}

















// Groupe sanguin constant du patient
const patientBloodType = "A+";

// Fonction pour afficher une section et masquer les autres
function showSection(sectionId) {
  // Masquer toutes les sections
  document.querySelectorAll("main section").forEach(section => {
      section.style.display = "none";
  });

  // Afficher la section sélectionnée
  document.getElementById(sectionId).style.display = "block";

  // Supprimer la classe "active" de tous les éléments de la barre latérale
  document.querySelectorAll(".sidebar ul li").forEach(item => {
      item.classList.remove("active");
  });

  // Ajouter la classe "active" à l'élément cliqué
  const clickedItem = document.querySelector(`.sidebar ul li[onclick*="${sectionId}"]`);
  if (clickedItem) {
      clickedItem.classList.add("active");
  }

  // Si la section est "history", afficher les données de santé
  if (sectionId === "history") {
    fetchAndProcessHealthHistory();
  }

  // Si la section est "doctors", afficher la liste des médecins
  if (sectionId === "doctors") {
      displayDoctors();
  }
}

// Données des médecins (nom et spécialité)
let doctors = [
  { name: "Dr. Smith", specialty: "Cardiologist" },
  { name: "Dr. Johnson", specialty: "Dermatologist" },
  { name: "Dr. Brown", specialty: "Pediatrician" },
  { name: "Dr. Lee", specialty: "Orthopedic Surgeon" },
];

// Fonction pour afficher la liste des médecins


// Données simulées pour les vaccinations, allergies, opérations et médicaments
/*
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
};*/

// Fonction pour regrouper les éléments par médecin
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

// Fonction pour créer une carte (box) avec les éléments groupés par médecin
function createCardWithDoctor(title, items) {
  const card = document.createElement("div");
  card.className = "history-card";

  const cardTitle = document.createElement("h3");
  cardTitle.textContent = title;
  card.appendChild(cardTitle);

  // Grouper les éléments par médecin
  const groupedByDoctor = groupByDoctor(items);

  // Parcourir chaque médecin et créer une section pour lui
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
              if (key !== "doctor") { // Ne pas afficher le champ "doctor" dans les détails
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

// Fonction pour créer une carte pour le groupe sanguin du patient
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

// Fonction pour afficher les données de santé dans la section "Health History"
function displayHealthHistory(healthHistoryData) {
  const historySection = document.getElementById("history");
  historySection.innerHTML = "";
  healthHistoryData = fetch

  const bloodTypeCard = createBloodTypeCard();
  historySection.appendChild(bloodTypeCard);

  // Create and append category cards
  if (healthHistoryData.vaccinations.length)
    historySection.appendChild(createCardWithDoctor("Vaccinations", healthHistoryData.vaccinations));

  if (healthHistoryData.allergies.length)
    historySection.appendChild(createCardWithDoctor("Allergies", healthHistoryData.allergies));

  if (healthHistoryData.operations.length)
    historySection.appendChild(createCardWithDoctor("Operations", healthHistoryData.operations));

  if (healthHistoryData.medicaments.length)
    historySection.appendChild(createCardWithDoctor("Medicaments", healthHistoryData.medicaments));
}

// Appeler la fonction pour afficher le tableau de bord par défaut au chargement de la page
window.onload = () => {
  showSection("dashboard"); // Afficher le tableau de bord par défaut
};

function logout() {
  window.location.href = "/logout";  

}