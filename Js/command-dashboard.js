import { auth } from "./firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

document.getElementById("logoutBtn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "../index.html";
});

window.openSection = (section) => {
  document.querySelectorAll("section").forEach(s => s.classList.add("hidden"));
  if (section === "trackMap") document.getElementById("map-section").classList.remove("hidden");
};

window.initMap = () => {
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 13.0059, lng: 5.2476 },
    zoom: 13,
  });

  // Example moving marker (simulated GPS)
  const marker = new google.maps.Marker({
    position: { lat: 13.01, lng: 5.25 },
    map: map,
    title: "Unit Tracker",
    icon: "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
  });

  setInterval(() => {
    marker.setPosition({
      lat: marker.getPosition().lat() + (Math.random() - 0.5) * 0.002,
      lng: marker.getPosition().lng() + (Math.random() - 0.5) * 0.002
    });
  }, 3000);
};