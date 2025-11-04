console.log("🌍 Current origin:", window.location.origin);
console.log("🔑 Token before anything:", localStorage.getItem("token"));
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  console.log("📱 Dashboard loaded on:", navigator.userAgent);
  console.log("🔑 Token found:", token);

   console.log("🔍 Checking token on dashboard:", token);
   alert("Token on dashboard: " + token);

  if (!token) {
  console.warn("No token found — likely different origin.");
  alert("Please open dashboard from the same site where you logged in.");
  return;
}


  // Load user info safely
  const user = JSON.parse(localStorage.getItem("user"));
  const userName = document.getElementById("userName");
  const userEmail = document.getElementById("userEmail");

  if (user) {
    if (userName) userName.textContent = user.name;
    if (userEmail) userEmail.textContent = user.email;
    const welcomeUser = document.getElementById("welcomeUser");
    if (welcomeUser) welcomeUser.textContent = `Welcome, ${user.name}!`;
  }

  // Fetch loans
  async function loadMyLoans() {
    try {
      const res = await fetch("https://loan-backend-xahc.onrender.com/api/loans/myloans", {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Failed to fetch loans");
      const loans = await res.json();

      const table = document.getElementById("loansTable");
      if (!table) return console.warn("No #loansTable found.");

      table.innerHTML = "";
      loans.forEach(loan => {
        const row = `
          <tr>
            <td>${loan.amount}</td>
            <td>${loan.purpose}</td>
            <td>${loan.status || "Pending"}</td>
            <td>${new Date(loan.createdAt).toLocaleDateString()}</td>
          </tr>`;
        table.innerHTML += row;
      });
    } catch (error) {
      console.error("❌ Error loading loans:", error);
      alert("Unable to load your loans. Please try again.");
    }
  }

  // Load loans automatically (optional)
  loadMyLoans();

  // Logout
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "login.html";
    });
  }
});
