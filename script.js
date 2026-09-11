// ==========================================
// SensorGrid Dashboard
// Persistent Storage using localStorage
// ==========================================

// Load saved sensors from localStorage
let sensors = JSON.parse(localStorage.getItem("sensorData")) || [];

// Get HTML elements
const sensorForm = document.getElementById("sensorForm");
const sensorTableBody = document.getElementById("sensorTableBody");
const message = document.getElementById("message");
const emptyMessage = document.getElementById("emptyMessage");

const totalSensors = document.getElementById("totalSensors");
const activeSensors = document.getElementById("activeSensors");
const waterSensors = document.getElementById("waterSensors");

const clearBtn = document.getElementById("clearBtn");


// ==========================================
// Save Sensors to localStorage
// ==========================================

function saveSensors() {
  localStorage.setItem("sensorData", JSON.stringify(sensors));
}


// ==========================================
// Add Sensor Form Submit
// ==========================================

sensorForm.addEventListener("submit", function(event) {

  // Prevent page refresh
  event.preventDefault();

  // Get input values
  const id = document.getElementById("sensorId").value.trim();
  const type = document.getElementById("sensorType").value;
  const location = document.getElementById("location").value.trim();
  const threshold = document.getElementById("threshold").value;

  // Validate empty fields
  if (id === "" || type === "" || location === "" || threshold === "") {
    showMessage("Please fill all fields!", "red");
    return;
  }

  // Validate threshold
  if (Number(threshold) < 0) {
    showMessage("Threshold cannot be negative!", "red");
    return;
  }

  // Check duplicate Sensor ID
  const duplicate = sensors.some(sensor => sensor.id === id);

  if (duplicate) {
    showMessage("Sensor ID already exists!", "red");
    return;
  }

  // Create sensor object
  const sensor = {
    id: id,
    type: type,
    location: location,
    threshold: Number(threshold),
    status: "Active"
  };

  // Add sensor to array
  sensors.push(sensor);

  // Save permanently in browser
  saveSensors();

  // Update dashboard
  displaySensors();
  updateStats();

  // Success message
  showMessage("Sensor added successfully!", "green");

  // Reset form
  sensorForm.reset();
});


// ==========================================
// Display Sensors
// ==========================================

function displaySensors() {

  sensorTableBody.innerHTML = "";

  if (sensors.length === 0) {
    emptyMessage.style.display = "block";
    return;
  }

  emptyMessage.style.display = "none";

  sensors.forEach((sensor, index) => {

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${sensor.id}</td>
      <td>${sensor.type}</td>
      <td>${sensor.location}</td>
      <td>${sensor.threshold}</td>
      <td>
        <span class="status">${sensor.status}</span>
      </td>
      <td>
        <button class="delete-btn" onclick="deleteSensor(${index})">
          Delete
        </button>
      </td>
    `;

    sensorTableBody.appendChild(row);
  });
}


// ==========================================
// Delete Sensor
// ==========================================

function deleteSensor(index) {

  sensors.splice(index, 1);

  // Save updated array
  saveSensors();

  displaySensors();
  updateStats();

  showMessage("Sensor deleted successfully!", "green");
}


// ==========================================
// Update Dashboard Statistics
// ==========================================

function updateStats() {

  totalSensors.textContent = sensors.length;

  activeSensors.textContent =
    sensors.filter(sensor => sensor.status === "Active").length;

  waterSensors.textContent =
    sensors.filter(sensor => sensor.type === "Water Level").length;
}


// ==========================================
// Clear All Sensors
// ==========================================

clearBtn.addEventListener("click", function() {

  if (sensors.length === 0) {
    showMessage("No sensors to clear!", "red");
    return;
  }

  const confirmClear = confirm(
    "Are you sure you want to delete all sensors?"
  );

  if (confirmClear) {

    sensors = [];

    // Remove saved data
    localStorage.removeItem("sensorData");

    displaySensors();
    updateStats();

    showMessage("All sensors cleared!", "green");
  }
});


// ==========================================
// Display Messages
// ==========================================

function showMessage(text, color) {

  message.textContent = text;
  message.style.color = color;

  setTimeout(() => {
    message.textContent = "";
  }, 3000);
}


// ==========================================
// Load Saved Data on Page Opening
// ==========================================

displaySensors();
updateStats();