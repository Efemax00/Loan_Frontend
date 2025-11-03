document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  // Tabs
  const accountTab = document.getElementById("accountTab");
  const myLoansTab = document.getElementById("myLoansTab");
  const accountSection = document.getElementById("accountSection");
  const myLoansSection = document.getElementById("myLoansSection");

  accountTab.addEventListener("click", () => {
    accountSection.style.display = "block";
    myLoansSection.style.display = "none";
  });

  myLoansTab.addEventListener("click", async () => {
    accountSection.style.display = "none";
    myLoansSection.style.display = "block";
    loadMyLoans();
  });

  // Fetch user info (decode or fetch from backend)
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    document.getElementById("userName").textContent = user.name;
    document.getElementById("userEmail").textContent = user.email;
  }

  // Fetch loans
  async function loadMyLoans() {
    try {
      const res = await fetch("http://localhost:5009/api/loans/myloans", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const loans = await res.json();

      const table = document.getElementById("loansTable");
      table.innerHTML = "";

      loans.forEach(loan => {
        const row = `<tr>
          <td>${loan.amount}</td>
          <td>${loan.purpose}</td>
          <td>${loan.status || "Pending"}</td>
          <td>${new Date(loan.createdAt).toLocaleDateString()}</td>
        </tr>`;
        table.innerHTML += row;
      });
    } catch (error) {
      console.error(error);
      alert("Error loading your loans");
    }
  }

  // Logout
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "login.html";
  });
});
