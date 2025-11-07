import { auth } from "./firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

document.getElementById("logoutBtn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "../index.html";
});

// Handle section switching
window.openSection = (section) => {
  document.querySelectorAll("section").forEach(s => s.classList.add("hidden"));
  if (section === "trackUnits") document.getElementById("map-section").classList.remove("hidden");
};

// Initialize Google Map for live tracking
window.initMap = () => {
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 13.0059, lng: 5.2476 }, // Sokoto default
    zoom: 12,
  });

  // Example simulated markers
  const units = [
    { name: "Unit 1", lat: 13.012, lng: 5.232 },
    { name: "Unit 2", lat: 13.025, lng: 5.260 },
    { name: "Unit 3", lat: 13.030, lng: 5.250 },
  ];

  units.forEach(u => {
    const marker = new google.maps.Marker({
      position: { lat: u.lat, lng: u.lng },
      map: map,
      title: u.name,
      icon: {
        url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
      },
    });
  });
};