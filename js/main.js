import {
  dataInput,
  showScreen,
  menuOn,
  fillForm,
  loadDashboard,
  showList,
} from "./ui.js";
import { logout } from "./service.js";
import { auth } from "../auth/firebaseConfig.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", async () => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      console.log("User autenticado: ", user.uid);
      const uid = user.uid;
      await showList(uid);
      await loadDashboard(uid);
      showScreen("dashboard");
    } else {
      console.log("Usuário não autenticado, redirecionando...");
      window.location.href = "login.html";
    }
  });

  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      menuOn(btn);
      const text = btn.innerText.toLowerCase().trim(); 
      if (text === "sair") return;
      if (text === "dashboard") showScreen("dashboard");
      else if (text === "registros") showScreen("lista");
      
      else if (text === "novo") showScreen("adicionar");
    });
  });

  const btnSalvar = document.getElementById("btn-salvar");
  if (btnSalvar) {
    btnSalvar.addEventListener("click", () => dataInput());
  }
  const btnLogout = document.getElementById("btn-logout");
  btnLogout.addEventListener("click", async () => {
    await logout();
    window.location.href = "login.html";
  });

  const btnAtualizar = document.getElementById("btn-atualizar");
  btnAtualizar.addEventListener("click", () => {
    dataInput();
  });
});
