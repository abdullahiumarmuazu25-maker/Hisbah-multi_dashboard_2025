import { auth, db } from "./firebase-config.js";
import { ref, set, get, child } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } 
  from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Register
const registerBtn = document.getElementById('registerBtn');
if (registerBtn) {
  registerBtn.addEventListener('click', async () => {
    const name = fullname.value;
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const uid = userCredential.user.uid;
      await set(ref(db, 'users/' + uid), { name, email, role });
      alert("Registration successful!");
      window.location.href = "index.html";
    } catch (error) {
      alert(error.message);
    }
  });
}

// Login
const loginBtn = document.getElementById('loginBtn');
if (loginBtn) {
  loginBtn.addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      const user = userCredential.user;

      // Redirect based on role
      switch (role) {
        case "admin":
          window.location.href = "dashboards/admin-dashboard.html";
          break;
        case "manager":
          window.location.href = "dashboards/manager-dashboard.html";
          break;
        case "staff":
          window.location.href = "dashboards/staff-dashboard.html";
          break;
        case "command":
          window.location.href = "dashboards/command-dashboard.html";
          break;
        case "intelligent":
          window.location.href = "dashboards/intelligent-dashboard.html";
          break;
        case "citizen":
          window.location.href = "dashboards/citizen-dashboard.html";
          break;
      }
    } catch (error) {
      alert(error.message);
    }
  });
}