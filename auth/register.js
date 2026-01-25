import { auth, db } from "./firebaseConfig.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { addDoc, collection } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  let form = document.getElementById("registerForm");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    register();
  });
});

const register = async () => {
  let nome = document.getElementById("name").value.trim();
  let age = document.getElementById("age").value;
  let email = document.getElementById("email").value;
  let senha = document.getElementById("password").value;
  let senhaConfirm = document.getElementById("passwordConfirm").value;

  if (nome === "") {
    alert("Nome inválido");
    return;
  }
if (isNaN(Number(age)) || age <= 0) {
    alert("Idade inválida");
    return;
}


  if (!email.includes("@")) {
    alert("Email inválido");
    return;
  }

  if (senha.length < 8) {
    alert("A senha precisa ter pelo menos 8 caracteres");
    return;
  }

  if (senha !== senhaConfirm) {
    alert("As senhas não coincidem");
    return;
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;
    await addDoc(collection(db, "users"), {
      uid: user.uid, // ID gerado pelo Firebase Auth
      name: nome,
      age: Number(age),
      email: email,
      createdAt: new Date().toISOString(),
    });

    alert("Usuário criado com sucesso!");
    window.location.href = "index.html";
  } catch (error) {
    console.error(error);
    alert("Criação do usuário falhou. Tente novamente." + error.message);
  }
};


