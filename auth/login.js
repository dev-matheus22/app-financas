import {
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
  browserLocalPersistence, 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { auth } from "./firebaseConfig.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form"); 

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    login();
  });
});

const login = async () => {
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("password").value.trim();

  if (!email || !senha) {
    alert("Preencha todos os campos.");
    return;
  }

  try {
    await setPersistence(auth, browserLocalPersistence);

    await signInWithEmailAndPassword(auth, email, senha);

    console.log("Sucesso! Redirecionando...");
    window.location.href = "index.html";
  } catch (error) {
    console.error("Erro no Firebase:", error.code);
    alert("Usuário ou senha inválidos.");
  }
};