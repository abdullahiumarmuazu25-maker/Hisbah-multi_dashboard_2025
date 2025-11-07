// js/staff-dashboard.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { getDatabase, ref, set, push } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-storage.js";
import { firebaseConfig } from "./firebase-config.js";
import { startTracking, stopTracking } from './map-tracking.js';
import { getAuth } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

const auth = getAuth();
onAuthStateChanged(auth, user => {
  if (!user) return;
  const meta = { name: user.displayName || user.email, role: 'staff' };
  document.getElementById('startTracking').addEventListener('click', () => startTracking(user.uid, meta));
  document.getElementById('stopTracking').addEventListener('click', () => stopTracking());
});
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app);

let watchId = null;
let marker = null;
let map = null;

onAuthStateChanged(auth, user => {
  if (!user) return window.location.href = '../login.html';
  get(ref(db, `users/${user.uid}`)).then(snap => {
    const u = snap.val();
    if (!u || u.role !== 'staff') { alert('Access denied'); signOut(auth); return; }
    initPage(user);
  });
});

function initPage(user) {
  map = L.map('map').setView([13.0657,5.2476], 11);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

  document.getElementById('startTracking').onclick = startTracking;
  document.getElementById('stopTracking').onclick = stopTracking;
  document.getElementById('sendAlert').onclick = sendAlert;
  document.getElementById('submitReport').onclick = submitReport;
  document.getElementById('logoutBtn').onclick = async () => { await signOut(auth); location.href='../login.html'; };

  // load profile image if saved
  // ...
}

function startTracking() {
  if (!navigator.geolocation) return alert('Geolocation not supported');
  watchId = navigator.geolocation.watchPosition(pos => {
    const lat = pos.coords.latitude, lng = pos.coords.longitude;
    document.getElementById('latitude').innerText = lat.toFixed(5);
    document.getElementById('longitude').innerText = lng.toFixed(5);

    if (!marker) marker = L.marker([lat,lng]).addTo(map).bindPopup('You are here').openPopup();
    else marker.setLatLng([lat,lng]);
    map.setView([lat,lng], 14);

    // write to realtime DB
    const user = auth.currentUser;
    if (user) {
      set(ref(db, `locations/${user.uid}`), {
        name: user.displayName || 'Officer',
        lat, lng,
        timestamp: new Date().toISOString(),
        uid: user.uid
      });
    }
  }, err => alert('Location error: ' + err.message), { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 });
}

function stopTracking() {
  if (watchId !== null) { navigator.geolocation.clearWatch(watchId); watchId = null; alert('Tracking stopped'); }
}

function sendAlert(){
  const message = document.getElementById('alertMessage').value.trim();
  const user = auth.currentUser;
  if (!message || !user) return alert('Type message');
  const aRef = push(ref(db, 'alerts'));
  aRef.set({ message, sender: user.displayName || user.email, uid: user.uid, timestamp: new Date().toISOString() });
  document.getElementById('alertMessage').value = '';
  alert('Alert sent');
}

function submitReport(){
  const text = document.getElementById('dailyReport').value.trim();
  const user = auth.currentUser;
  if (!text || !user) return alert('Type report');
  const rRef = push(ref(db, `reports/${user.uid}`));
  rRef.set({ message: text, name: user.displayName || user.email, date: new Date().toISOString() });
  document.getElementById('dailyReport').value = '';
  // add to global reports listing
  const gRef = push(ref(db, 'reports_all'));
  gRef.set({ sender: user.displayName || user.email, message: text, date: new Date().toISOString() });
  alert('Report submitted');
}

import { auth } from "./firebase-config.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-storage.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app);

const db = getDatabase();

document.getElementById("logoutBtn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "../index.html";
});

window.openSection = (id) => {
  document.querySelectorAll("section").forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
};

document.getElementById("incidentForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = e.target.querySelector("textarea").value.trim();
  const newRef = push(ref(db, "incidentReports"));
  await set(newRef, {
    text: text,
    timestamp: new Date().toISOString()
  });
  alert("✅ Report sent successfully.");
  e.target.reset();
});