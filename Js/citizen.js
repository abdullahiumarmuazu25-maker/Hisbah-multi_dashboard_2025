import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
const db = getDatabase();

document.getElementById("citizenForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const [nameInput, messageInput] = e.target.elements;
  const entry = {
    name: nameInput.value.trim() || "Anonymous",
    message: messageInput.value.trim(),
    timestamp: new Date().toISOString()
  };
  await set(push(ref(db, "citizenReports")), entry);
  alert("✅ Report successfully sent to Hisbah Board.");
  e.target.reset();
});