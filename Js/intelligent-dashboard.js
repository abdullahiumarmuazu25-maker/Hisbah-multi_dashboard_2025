import { auth } from "./firebase-config.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const db = getDatabase();

document.getElementById("logoutBtn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "../index.html";
});

window.openSection = (id) => {
  document.querySelectorAll("section").forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
};

document.getElementById("intelForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const report = e.target.querySelector("textarea").value.trim();
  const reportRef = push(ref(db, "intelReports"));
  await set(reportRef, {
    report: report,
    timestamp: new Date().toISOString()
  });
  alert("✅ Intelligence report submitted.");
  e.target.reset();
});