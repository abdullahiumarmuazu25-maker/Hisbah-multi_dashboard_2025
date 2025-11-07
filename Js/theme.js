document.getElementById("settingsForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const orgName = document.getElementById("orgName").value;
  const themeColor = document.getElementById("themeColor").value;
  const language = document.getElementById("language").value;

  localStorage.setItem("orgName", orgName);
  localStorage.setItem("themeColor", themeColor);
  localStorage.setItem("language", language);

  document.getElementById("settingsMessage").innerText = "Settings saved successfully!";
});