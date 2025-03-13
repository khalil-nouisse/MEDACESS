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
      displayHealthHistory();
  }

  // Si la section est "doctors", afficher la liste des médecins
  if (sectionId === "doctors") {
      displayDoctors();
  }
}

// Données des médecins (nom et spécialité)
const doctors = [
  { name: "Dr. Smith", specialty: "Cardiologist" },
  { name: "Dr. Johnson", specialty: "Dermatologist" },
  { name: "Dr. Brown", specialty: "Pediatrician" },
  { name: "Dr. Lee", specialty: "Orthopedic Surgeon" },
];

// Fonction pour afficher la liste des médecins
function displayDoctors() {
  const doctorsList = document.getElementById("doctors-list");

  // Vider le contenu existant
  doctorsList.innerHTML = "";

  // Ajouter chaque médecin à la liste
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

// Données simulées pour les vaccinations, allergies, opérations et médicaments
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
function displayHealthHistory() {
  const historySection = document.getElementById("history");

  // Vider la section avant d'ajouter de nouveaux éléments
  historySection.innerHTML = "";

  // Ajouter la carte du groupe sanguin
  const bloodTypeCard = createBloodTypeCard();
  historySection.appendChild(bloodTypeCard);

  // Créer et ajouter les cartes pour chaque catégorie
  const vaccinationsCard = createCardWithDoctor("Vaccinations", healthHistoryData.vaccinations);
  const allergiesCard = createCardWithDoctor("Allergies", healthHistoryData.allergies);
  const operationsCard = createCardWithDoctor("Operations", healthHistoryData.operations);
  const medicamentsCard = createCardWithDoctor("Medicaments", healthHistoryData.medicaments);

  // Ajouter les cartes à la section
  historySection.appendChild(vaccinationsCard);
  historySection.appendChild(allergiesCard);
  historySection.appendChild(operationsCard);
  historySection.appendChild(medicamentsCard);
}

// Appeler la fonction pour afficher le tableau de bord par défaut au chargement de la page
window.onload = () => {
  showSection("dashboard"); // Afficher le tableau de bord par défaut
};

function logout() {
  window.location.href = "login.html";  // Redirects to login.html
}
